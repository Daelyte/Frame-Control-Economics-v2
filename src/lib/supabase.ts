import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables will be set in Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  provider: 'github' | 'google';
  username?: string;
  bio?: string;
  rules_completed: number;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  user_id: string;
  title: string;
  content: string;
  rule_id?: number;
  category: 'success_story' | 'challenge' | 'insight' | 'question';
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  user_liked?: boolean;
}

export interface Comment {
  id: string;
  story_id: string;
  user_id: string;
  content: string;
  parent_id?: string; // For threaded comments
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  user_liked?: boolean;
  replies?: Comment[];
}

export interface Like {
  id: string;
  user_id: string;
  story_id?: string;
  comment_id?: string;
  created_at: string;
}

export interface CommunityStats {
  total_users: number;
  total_stories: number;
  total_comments: number;
  active_users_today: number;
  top_contributors: Array<{
    user_id: string;
    full_name: string;
    avatar_url?: string;
    story_count: number;
    total_likes: number;
  }>;
}

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signInWithProvider = async (provider: 'github' | 'google') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};