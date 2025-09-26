import React, { useState } from 'react';
import { X, PenTool, Tag } from 'lucide-react';
import { Story } from '../lib/supabase';
import { useCommunityStories } from '../hooks/useCommunity';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose }) => {
  const { createStory } = useCommunityStories();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'success_story' as Story['category'],
    rule_id: undefined as number | undefined,
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const categories = [
    { value: 'success_story', label: 'Success Story', description: 'Share a win or breakthrough' },
    { value: 'challenge', label: 'Challenge', description: 'Discuss a difficulty you\'re facing' },
    { value: 'insight', label: 'Insight', description: 'Share a learning or realization' },
    { value: 'question', label: 'Question', description: 'Ask the community for advice' }
  ];

  const rules = [
    { id: 1, title: 'Patience Under Fire' },
    { id: 2, title: 'Refusing Unfair Blame' },
    { id: 3, title: 'Silence Games' },
    { id: 4, title: 'Mood Swings & Emotional Pace' },
    { id: 5, title: 'Public Pressure' },
    { id: 6, title: 'The Masculinity Challenge' },
    { id: 7, title: 'Moving Goalposts' },
    { id: 8, title: 'Selective Memory' },
    { id: 9, title: 'Jealousy Traps' },
    { id: 10, title: 'Rhythm Control' }
  ];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.title.trim().length < 5) {
        throw new Error('Title must be at least 5 characters long');
      }
      if (formData.content.trim().length < 20) {
        throw new Error('Content must be at least 20 characters long');
      }

      await createStory({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        rule_id: formData.rule_id || undefined,
        tags: formData.tags
      });

      // Reset form and close modal
      setFormData({
        title: '',
        content: '',
        category: 'success_story' as any,
        rule_id: undefined,
        tags: []
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-effect rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-white/20 my-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Share Your Story
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              What type of story are you sharing?
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className={`
                    cursor-pointer rounded-lg p-4 border-2 transition-all duration-200
                    ${formData.category === category.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={formData.category === category.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Story['category'] }))}
                    className="sr-only"
                  />
                  <div className="font-medium text-slate-900 dark:text-white">
                    {category.label}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {category.description}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
              placeholder="Give your story a compelling title..."
              maxLength={200}
              required
            />
            <div className="text-xs text-slate-500 mt-1">{formData.title.length}/200 characters</div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your Story *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white resize-none"
              placeholder="Share the details of your experience. What happened? What did you learn? How did you apply Frame Economics principles?"
              maxLength={5000}
              required
            />
            <div className="text-xs text-slate-500 mt-1">{formData.content.length}/5000 characters</div>
          </div>

          {/* Related Rule */}
          <div>
            <label htmlFor="rule_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Related Rule (Optional)
            </label>
            <select
              id="rule_id"
              value={formData.rule_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, rule_id: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
            >
              <option value="">Select a rule (optional)</option>
              {rules.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  Rule {rule.id}: {rule.title}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tags
            </label>
            <div className="space-y-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                placeholder="Add tags to help others find your story (press Enter to add)"
                maxLength={30}
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-lg text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-purple-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
                ${loading || !formData.title.trim() || !formData.content.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" />
                  Share Story
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;