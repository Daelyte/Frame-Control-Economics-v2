# Supabase Setup Guide for Frame Economics

## Current Issue
Your current Supabase URL `https://incldnepzwdrodznroat.supabase.co` returns a 404 error, indicating the project doesn't exist or is inaccessible.

## Steps to Fix

### 1. Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `frame-economics`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Project Credentials
Once your project is ready:
1. Go to Settings → API
2. Copy your:
   - **Project URL** (starts with `https://xyz.supabase.co`)
   - **anon/public API key**
   - **service_role API key** (for admin operations)

### 3. Update Your .env.local File
Replace the current values in `.env.local`:

```env
# Update these with your new Supabase project credentials
VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key_here
```

### 4. Create Database Tables
Go to your Supabase dashboard → SQL Editor and run this schema:

```sql
-- Enable RLS (Row Level Security)
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  avatar_url text,
  provider text not null check (provider in ('github', 'google')),
  username text unique,
  bio text,
  rules_completed integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create stories table
create table public.stories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  rule_id integer,
  category text not null check (category in ('success_story', 'challenge', 'insight', 'question')),
  tags text[] default '{}',
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  story_id uuid references public.stories(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create likes table
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  story_id uuid references public.stories(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, story_id),
  unique(user_id, comment_id),
  check (
    (story_id is not null and comment_id is null) or 
    (story_id is null and comment_id is not null)
  )
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- Create policies
-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Stories policies
create policy "Stories are viewable by everyone" on public.stories
  for select using (true);

create policy "Authenticated users can insert stories" on public.stories
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own stories" on public.stories
  for update using (auth.uid() = user_id);

create policy "Users can delete own stories" on public.stories
  for delete using (auth.uid() = user_id);

-- Comments policies
create policy "Comments are viewable by everyone" on public.comments
  for select using (true);

create policy "Authenticated users can insert comments" on public.comments
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own comments" on public.comments
  for update using (auth.uid() = user_id);

create policy "Users can delete own comments" on public.comments
  for delete using (auth.uid() = user_id);

-- Likes policies
create policy "Likes are viewable by everyone" on public.likes
  for select using (true);

create policy "Authenticated users can manage their likes" on public.likes
  for all using (auth.uid() = user_id);

-- Create functions for updating counts
create or replace function increment_story_comments()
returns trigger as $$
begin
  update public.stories 
  set comments_count = comments_count + 1
  where id = new.story_id;
  return new;
end;
$$ language plpgsql;

create or replace function decrement_story_comments()
returns trigger as $$
begin
  update public.stories 
  set comments_count = comments_count - 1
  where id = old.story_id;
  return old;
end;
$$ language plpgsql;

-- Create triggers
create trigger on_comment_created
  after insert on public.comments
  for each row execute procedure increment_story_comments();

create trigger on_comment_deleted
  after delete on public.comments
  for each row execute procedure decrement_story_comments();

-- Handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'provider', 'email')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 5. Configure Authentication Providers
If you want GitHub/Google login:
1. Go to Authentication → Providers in your Supabase dashboard
2. Enable GitHub and/or Google
3. Add your OAuth app credentials

### 6. Test the Connection
After updating your `.env.local` file, run:
```bash
npm run dev
```

Then navigate to the Test tab to verify all connections are working.

## Quick Test Command
After setup, you can test the connection with:
```bash
node test-supabase.js
```