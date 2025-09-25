-- Frame Economics Community Platform - Complete SQL Schema
-- Paste this entire file into Supabase SQL Editor and click RUN

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_profiles_username on public.profiles(username);

alter table public.profiles enable row level security;

create policy "Profiles select self" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Profiles insert self" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Profiles update self" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Stories (community posts)
create table if not exists public.stories (
  id bigint primary key generated always as identity,
  author_id uuid not null references auth.users(id),
  title text not null,
  body text not null,
  category text not null, -- success, challenge, insight, question
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_stories_author on public.stories(author_id);
create index if not exists idx_stories_category on public.stories(category);
create index if not exists idx_stories_created_at on public.stories(created_at);

alter table public.stories enable row level security;

create policy "Stories select public" on public.stories for select to anon using (true);
create policy "Stories insert self" on public.stories for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "Stories update self" on public.stories for update to authenticated using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "Stories delete self" on public.stories for delete to authenticated using (author_id = (select auth.uid()));

-- Comments (threaded replies)
create table if not exists public.comments (
  id bigint primary key generated always as identity,
  story_id bigint not null references public.stories(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  parent_id bigint references public.comments(id),
  body text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_comments_story on public.comments(story_id);
create index if not exists idx_comments_parent on public.comments(parent_id);
create index if not exists idx_comments_author on public.comments(author_id);
create index if not exists idx_comments_created_at on public.comments(created_at);

alter table public.comments enable row level security;

create policy "Comments select public" on public.comments for select to anon using (true);
create policy "Comments insert self" on public.comments for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "Comments update self" on public.comments for update to authenticated using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "Comments delete self" on public.comments for delete to authenticated using (author_id = (select auth.uid()));

-- Likes (for stories and comments)
create table if not exists public.likes (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id),
  story_id bigint references public.stories(id) on delete cascade,
  comment_id bigint references public.comments(id) on delete cascade,
  created_at timestamp with time zone default now(),
  constraint one_like_per_target unique(user_id, story_id, comment_id)
);

create index if not exists idx_likes_user on public.likes(user_id);
create index if not exists idx_likes_story on public.likes(story_id);
create index if not exists idx_likes_comment on public.likes(comment_id);

alter table public.likes enable row level security;

create policy "Likes select self" on public.likes for select to authenticated using (user_id = (select auth.uid()));
create policy "Likes insert self" on public.likes for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Likes delete self" on public.likes for delete to authenticated using (user_id = (select auth.uid()));

-- Moderation (flags & bans)
create table if not exists public.flags (
  id bigint primary key generated always as identity,
  reporter_id uuid not null references auth.users(id),
  story_id bigint references public.stories(id),
  comment_id bigint references public.comments(id),
  reason text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_flags_reporter on public.flags(reporter_id);
create index if not exists idx_flags_story on public.flags(story_id);
create index if not exists idx_flags_comment on public.flags(comment_id);

alter table public.flags enable row level security;

create policy "Flags insert auth" on public.flags for insert to authenticated with check ((select auth.uid()) = reporter_id);
create policy "Flags select admin" on public.flags for select to authenticated using (
  (auth.jwt() ->> 'role') = 'admin'
);

-- Simple bans table for admin use
create table if not exists public.bans (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id),
  banned_until timestamp with time zone,
  reason text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_bans_user on public.bans(user_id);

alter table public.bans enable row level security;

create policy "Bans admin" on public.bans for select to authenticated using (
  (auth.jwt() ->> 'role') = 'admin'
);
create policy "Bans insert admin" on public.bans for insert to authenticated with check ((auth.jwt() ->> 'role') = 'admin');

-- Rate limiting helper table (track events)
create table if not exists public.rate_limit_events (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id),
  event_type text not null, -- story_create, comment_create, etc
  created_at timestamp with time zone default now()
);

create index if not exists idx_rate_events_user on public.rate_limit_events(user_id);
create index if not exists idx_rate_events_type on public.rate_limit_events(event_type);
alter table public.rate_limit_events enable row level security;
create policy "Rate events insert self" on public.rate_limit_events for insert to authenticated with check ((select auth.uid()) = user_id);

-- Trigger to update story/comment updated_at
create or replace function public.update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stories_update_ts on public.stories;
create trigger stories_update_ts
  before update on public.stories
  for each row execute procedure public.update_timestamp();

drop trigger if exists comments_update_ts on public.comments;
create trigger comments_update_ts
  before update on public.comments
  for each row execute procedure public.update_timestamp();

-- Rate limiting function
create or replace function public.check_rate_limit(
  user_id uuid,
  event_type text,
  max_events integer,
  time_window interval
) returns boolean
language plpgsql
security definer
as $$
declare
  event_count integer;
begin
  -- Count events in the time window
  select count(*)
  into event_count
  from public.rate_limit_events
  where rate_limit_events.user_id = check_rate_limit.user_id
    and rate_limit_events.event_type = check_rate_limit.event_type
    and created_at > now() - time_window;
  
  -- Return false if rate limit exceeded
  if event_count >= max_events then
    return false;
  end if;
  
  -- Log this event
  insert into public.rate_limit_events (user_id, event_type)
  values (check_rate_limit.user_id, check_rate_limit.event_type);
  
  return true;
end;
$$;

-- Function to create story with rate limiting
create or replace function public.create_story(
  title text,
  body text,
  category text
) returns json
language plpgsql
security definer
as $$
declare
  current_user_id uuid;
  story_id bigint;
  rate_check boolean;
begin
  current_user_id := auth.uid();
  
  if current_user_id is null then
    return json_build_object('error', 'Authentication required');
  end if;
  
  -- Check rate limit (5 stories per hour)
  select public.check_rate_limit(current_user_id, 'story_create', 5, interval '1 hour')
  into rate_check;
  
  if not rate_check then
    return json_build_object('error', 'Rate limit exceeded. Maximum 5 stories per hour.');
  end if;
  
  -- Create story
  insert into public.stories (author_id, title, body, category)
  values (current_user_id, create_story.title, create_story.body, create_story.category)
  returning id into story_id;
  
  return json_build_object(
    'success', true,
    'story_id', story_id
  );
end;
$$;

-- Function to create comment with rate limiting
create or replace function public.create_comment(
  story_id bigint,
  body text,
  parent_id bigint default null
) returns json
language plpgsql
security definer
as $$
declare
  current_user_id uuid;
  comment_id bigint;
  rate_check boolean;
begin
  current_user_id := auth.uid();
  
  if current_user_id is null then
    return json_build_object('error', 'Authentication required');
  end if;
  
  -- Check rate limit (20 comments per hour)
  select public.check_rate_limit(current_user_id, 'comment_create', 20, interval '1 hour')
  into rate_check;
  
  if not rate_check then
    return json_build_object('error', 'Rate limit exceeded. Maximum 20 comments per hour.');
  end if;
  
  -- Create comment
  insert into public.comments (story_id, author_id, body, parent_id)
  values (create_comment.story_id, current_user_id, create_comment.body, create_comment.parent_id)
  returning id into comment_id;
  
  return json_build_object(
    'success', true,
    'comment_id', comment_id
  );
end;
$$;

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'preferred_username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sample data (replace UUIDs with real ones or create test users)
-- Note: These UUIDs won't work unless you have matching auth.users
-- You can remove this section or replace with actual user IDs

do $$
begin
  -- Only insert if we don't have sample data already
  if not exists (select 1 from public.profiles where username = 'demo_alice') then
    -- Sample profiles
    insert into public.profiles (id, username, full_name, bio) values
    ('00000000-0000-0000-0000-000000000001', 'demo_alice', 'Alice Demo', 'Community builder and economics enthusiast'),
    ('00000000-0000-0000-0000-000000000002', 'demo_bob', 'Bob Demo', 'Frame Economics practitioner');

    -- Sample stories
    insert into public.stories (author_id, title, body, category) values
    ('00000000-0000-0000-0000-000000000001', 'My Frame Economics Success Story', 'I applied Rule #1 (Patience Under Fire) during a difficult business negotiation. Instead of reacting emotionally when the other party tried to pressure me, I maintained my composure and took time to think. This shift allowed me to respond strategically and achieve a much better outcome than I initially expected.', 'success'),
    ('00000000-0000-0000-0000-000000000002', 'Challenge: Dealing with Emotional Manipulation', 'I''m struggling with someone who uses guilt trips and emotional manipulation to get their way. I know I should stay centered, but it''s hard when they make me feel like I''m being unreasonable. Has anyone dealt with similar situations? What Frame Economics principles helped you?', 'challenge'),
    ('00000000-0000-0000-0000-000000000001', 'Key Insight: The Power of Silence', 'I discovered that strategic silence is incredibly powerful. When someone is trying to manipulate or pressure you, staying quiet forces them to fill the void, often revealing their true intentions. This aligns perfectly with Rule #3 (Silence Games) from Frame Economics.', 'insight'),
    ('00000000-0000-0000-0000-000000000002', 'Question: Best practices for Rule #7?', 'I''m trying to better understand Rule #7 (Moving Goalposts). Can someone share practical examples of how you''ve identified when someone is shifting the criteria mid-conversation? I think I''m missing some of these situations.', 'question');

    -- Sample comments
    insert into public.comments (story_id, author_id, body) values
    (1, '00000000-0000-0000-0000-000000000002', 'This is exactly what I needed to hear! I have a similar situation coming up. How long did you practice staying composed before it became natural?'),
    (1, '00000000-0000-0000-0000-000000000001', 'It took about 3 months of conscious practice, but now it''s become instinctive. The key is to recognize the physical signs of pressure and use them as triggers to pause.'),
    (2, '00000000-0000-0000-0000-000000000001', 'I''ve been there! The key is to recognize that their emotional response is information, not instruction. Rule #4 (Mood Swings & Emotional Pace) really helps with this.'),
    (3, '00000000-0000-0000-0000-000000000002', 'Absolutely agree. I''ve found that silence also prevents you from saying something you might regret when emotions are high.');
  end if;
end $$;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;

-- Success message
select 'Frame Economics database schema setup complete! 🎉' as status;