import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  ThumbsUp,
  Share2,
  Star,
  Globe,
  Target,
  BookOpen,
  Award,
  Lightbulb,
  Clock,
  BarChart3
} from 'lucide-react';

interface CommunityInsight {
  id: string;
  type: 'statistic' | 'tip' | 'success_story' | 'common_mistake';
  title: string;
  content: string;
  ruleId?: number;
  category: string;
  upvotes: number;
  timeframe: string;
  source: 'community' | 'research' | 'expert';
}

interface LearningStats {
  totalLearners: number;
  activeToday: number;
  rulesCompleted: number;
  successStories: number;
  avgImprovement: number;
  topChallenge: string;
}

const Community: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewType, setViewType] = useState<'insights' | 'stats' | 'leaderboard'>('insights');

  // Simulated community data (in a real app, this would come from an API)
  const communityInsights: CommunityInsight[] = useMemo(() => [
    {
      id: 'insight-1',
      type: 'statistic',
      title: '89% Success Rate on Public Pressure',
      content: 'Learners who practice the "playful redirection" technique report 89% success in handling public challenges without getting defensive.',
      ruleId: 5,
      category: 'Social Dynamics',
      upvotes: 247,
      timeframe: 'This month',
      source: 'community'
    },
    {
      id: 'insight-2',
      type: 'tip',
      title: 'The 3-Second Rule for Silence Games',
      content: 'Most effective counter: Wait exactly 3 seconds before any response to silence. This prevents reactive chasing while showing you\'re not rattled.',
      ruleId: 3,
      category: 'Communication',
      upvotes: 198,
      timeframe: 'This week',
      source: 'expert'
    },
    {
      id: 'insight-3',
      type: 'success_story',
      title: 'Negotiation Breakthrough Using Anchoring',
      content: 'Used Rule 4 in a salary negotiation. When they got aggressive, I lowered my voice and slowed down. They matched my energy and we reached a fair agreement. 15% raise!',
      ruleId: 4,
      category: 'Professional',
      upvotes: 156,
      timeframe: '2 days ago',
      source: 'community'
    },
    {
      id: 'insight-4',
      type: 'common_mistake',
      title: 'Don\'t Over-Explain Your Boundaries',
      content: 'Common mistake: Justifying your "no" with long explanations. This actually weakens your frame. State your boundary once, clearly, then stop talking.',
      ruleId: 2,
      category: 'Boundaries',
      upvotes: 134,
      timeframe: 'This week',
      source: 'research'
    },
    {
      id: 'insight-5',
      type: 'statistic',
      title: 'Patience Under Fire Most Practiced Rule',
      content: '73% of learners identify this as their most frequently applied rule. Average success rate improves from 45% to 78% after 2 weeks of practice.',
      ruleId: 1,
      category: 'Practice Patterns',
      upvotes: 223,
      timeframe: 'This month',
      source: 'research'
    },
    {
      id: 'insight-6',
      type: 'tip',
      title: 'Mirror Neurons and Calm Energy',
      content: 'Research shows: Your calm energy literally influences others\' brain waves. Maintain steady breathing and relaxed shoulders - others will unconsciously match this.',
      category: 'Neuroscience',
      upvotes: 189,
      timeframe: '5 days ago',
      source: 'research'
    },
    {
      id: 'insight-7',
      type: 'success_story',
      title: 'Relationship Game-Changer',
      content: 'Partner used to go silent when upset. Instead of chasing, I applied Rule 3 and gave space. Now they communicate directly instead of playing games. Relationship is so much better!',
      ruleId: 3,
      category: 'Personal',
      upvotes: 167,
      timeframe: '1 week ago',
      source: 'community'
    },
    {
      id: 'insight-8',
      type: 'common_mistake',
      title: 'Frame Control ≠ Being Stubborn',
      content: 'New learners often confuse frame control with rigidity. True frame control is flexible strength - you can adapt while maintaining your core position.',
      category: 'Mindset',
      upvotes: 142,
      timeframe: 'This week',
      source: 'expert'
    }
  ], []);

  const learningStats: LearningStats = useMemo(() => ({
    totalLearners: 12847,
    activeToday: 1234,
    rulesCompleted: 89456,
    successStories: 2341,
    avgImprovement: 67,
    topChallenge: 'Silence Games'
  }), []);

  const categories = ['all', 'Social Dynamics', 'Communication', 'Professional', 'Boundaries', 'Practice Patterns', 'Personal', 'Neuroscience', 'Mindset'];

  const filteredInsights = useMemo(() => {
    if (selectedCategory === 'all') return communityInsights;
    return communityInsights.filter(insight => insight.category === selectedCategory);
  }, [communityInsights, selectedCategory]);

  const getInsightIcon = (type: CommunityInsight['type']) => {
    switch (type) {
      case 'statistic': return <BarChart3 className="w-5 h-5" />;
      case 'tip': return <Lightbulb className="w-5 h-5" />;
      case 'success_story': return <Star className="w-5 h-5" />;
      case 'common_mistake': return <Target className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: CommunityInsight['type']) => {
    switch (type) {
      case 'statistic': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'tip': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'success_story': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'common_mistake': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    }
  };

  const getSourceIcon = (source: CommunityInsight['source']) => {
    switch (source) {
      case 'community': return <Users className="w-4 h-4" />;
      case 'research': return <BookOpen className="w-4 h-4" />;
      case 'expert': return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Community Insights
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Learn from the collective wisdom of Frame Economics practitioners worldwide.
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-8">
        <div className="glass-effect rounded-2xl p-2">
          {(['insights', 'stats', 'leaderboard'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setViewType(view)}
              className={`
                px-6 py-2 rounded-xl transition-all duration-200 capitalize
                ${viewType === view 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/10'
                }
              `}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {viewType === 'stats' && (
        <div className="space-y-8 mb-8">
          {/* Global Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="w-6 h-6 text-blue-500" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {learningStats.totalLearners.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Learners</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-6 h-6 text-green-500" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {learningStats.activeToday.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Active Today</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-purple-500" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {learningStats.rulesCompleted.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Rules Mastered</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {learningStats.successStories.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Success Stories</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {learningStats.avgImprovement}%
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg Improvement</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-red-500" />
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {learningStats.topChallenge}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Biggest Challenge</p>
            </div>
          </div>

          {/* Practice Patterns */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Most Practiced Rules This Month
            </h3>
            <div className="space-y-4">
              {[
                { rule: 'Patience Under Fire', percentage: 73, change: '+12%' },
                { rule: 'Silence Games', percentage: 68, change: '+8%' },
                { rule: 'Public Pressure', percentage: 61, change: '+15%' },
                { rule: 'Refusing Unfair Blame', percentage: 58, change: '+5%' },
                { rule: 'Mood Swings & Pace', percentage: 52, change: '+18%' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {item.rule}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {item.change}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewType === 'leaderboard' && (
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
            Top Contributors This Week
          </h3>
          <div className="space-y-4">
            {[
              { name: 'FrameMaster_Alex', contributions: 42, badge: 'Expert', streak: 28 },
              { name: 'CalmCollector', contributions: 38, badge: 'Mentor', streak: 21 },
              { name: 'ZenNegotiator', contributions: 34, badge: 'Guide', streak: 19 },
              { name: 'SilentStrong', contributions: 31, badge: 'Teacher', streak: 15 },
              { name: 'FramePhilosopher', contributions: 28, badge: 'Scholar', streak: 12 }
            ].map((user, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/30 dark:bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                    ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-purple-500'}
                  `}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {user.name}
                      </span>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium">
                        {user.badge}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {user.streak} day streak
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {user.contributions}
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    contributions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewType === 'insights' && (
        <>
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-xl transition-colors duration-200 capitalize
                    ${selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/30 dark:bg-black/20 text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-black/30'
                    }
                  `}
                >
                  {category === 'all' ? 'All Insights' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight) => (
              <div key={insight.id} className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border
                    ${getInsightColor(insight.type)}
                  `}>
                    {getInsightIcon(insight.type)}
                    {insight.type.replace('_', ' ')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    {getSourceIcon(insight.source)}
                    <span>{insight.timeframe}</span>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {insight.title}
                </h4>

                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                  {insight.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {insight.ruleId && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                        Rule {insight.ruleId}
                      </span>
                    )}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {insight.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{insight.upvotes}</span>
                    </button>
                    <button className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Call to Action */}
      <div className="mt-12 glass-effect rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Join the Community
        </h3>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
          Share your experiences and learn from others on the same journey.
        </p>
        <div className="flex justify-center gap-4">
          <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
            <MessageSquare className="w-5 h-5" />
            Share Your Story
          </button>
          <button className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
            <Users className="w-5 h-5" />
            Connect with Peers
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;