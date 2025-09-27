import React, { useState } from 'react';
import { Reply, Heart, Trash2, Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStoryComments } from '../hooks/useCommunity';
import { Comment } from '../lib/supabase';

interface CommentsSectionProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
  depth: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onLike,
  onDelete,
  currentUserId,
  depth
}) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-slate-200 dark:border-slate-700 pl-4' : ''} mb-4`}>
      <div className="bg-white/30 dark:bg-black/20 rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              {(comment as any).profiles?.avatar_url ? (
                <img 
                  src={(comment as any).profiles.avatar_url} 
                  alt={(comment as any).profiles.full_name} 
                  className="w-8 h-8 rounded-full object-cover" 
                />
              ) : (
                (comment as any).profiles?.full_name?.charAt(0).toUpperCase() || '?'
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                {(comment as any).profiles?.full_name || 'Anonymous'}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {formatTimeAgo(comment.created_at)}
              </div>
            </div>
          </div>
          
          {currentUserId === (comment as any).user_id && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-red-600 hover:text-red-700 p-1"
              title="Delete comment"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Comment Content */}
        <p className="text-slate-700 dark:text-slate-300 text-sm mb-3 leading-relaxed">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1 transition-colors duration-200 text-xs ${
              comment.user_liked 
                ? 'text-red-600' 
                : 'text-slate-600 dark:text-slate-400 hover:text-red-600'
            }`}
          >
            <Heart className={`w-3 h-3 ${comment.user_liked ? 'fill-current' : ''}`} />
            <span>{comment.likes_count}</span>
          </button>
          
          <button
            onClick={() => onReply(comment.id)}
            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors duration-200"
          >
            <Reply className="w-3 h-3" />
            Reply
          </button>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ storyId, isOpen, onClose }) => {
  const { user } = useAuth();
  const { comments, loading, createComment, toggleCommentLike, deleteComment } = useStoryComments(storyId);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await createComment(newComment.trim(), replyTo || undefined);
      setNewComment('');
      setReplyTo(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyTo(parentId);
    // Focus on the comment input
    const commentInput = document.getElementById('comment-input');
    commentInput?.focus();
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    try {
      await toggleCommentLike(commentId);
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Comments ({comments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No comments yet
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  currentUserId={user?.id}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Comment Form */}
        {user ? (
          <div className="border-t border-slate-200 dark:border-slate-700 p-6">
            {replyTo && (
              <div className="mb-3 flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  💬 Replying to comment
                </span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Cancel
                </button>
              </div>
            )}
            
            {error && (
              <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitComment} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata?.full_name || 'User'} 
                    className="w-8 h-8 rounded-full object-cover" 
                  />
                ) : (
                  user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'
                )}
              </div>
              <div className="flex-1">
                <textarea
                  id="comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyTo ? "Write your reply..." : "Share your thoughts..."}
                  className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white placeholder-slate-500 resize-none"
                  rows={3}
                  maxLength={1000}
                  disabled={submitting}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-500">
                    {newComment.length}/1000 characters
                  </span>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                      ${!newComment.trim() || submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }
                    `}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {replyTo ? 'Reply' : 'Comment'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="border-t border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Sign in to join the conversation
            </p>
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Close Comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;