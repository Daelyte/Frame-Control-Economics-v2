-- Frame Economics Community Platform - Production Database Setup
-- Compatible with new Supabase API keys (sb_publishable_ and sb_secret_)
-- Follows Supabase best practices: auth.users integration, RLS, proper indexing

-- =============================================================================
-- 1. CREATE TABLES
-- =============================================================================

-- 1a) Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text CHECK (length(full_name) BETWEEN 1 AND 100),
    avatar_url text CHECK (avatar_url ~* '^https?://'),
    username text NOT NULL UNIQUE CHECK (length(username) BETWEEN 3 AND 30 AND username ~* '^[a-zA-Z0-9_-]+$'),
    bio text CHECK (length(bio) <= 500),
    is_banned boolean DEFAULT false NOT NULL,
    reputation_score integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 1b) Stories table
CREATE TABLE IF NOT EXISTS public.stories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    title text NOT NULL CHECK (length(title) BETWEEN 5 AND 200),
    content text NOT NULL CHECK (length(content) BETWEEN 10 AND 5000),
    category text NOT NULL CHECK (category IN ('success','challenge','insight','question')),
    likes_count integer DEFAULT 0 NOT NULL CHECK (likes_count >= 0),
    comments_count integer DEFAULT 0 NOT NULL CHECK (comments_count >= 0),
    is_flagged boolean DEFAULT false NOT NULL,
    is_approved boolean DEFAULT true NOT NULL,
    flagged_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 1c) Comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    content text NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
    parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
    depth integer DEFAULT 0 NOT NULL CHECK (depth >= 0 AND depth <= 5),
    likes_count integer DEFAULT 0 NOT NULL CHECK (likes_count >= 0),
    is_flagged boolean DEFAULT false NOT NULL,
    is_approved boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 1d) Likes table
CREATE TABLE IF NOT EXISTS public.likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    story_id uuid REFERENCES public.stories(id) ON DELETE CASCADE,
    comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CHECK (
        (story_id IS NOT NULL AND comment_id IS NULL) OR 
        (story_id IS NULL AND comment_id IS NOT NULL)
    ),
    UNIQUE(user_id, story_id),
    UNIQUE(user_id, comment_id)
);

-- =============================================================================
-- 2. CREATE INDEXES
-- =============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Stories indexes
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON public.stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_category ON public.stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_approved ON public.stories(is_approved, is_flagged);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON public.comments(story_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at);

-- Likes indexes
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_story_id ON public.likes(story_id);
CREATE INDEX IF NOT EXISTS idx_likes_comment_id ON public.likes(comment_id);

-- =============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 4. CREATE RLS POLICIES
-- =============================================================================

-- 4a) Profiles policies
CREATE POLICY "Anyone can view non-banned profiles" ON public.profiles
    FOR SELECT USING (NOT is_banned);

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id AND NOT is_banned)
    WITH CHECK (auth.uid() = user_id);

-- 4b) Stories policies
CREATE POLICY "Anyone can view approved stories" ON public.stories
    FOR SELECT USING (is_approved AND NOT is_flagged);

CREATE POLICY "Authors can view their own stories" ON public.stories
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id)
    );

CREATE POLICY "Authenticated users can insert stories" ON public.stories
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id AND NOT is_banned)
    );

CREATE POLICY "Authors can update their own stories" ON public.stories
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id AND NOT is_banned)
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id)
    );

CREATE POLICY "Authors can delete their own stories" ON public.stories
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id)
    );

-- 4c) Comments policies
CREATE POLICY "Anyone can view approved comments" ON public.comments
    FOR SELECT USING (is_approved AND NOT is_flagged);

CREATE POLICY "Authors can view their own comments" ON public.comments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id)
    );

CREATE POLICY "Authenticated users can insert comments" ON public.comments
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id AND NOT is_banned)
    );

CREATE POLICY "Authors can update their own comments" ON public.comments
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id AND NOT is_banned)
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id)
    );

CREATE POLICY "Authors can delete their own comments" ON public.comments
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = author_id)
    );

-- 4d) Likes policies
CREATE POLICY "Anyone can view likes" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own likes" ON public.likes
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = likes.user_id AND NOT is_banned)
    );

CREATE POLICY "Users can delete their own likes" ON public.likes
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND user_id = likes.user_id)
    );

-- =============================================================================
-- 5. HELPER FUNCTIONS AND TRIGGERS
-- =============================================================================

-- 5a) Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    base_username text;
    final_username text;
    counter integer := 0;
