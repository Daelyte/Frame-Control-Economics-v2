import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Flame, 
  Target,
  BarChart3,
  Award,
  Clock,
  Star
} from 'lucide-react';

interface HabitEntry {
  date: string; // YYYY-MM-DD
  ruleId: number;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=very easy, 5=very hard
  situation: string;
  outcome: 'success' | 'partial' | 'failed';
  notes?: string;
  timestamp: number;
}

interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalPractices: number;
  successRate: number;
  weeklyGoal: number;
  thisWeekCount: number;
}

const HABIT_STORAGE_KEY = 'frame_econ_habits_v1';
const HABIT_GOAL_KEY = 'frame_econ_weekly_goal';

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<HabitEntry[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState(7);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<HabitEntry>>({
    ruleId: 1,
    difficulty: 3,
    situation: '',
    outcome: 'success',
    notes: ''
  });

  // Load data on component mount
  useEffect(() => {
    try {
      const savedHabits = localStorage.getItem(HABIT_STORAGE_KEY);
      const savedGoal = localStorage.getItem(HABIT_GOAL_KEY);
      
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
      
      if (savedGoal) {
        setWeeklyGoal(parseInt(savedGoal));
      }
    } catch (error) {
      console.warn('Failed to load habit data:', error);
    }
  }, []);

  // Save data when habits change
  useEffect(() => {
    try {
      localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.warn('Failed to save habit data:', error);
    }
  }, [habits]);

  // Save weekly goal when it changes
  useEffect(() => {
    try {
      localStorage.setItem(HABIT_GOAL_KEY, weeklyGoal.toString());
    } catch (error) {
      console.warn('Failed to save weekly goal:', error);
    }
  }, [weeklyGoal]);

  const stats = useMemo((): HabitStats => {
    const now = new Date();
    
    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Sort habits by date descending
    const sortedHabits = [...habits].sort((a, b) => b.date.localeCompare(a.date));
    
    // Calculate current streak (consecutive days with successful practices)
    const uniqueDates = [...new Set(sortedHabits.map(h => h.date))].sort((a, b) => b.localeCompare(a));
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = uniqueDates[i];
      const dayHabits = habits.filter(h => h.date === date);
      const hasSuccess = dayHabits.some(h => h.outcome === 'success' || h.outcome === 'partial');
      
      if (hasSuccess) {
        if (i === 0 || isConsecutiveDay(uniqueDates[i-1], date)) {
          currentStreak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (const date of uniqueDates) {
      const dayHabits = habits.filter(h => h.date === date);
      const hasSuccess = dayHabits.some(h => h.outcome === 'success' || h.outcome === 'partial');
      
      if (hasSuccess) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate this week's count
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
    
    const thisWeekCount = habits.filter(h => h.date >= startOfWeekStr).length;
    
    // Calculate success rate
    const totalPractices = habits.length;
    const successfulPractices = habits.filter(h => h.outcome === 'success').length;
    const successRate = totalPractices > 0 ? (successfulPractices / totalPractices) * 100 : 0;

    return {
      currentStreak,
      longestStreak,
      totalPractices,
      successRate,
      weeklyGoal,
      thisWeekCount
    };
  }, [habits, weeklyGoal]);

  const isConsecutiveDay = (date1: string, date2: string): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d1.getTime() - d2.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  const addHabit = () => {
    if (!newHabit.situation?.trim()) return;

    const habit: HabitEntry = {
      date: new Date().toISOString().split('T')[0],
      ruleId: newHabit.ruleId!,
      difficulty: newHabit.difficulty!,
      situation: newHabit.situation.trim(),
      outcome: newHabit.outcome!,
      notes: newHabit.notes?.trim() || undefined,
      timestamp: Date.now()
    };

    setHabits(prev => [...prev, habit]);
    setNewHabit({
      ruleId: 1,
      difficulty: 3,
      situation: '',
      outcome: 'success',
      notes: ''
    });
    setShowAddForm(false);
  };

  const getRecentHabits = () => {
    return habits
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  };

  const ruleNames = [
    'Patience Under Fire', 'Refusing Unfair Blame', 'Silence Games',
    'Mood Swings & Pace', 'Public Pressure', 'Masculinity Challenge',
    'Moving Goalposts', 'Selective Memory', 'Jealousy Traps', 'Rhythm Control'
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Frame Control Habit Tracker
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Build mastery through consistent practice. Track your real-world applications.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="glass-effect rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.currentStreak}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Day Streak</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="w-6 h-6 text-purple-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.longestStreak}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Best Streak</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.successRate.toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.thisWeekCount}/{stats.weeklyGoal}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">This Week</p>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="glass-effect rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Weekly Progress
          </h3>
          <div className="flex items-center gap-2">
            <label htmlFor="weekly-goal" className="text-sm text-slate-600 dark:text-slate-400">
              Goal:
            </label>
            <select 
              id="weekly-goal"
              value={weeklyGoal} 
              onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
              className="bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1 text-sm"
            >
              {[3, 5, 7, 10, 14].map(num => (
                <option key={num} value={num}>{num} practices/week</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((stats.thisWeekCount / stats.weeklyGoal) * 100, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>{stats.thisWeekCount} practices completed</span>
          <span>{Math.max(0, stats.weeklyGoal - stats.thisWeekCount)} remaining</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add New Practice */}
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Log New Practice
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {showAddForm ? 'Cancel' : 'Add Practice'}
            </button>
          </div>

          {showAddForm && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Which rule did you practice?
                </label>
                <select 
                  value={newHabit.ruleId} 
                  onChange={(e) => setNewHabit(prev => ({ ...prev, ruleId: parseInt(e.target.value) }))}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2"
                >
                  {ruleNames.map((name, idx) => (
                    <option key={idx} value={idx + 1}>Rule {idx + 1}: {name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Describe the situation
                </label>
                <textarea 
                  value={newHabit.situation} 
                  onChange={(e) => setNewHabit(prev => ({ ...prev, situation: e.target.value }))}
                  placeholder="e.g., Coworker tried to rush me into a decision during a meeting..."
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Difficulty Level
                  </label>
                  <select 
                    value={newHabit.difficulty} 
                    onChange={(e) => setNewHabit(prev => ({ ...prev, difficulty: parseInt(e.target.value) as any }))}
                    className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2"
                  >
                    <option value={1}>1 - Very Easy</option>
                    <option value={2}>2 - Easy</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - Hard</option>
                    <option value={5}>5 - Very Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Outcome
                  </label>
                  <select 
                    value={newHabit.outcome} 
                    onChange={(e) => setNewHabit(prev => ({ ...prev, outcome: e.target.value as any }))}
                    className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2"
                  >
                    <option value="success">Success</option>
                    <option value="partial">Partial Success</option>
                    <option value="failed">Didn't Apply Rule</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes (optional)
                </label>
                <textarea 
                  value={newHabit.notes} 
                  onChange={(e) => setNewHabit(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="What worked well? What would you do differently?"
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 resize-none"
                  rows={2}
                />
              </div>

              <button
                onClick={addHabit}
                disabled={!newHabit.situation?.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors duration-200"
              >
                Log Practice Session
              </button>
            </div>
          )}
        </div>

        {/* Recent Practices */}
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Recent Practices
          </h3>
          
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No practices logged yet. Start by adding your first practice session!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getRecentHabits().map((habit) => (
                <div key={habit.timestamp} className="bg-white/30 dark:bg-black/20 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Rule {habit.ruleId}: {ruleNames[habit.ruleId - 1]}
                      </span>
                      <div className={`
                        w-2 h-2 rounded-full
                        ${habit.outcome === 'success' ? 'bg-green-500' : 
                          habit.outcome === 'partial' ? 'bg-yellow-500' : 'bg-red-500'}
                      `} />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(habit.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    {habit.situation}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Difficulty: {habit.difficulty}/5</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${habit.outcome === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                        habit.outcome === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}
                    `}>
                      {habit.outcome === 'success' ? 'Success' : 
                       habit.outcome === 'partial' ? 'Partial' : 'Failed'}
                    </span>
                  </div>
                  
                  {habit.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">
                      "{habit.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Achievement Badges */}
      {stats.totalPractices > 0 && (
        <div className="mt-8 glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Achievement Badges
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'First Steps', requirement: 1, icon: <Star className="w-6 h-6" />, achieved: stats.totalPractices >= 1 },
              { title: 'Consistent', requirement: 7, icon: <Clock className="w-6 h-6" />, achieved: stats.currentStreak >= 7 },
              { title: 'Dedicated', requirement: 25, icon: <Target className="w-6 h-6" />, achieved: stats.totalPractices >= 25 },
              { title: 'Master', requirement: 100, icon: <Award className="w-6 h-6" />, achieved: stats.totalPractices >= 100 },
            ].map((badge, idx) => (
              <div 
                key={idx} 
                className={`
                  p-4 rounded-lg text-center transition-all duration-200
                  ${badge.achieved 
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                <div className="mb-2 flex justify-center">
                  {badge.icon}
                </div>
                <p className="font-semibold text-sm">{badge.title}</p>
                <p className="text-xs opacity-80">
                  {badge.achieved ? 'Earned!' : `${badge.requirement} practices`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;