import { useState, useEffect, useCallback } from 'react';
import { supabase, Story, Comment } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useCommunityStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch stories with profile data and user's like status
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles!stories_user_id_fkey (
            id, full_name, avatar_url, username
          ),
          user_liked:likes!stories_story_id_fkey (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to include user_liked boolean
      const processedStories = data?.map(story => ({
        ...story,
        user_liked: story.user_liked?.some((like: any) => like.user_id === user?.id) || false
      })) || [];

      setStories(processedStories);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const createStory = async (storyData: {
    title: string;
    content: string;
    category: Story['category'];
    rule_id?: number;
    tags?: string[];
  }) => {
    if (!user) throw new Error('Must be logged in to create stories');

    const { data, error } = await supabase
      .from('stories')
      .insert([{
        ...storyData,
        user_id: user.id,
        tags: storyData.tags || []
      }])
      .select(`
        *,
        profiles!stories_user_id_fkey (
          id, full_name, avatar_url, username
        )
      `)
      .single();

    if (error) throw error;

    // Add to local state
    setStories(prev => [{ ...data, user_liked: false }, ...prev]);
    return data;
  };

  const toggleLike = async (storyId: string) => {
    if (!user) throw new Error('Must be logged in to like stories');

    try {
      // Check if user already liked this story
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('story_id', storyId)
        .single();

      if (existingLike) {
        // Unlike: remove the like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('story_id', storyId);

        if (error) throw error;

        // Update local state
        setStories(prev => prev.map(story => 
          story.id === storyId 
            ? { ...story, likes_count: story.likes_count - 1, user_liked: false }
            : story
        ));
      } else {
        // Like: add the like
        const { error } = await supabase
          .from('likes')
          .insert([{ user_id: user.id, story_id: storyId }]);

        if (error) throw error;

        // Update local state
        setStories(prev => prev.map(story => 
          story.id === storyId 
            ? { ...story, likes_count: story.likes_count + 1, user_liked: true }
            : story
        ));
      }
    } catch (err: any) {
      throw err;
    }
  };

  const deleteStory = async (storyId: string) => {
    if (!user) throw new Error('Must be logged in to delete stories');

    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', user.id); // Ensure user can only delete their own stories

    if (error) throw error;

    // Remove from local state
    setStories(prev => prev.filter(story => story.id !== storyId));
  };

  return {
    stories,
    loading,
    error,
    createStory,
    toggleLike,
    deleteStory,
    refreshStories: fetchStories
  };
};

export const useStoryComments = (storyId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_user_id_fkey (
            id, full_name, avatar_url, username
          ),
          user_liked:likes!comments_comment_id_fkey (
            user_id
          )
        `)
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process comments with threading and user like status
      const processedComments = data?.map(comment => ({
        ...comment,
        user_liked: comment.user_liked?.some((like: any) => like.user_id === user?.id) || false
      })) || [];

      // Build threaded structure
      const threaded = buildCommentTree(processedComments);
      setComments(threaded);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storyId, user?.id]);

  useEffect(() => {
    if (storyId) {
      fetchComments();
    }
  }, [fetchComments, storyId]);

  const createComment = async (content: string, parentId?: string) => {
    if (!user) throw new Error('Must be logged in to comment');

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        story_id: storyId,
        user_id: user.id,
        content,
        parent_id: parentId || null
      }])
      .select(`
        *,
        profiles!comments_user_id_fkey (
          id, full_name, avatar_url, username
        )
      `)
      .single();

    if (error) throw error;

    // Refresh comments to get updated threaded structure
    await fetchComments();
    return data;
  };

  const toggleCommentLike = async (commentId: string) => {
    if (!user) throw new Error('Must be logged in to like comments');

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('comment_id', commentId)
        .single();

      if (existingLike) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('comment_id', commentId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ user_id: user.id, comment_id: commentId }]);

        if (error) throw error;
      }

      // Refresh comments to get updated like counts
      await fetchComments();
    } catch (err: any) {
      throw err;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) throw new Error('Must be logged in to delete comments');

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);

    if (error) throw error;

    await fetchComments();
  };

  return {
    comments,
    loading,
    error,
    createComment,
    toggleCommentLike,
    deleteComment,
    refreshComments: fetchComments
  };
};

// Helper function to build threaded comment structure
function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create comment map
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree structure
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

export const useCommunityStats = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_stories: 0,
    total_comments: 0,
    active_users_today: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResponse, storiesResponse, commentsResponse] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('stories').select('id', { count: 'exact', head: true }),
          supabase.from('comments').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          total_users: usersResponse.count || 0,
          total_stories: storiesResponse.count || 0,
          total_comments: commentsResponse.count || 0,
          active_users_today: 0 // This would require more complex querying
        });
      } catch (err) {
        console.error('Failed to fetch community stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};