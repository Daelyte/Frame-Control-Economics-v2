-- Frame Economics Database Setup - New API Key System Compatible
-- Updated for sb_publishable_ and sb_secret_ key formats
-- Copy and paste this entire script into your Supabase SQL Editor and run it

-- 1. Create the users table (for community features)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  full_name TEXT CHECK (length(full_name) BETWEEN 1 AND 100),
  avatar_url TEXT CHECK (avatar_url ~* '^https?://'),
  username TEXT UNIQUE NOT NULL CHECK (length(username) BETWEEN 3 AND 30 AND username ~* '^[a-zA-Z0-9_-]+$'),
  bio TEXT CHECK (length(bio) <= 500),
  is_banned BOOLEAN DEFAULT FALSE,
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create stories table
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 5 AND 200),
  content TEXT NOT NULL CHECK (length(content) BETWEEN 10 AND 5000),
  category TEXT NOT NULL CHECK (category IN ('success', 'challenge', 'insight', 'question')),
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  comments_count INTEGER DEFAULT 0 CHECK (comments_count >= 0),
  is_flagged BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  flagged_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  depth INTEGER DEFAULT 0 CHECK (depth >= 0 AND depth <= 5),
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  is_flagged BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, story_id),
  UNIQUE(user_id, comment_id)
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for users table
-- Updated for new API key system compatibility
CREATE POLICY "Users can view non-banned profiles" ON public.users 
  FOR SELECT USING (NOT is_banned OR auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id AND NOT is_banned)
  WITH CHECK (auth.uid() = id AND NOT is_banned);
  
CREATE POLICY "Users can insert own profile" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. Create RLS Policies for stories table
CREATE POLICY "Anyone can view approved stories" ON public.stories 
  FOR SELECT USING (is_approved AND NOT is_flagged);
  
CREATE POLICY "Authors can view own stories" ON public.stories 
  FOR SELECT USING (auth.uid() = author_id);
  
CREATE POLICY "Non-banned users can insert stories" ON public.stories 
  FOR INSERT WITH CHECK (
    auth.uid() = author_id 
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND NOT is_banned
    )
  );
  
CREATE POLICY "Users can update own non-flagged stories" ON public.stories 
  FOR UPDATE USING (auth.uid() = author_id AND NOT is_flagged)
  WITH CHECK (auth.uid() = author_id);
  
CREATE POLICY "Users can delete own stories" ON public.stories 
  FOR DELETE USING (auth.uid() = author_id);

-- 8. Create RLS Policies for comments table
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- 9. Create RLS Policies for likes table
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- 10. Grant permissions - Updated for new API key system
-- Both legacy and new roles for compatibility during transition
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant permissions to new API key roles (if they exist)
DO $$ BEGIN
    -- Try to grant to new publishable role if it exists
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'publishable') THEN
        GRANT USAGE ON SCHEMA public TO publishable;
        GRANT SELECT ON ALL TABLES IN SCHEMA public TO publishable;
        GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO publishable;
    END IF;
    
    -- Try to grant to new secret role if it exists  
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'secret') THEN
        GRANT USAGE ON SCHEMA public TO secret;
        GRANT ALL ON ALL TABLES IN SCHEMA public TO secret;
        GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO secret;
        GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO secret;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- If roles don't exist, continue with legacy roles
    NULL;
END $$;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON public.stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_category ON public.stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON public.comments(story_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_story_id ON public.likes(story_id);

-- 12. Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, username)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- If there's an error (like duplicate username), try with a unique username
  INSERT INTO public.users (id, email, full_name, avatar_url, username)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    split_part(new.email, '@', 1) || '_' || substring(new.id::text from 1 for 8)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 14. Enable Realtime for live updates (compatible with new API keys)
DO $$ BEGIN
    -- Try to add tables to realtime publication
    ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
EXCEPTION WHEN duplicate_object THEN
    -- Tables already added to publication
    NULL;
EXCEPTION WHEN OTHERS THEN
    -- If publication doesn't exist or other error, create basic publication
    CREATE PUBLICATION IF NOT EXISTS supabase_realtime FOR TABLE public.stories, public.comments, public.likes, public.users;
END $$;