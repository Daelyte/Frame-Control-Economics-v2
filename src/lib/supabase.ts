import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables will be set in Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_KEY || process.env.SUPABASE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

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
  username: string;
  bio?: string;
  is_banned?: boolean;
  reputation_score?: number;
  created_at: string;
  updated_at: string;
}

// Alias for compatibility - maps to 'users' table in database
export type User = Profile;

export interface Story {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: 'success' | 'challenge' | 'insight' | 'question';
  likes_count: number;
  comments_count: number;
  is_flagged: boolean;
  is_approved: boolean;
  flagged_reason?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  users?: Profile;
  user_liked?: boolean;
}

export interface Comment {
  id: string;
  story_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
  depth: number;
  likes_count: number;
  is_flagged: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  users?: Profile;
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
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};