BEGIN
    -- Generate base username from email
    base_username := split_part(NEW.email, '@', 1);
    base_username := regexp_replace(base_username, '[^a-zA-Z0-9_-]', '', 'g');
    
    -- Ensure username is at least 3 characters
    IF length(base_username) < 3 THEN
        base_username := 'user_' || substring(NEW.id::text from 1 for 8);
    END IF;
    
    -- Find unique username
    final_username := base_username;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
        counter := counter + 1;
        final_username := base_username || '_' || counter;
    END LOOP;

    -- Insert profile
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        avatar_url,
        username
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url',
        final_username
    );

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error and continue
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5b) Function to update story comment count
CREATE OR REPLACE FUNCTION public.update_story_comment_count()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.stories 
        SET comments_count = comments_count + 1,
            updated_at = now()
        WHERE id = NEW.story_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.stories 
        SET comments_count = GREATEST(0, comments_count - 1),
            updated_at = now()
        WHERE id = OLD.story_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5c) Function to update like counts
CREATE OR REPLACE FUNCTION public.update_like_counts()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.story_id IS NOT NULL THEN
            UPDATE public.stories 
            SET likes_count = likes_count + 1,
                updated_at = now()
            WHERE id = NEW.story_id;
        END IF;
        
        IF NEW.comment_id IS NOT NULL THEN
            UPDATE public.comments 
            SET likes_count = likes_count + 1,
                updated_at = now()
            WHERE id = NEW.comment_id;
        END IF;
        
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.story_id IS NOT NULL THEN
            UPDATE public.stories 
            SET likes_count = GREATEST(0, likes_count - 1),
                updated_at = now()
            WHERE id = OLD.story_id;
        END IF;
        
        IF OLD.comment_id IS NOT NULL THEN
            UPDATE public.comments 
            SET likes_count = GREATEST(0, likes_count - 1),
                updated_at = now()
            WHERE id = OLD.comment_id;
        END IF;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5d) Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 6. CREATE TRIGGERS
-- =============================================================================

-- User creation trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comment count triggers
DROP TRIGGER IF EXISTS on_comment_created ON public.comments;
CREATE TRIGGER on_comment_created
    AFTER INSERT ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_story_comment_count();

DROP TRIGGER IF EXISTS on_comment_deleted ON public.comments;
CREATE TRIGGER on_comment_deleted
    AFTER DELETE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_story_comment_count();

-- Like count triggers
DROP TRIGGER IF EXISTS on_like_created ON public.likes;
CREATE TRIGGER on_like_created
    AFTER INSERT ON public.likes
    FOR EACH ROW EXECUTE FUNCTION public.update_like_counts();

DROP TRIGGER IF EXISTS on_like_deleted ON public.likes;
CREATE TRIGGER on_like_deleted
    AFTER DELETE ON public.likes
    FOR EACH ROW EXECUTE FUNCTION public.update_like_counts();

-- Updated timestamp triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_stories_updated_at ON public.stories;
CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================================================
-- 7. GRANT PERMISSIONS (Compatible with new API keys)
-- =============================================================================

-- Grant permissions to legacy roles (anon, authenticated)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- Grant permissions to new API key roles (if they exist)
DO $$ 
BEGIN
    -- Grant to publishable role (equivalent to anon)
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'publishable') THEN
        GRANT USAGE ON SCHEMA public TO publishable;
        GRANT SELECT ON ALL TABLES IN SCHEMA public TO publishable;
        GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO publishable;
    END IF;
    
    -- Grant to secret role (equivalent to service_role)
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'secret') THEN
        GRANT USAGE ON SCHEMA public TO secret;
        GRANT ALL ON ALL TABLES IN SCHEMA public TO secret;
        GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO secret;
        GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO secret;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Roles don't exist yet, continue
    NULL;
END $$;

-- =============================================================================
-- 8. ENABLE REALTIME
-- =============================================================================

-- Enable realtime for live updates
DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
EXCEPTION WHEN duplicate_object THEN
    -- Tables already added to publication
    NULL;
EXCEPTION WHEN OTHERS THEN
    -- Create publication if it doesn't exist
    CREATE PUBLICATION supabase_realtime FOR TABLE public.profiles, public.stories, public.comments, public.likes;
END $$;

-- =============================================================================
-- 9. VERIFICATION QUERIES
-- =============================================================================

-- Run these queries after setup to verify everything works:

/*
-- Verify tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'stories', 'comments', 'likes');

-- Verify indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'stories', 'comments', 'likes');

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'stories', 'comments', 'likes');

-- Verify policies were created
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verify functions were created
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%handle%' OR routine_name LIKE '%update%';

-- Verify triggers were created
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
*/