import React, { useState } from 'react';
import { 
  MessageSquare, 
  Share2,
  PenTool,
  Heart,
  Reply,
  Trash2,
  Tag,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCommunityStories, useCommunityStats } from '../hooks/useCommunity';
import LoginModal from './LoginModal';
import CreateStoryModal from './CreateStoryModal';
import UserProfile from './UserProfile';
import CommentsSection from './CommentsSection';
import { Story } from '../lib/supabase';

const InteractiveCommunity: React.FC = () => {
  const { user, profile } = useAuth();
  const { stories, loading: storiesLoading, toggleLike, deleteStory } = useCommunityStories();
  const { stats, loading: statsLoading } = useCommunityStats();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewType, setViewType] = useState<'forum' | 'stats'>('forum');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);

  const categories = ['all', 'success_story', 'challenge', 'insight', 'question'];
  const categoryLabels: Record<string, string> = {
    all: 'All Stories',
    success_story: 'Success Stories',
    challenge: 'Challenges',
    insight: 'Insights',
    question: 'Questions'
  };

  const filteredStories = selectedCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

  const handleLike = async (storyId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      await toggleLike(storyId);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleCreateStory = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowCreateStoryModal(true);
  };

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteStory(storyId);
      } catch (error) {
        console.error('Failed to delete story:', error);
      }
    }
  };

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

  const getCategoryColor = (category: Story['category']) => {
    switch (category) {
      case 'success_story' as any: return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'challenge': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'insight': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'question': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Frame Economics Community
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Share your journey and learn from fellow practitioners.
        </p>
        
        {/* User Info */}
        {user && profile && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-8 h-8 rounded-full" />
                ) : (
                  profile.full_name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-slate-700 dark:text-slate-300">Welcome, {profile.full_name}</span>
            </div>
            <button
              onClick={() => setShowUserProfile(true)}
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
            >
              View Profile
            </button>
          </div>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-8">
        <div className="glass-effect rounded-2xl p-2 flex">
          <button
            onClick={() => setViewType('forum')}
            className={`
              px-6 py-2 rounded-xl transition-all duration-200
              ${viewType === 'forum' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-700 dark:text-slate-300 hover:bg-white/10'
              }
            `}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Community Forum
          </button>
          <button
            onClick={() => setViewType('stats')}
            className={`
              px-6 py-2 rounded-xl transition-all duration-200
              ${viewType === 'stats' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-700 dark:text-slate-300 hover:bg-white/10'
              }
            `}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Statistics
          </button>
        </div>
      </div>

      {/* Stats View */}
      {viewType === 'stats' && (
        <div className="space-y-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {statsLoading ? '...' : stats.total_users.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Members</div>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {statsLoading ? '...' : stats.total_stories.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Stories Shared</div>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {statsLoading ? '...' : stats.total_comments.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Comments</div>
            </div>
          </div>
        </div>
      )}

      {/* Forum View */}
      {viewType === 'forum' && (
        <>
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-xl transition-colors duration-200
                    ${selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/30 dark:bg-black/20 text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-black/30'
                    }
                  `}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            <button
              onClick={handleCreateStory}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              <PenTool className="w-4 h-4" />
              Share Your Story
            </button>
          </div>

          {/* Stories */}
          <div className="space-y-6">
            {storiesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading stories...</p>
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No stories yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Be the first to share your Frame Economics journey!
                </p>
                <button
                  onClick={handleCreateStory}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  Share Your Story
                </button>
              </div>
            ) : (
              filteredStories.map((story) => (
                <div key={story.id} className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow duration-200">
                  {/* Story Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {(story as any).users?.avatar_url ? (
                          <img 
                            src={(story as any).users.avatar_url} 
                            alt={(story as any).users.full_name} 
                            className="w-12 h-12 rounded-full object-cover" 
                          />
                        ) : (
                          (story as any).users?.full_name?.charAt(0).toUpperCase() || '?'
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {(story as any).users?.full_name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {formatTimeAgo(story.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(story.category)}`}>
                        {story.category.replace('_', ' ')}
                      </span>
                      {(story as any).rule_id && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs">
                          Rule {(story as any).rule_id}
                        </span>
                      )}
                      {user?.id === (story as any).user_id && (
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Story Content */}
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {story.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                    {story.content}
                  </p>

                  {/* Tags */}
                  {(story as any).tags && (story as any).tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(story as any).tags.map((tag: string, index: number) => (
                        <span key={index} className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(story.id)}
                        className={`flex items-center gap-2 transition-colors duration-200 ${
                          story.user_liked 
                            ? 'text-red-600' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${story.user_liked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{story.likes_count}</span>
                      </button>
                      
                      <button 
                        onClick={() => setShowComments(story.id)}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors duration-200"
                      >
                        <Reply className="w-4 h-4" />
                        <span className="text-sm">{story.comments_count}</span>
                      </button>
                    </div>

                    <button className="text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors duration-200">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Join the Community"
        description="Sign in to share your stories and connect with fellow learners"
      />
      
      <CreateStoryModal 
        isOpen={showCreateStoryModal}
        onClose={() => setShowCreateStoryModal(false)}
      />
      
      <UserProfile 
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
      
      {showComments && (
        <CommentsSection
          storyId={showComments}
          isOpen={true}
          onClose={() => setShowComments(null)}
        />
      )}
    </div>
  );
};

export default InteractiveCommunity;