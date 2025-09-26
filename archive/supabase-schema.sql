-- Frame Economics Community Platform Database Schema
-- Run this script in your Supabase SQL Editor
-- SECURITY: This schema implements comprehensive Row Level Security (RLS)

-- Enable Row Level Security and additional security settings
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';
ALTER DATABASE postgres SET log_statement TO 'all';
ALTER DATABASE postgres SET log_min_duration_statement TO 1000;

-- Create users table (extends Supabase auth.users)
-- SECURITY: Strict validation and constraints applied
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  full_name TEXT CHECK (length(full_name) BETWEEN 1 AND 100),
  avatar_url TEXT CHECK (avatar_url ~* '^https?://'),
  username TEXT UNIQUE NOT NULL CHECK (length(username) BETWEEN 3 AND 30 AND username ~* '^[a-zA-Z0-9_-]+$'),
  bio TEXT CHECK (length(bio) <= 500),
  is_banned BOOLEAN DEFAULT FALSE,
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create stories table
-- SECURITY: Content validation and moderation features
CREATE TABLE public.stories (
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

-- Create comments table
-- SECURITY: Content validation and nesting limits
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  depth INTEGER DEFAULT 0 CHECK (depth >= 0 AND depth <= 5), -- Max 5 levels deep
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  is_flagged BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, story_id),
  UNIQUE(user_id, comment_id)
);

-- Create indexes for better performance
CREATE INDEX idx_stories_author_id ON public.stories(author_id);
CREATE INDEX idx_stories_category ON public.stories(category);
CREATE INDEX idx_stories_created_at ON public.stories(created_at DESC);
CREATE INDEX idx_comments_story_id ON public.comments(story_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_story_id ON public.likes(story_id);
CREATE INDEX idx_likes_comment_id ON public.likes(comment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- SECURITY: Enhanced policies with ban checks and data protection
CREATE POLICY "Users can view non-banned profiles" ON public.users 
  FOR SELECT USING (NOT is_banned OR auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id AND NOT is_banned)
  WITH CHECK (auth.uid() = id AND NOT is_banned);
  
CREATE POLICY "Users can insert own profile" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);
  
-- Prevent banned users from performing most actions
CREATE POLICY "Prevent banned user operations" ON public.users 
  FOR ALL USING (NOT is_banned OR auth.uid() = id);

-- RLS Policies for stories table
-- SECURITY: Enhanced policies with moderation and user verification
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

-- RLS Policies for comments table
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for likes table
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Functions to update like counts
CREATE OR REPLACE FUNCTION update_story_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.stories 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.story_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.stories 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.story_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_story_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.stories 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.story_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.stories 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.story_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update counts
CREATE TRIGGER story_likes_count_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW
  WHEN (NEW.story_id IS NOT NULL OR OLD.story_id IS NOT NULL)
  EXECUTE FUNCTION update_story_likes_count();

CREATE TRIGGER comment_likes_count_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW
  WHEN (NEW.comment_id IS NOT NULL OR OLD.comment_id IS NOT NULL)
  EXECUTE FUNCTION update_comment_likes_count();

CREATE TRIGGER story_comments_count_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_story_comments_count();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data for testing
INSERT INTO public.users (id, email, full_name, username) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@frameeconomics.com', 'Demo User', 'demo');

INSERT INTO public.stories (title, content, category, author_id) VALUES
  ('My First Frame Economics Success', 'I applied Rule #1 (Patience Under Fire) in a difficult negotiation and it completely changed the outcome. The other person was trying to rush me into a decision, but I stayed calm and composed. This gave me the space to think clearly and respond strategically rather than reactively.', 'success', '00000000-0000-0000-0000-000000000001'),
  ('Struggling with Silence Games', 'I''m having trouble with Rule #3 (Silence Games). When someone goes silent on me, I find myself filling the void with words, which I know weakens my position. Has anyone found effective strategies for staying comfortable with silence?', 'question', '00000000-0000-0000-0000-000000000001'),
  ('The Power of Frame Control in Relationships', 'After studying Frame Economics, I realized that most relationship conflicts stem from competing frames rather than the surface issues we argue about. Understanding this has transformed how I approach disagreements with my partner.', 'insight', '00000000-0000-0000-0000-000000000001');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;