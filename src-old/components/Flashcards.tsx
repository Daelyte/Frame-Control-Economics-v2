import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  X, 
  Brain,
  TrendingUp,
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  ruleId?: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  lastReviewDate?: string;
  nextReviewDate?: string;
  reviewCount: number;
  correctStreak: number;
  interval: number; // days until next review
}

interface ReviewSession {
  correct: number;
  incorrect: number;
  totalTime: number;
  cardsReviewed: string[];
  date: string;
}

const FLASHCARDS_STORAGE_KEY = 'frame_econ_flashcards_v1';
const SESSIONS_STORAGE_KEY = 'frame_econ_sessions_v1';

const Flashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [sessions, setSessions] = useState<ReviewSession[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Initialize default flashcards
  const defaultFlashcards: Flashcard[] = useMemo(() => [
    {
      id: 'rule-1-concept',
      front: 'What psychological bias makes urgent requests feel more important than they are?',
      back: 'Present Bias - Humans naturally overvalue immediate rewards and undervalue future benefits, making "urgent" requests seem more critical than they typically are.',
      category: 'Behavioral Economics',
      ruleId: 1,
      difficulty: 2,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'rule-1-application',
      front: 'Someone sends you an "urgent" email at 9 PM. What\'s the Frame Economics response?',
      back: 'Apply Rule 1: Patience Under Fire. Pause 10 seconds and ask "Will this matter in a week?" Don\'t pay emotional "interest" on artificial urgency.',
      category: 'Practical Application',
      ruleId: 1,
      difficulty: 3,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'rule-2-concept',
      front: 'What is the "Framing Effect" and how does it work?',
      back: 'The Framing Effect means the same information presented differently leads to different decisions. Frames dictate perceived fairness and outcomes.',
      category: 'Behavioral Economics',
      ruleId: 2,
      difficulty: 2,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'rule-2-trap',
      front: 'Someone says "You should have reminded me." What\'s the trap?',
      back: 'The trap is defending inside their frame. They\'ve positioned you as responsible for their memory. Don\'t accept false premises.',
      category: 'Frame Traps',
      ruleId: 2,
      difficulty: 3,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'rule-3-psychology',
      front: 'Why do "silence games" work so effectively on most people?',
      back: 'Loss Aversion - We feel losses 2x more intensely than equivalent gains. Silence is interpreted as loss of attention/approval, triggering chase behavior.',
      category: 'Psychology',
      ruleId: 3,
      difficulty: 4,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'rule-4-anchoring',
      front: 'How does "Anchoring" work in emotional exchanges?',
      back: 'The first emotion sets the anchor for the entire interaction. If someone starts with high intensity, that becomes the reference point.',
      category: 'Behavioral Economics',
      ruleId: 4,
      difficulty: 3,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'rule-4-counter',
      front: 'Someone is speaking loudly and intensely. What\'s your counter-move?',
      back: 'Deliberately lower your voice and slow your pace. This resets the emotional anchor and forces them to match your calmer energy.',
      category: 'Practical Application',
      ruleId: 4,
      difficulty: 4,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'rule-5-social-proof',
      front: 'What is Social Proof and when is it strongest?',
      back: 'Social Proof is when people follow group behavior, especially under uncertainty. It\'s strongest when we\'re unsure what to do.',
      category: 'Behavioral Economics',
      ruleId: 5,
      difficulty: 2,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'frame-control-core',
      front: 'What is the core principle of Frame Economics?',
      back: 'Masters don\'t fight for control—they become the stable center others orbit. Maintain your frame through calm consistency.',
      category: 'Core Principles',
      difficulty: 3,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'system-1-vs-2',
      front: 'Explain System 1 vs System 2 thinking in social situations.',
      back: 'System 1: Fast, automatic, emotional reactions. System 2: Slow, deliberate, rational analysis. Most frame battles happen in System 1.',
      category: 'Psychology',
      difficulty: 4,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'meta-frames',
      front: 'What are "Meta-Frames" and give an example.',
      back: 'Meta-frames are frames about frames. Example: "I notice we\'re both trying to control how this conversation goes." Acknowledging the frame battle itself.',
      category: 'Advanced Concepts',
      difficulty: 5,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    },
    {
      id: 'frame-aikido',
      front: 'What is "Frame Aikido"?',
      back: 'Using the opponent\'s frame energy to redirect rather than resist. Example: "You\'re right to be concerned about X, which is why Y makes sense."',
      category: 'Advanced Concepts',
      difficulty: 5,
      reviewCount: 0,
      correctStreak: 0,
      interval: 1
    }
  ], []);

  // Load data on mount
  useEffect(() => {
    try {
      const savedCards = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
      const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
      
      if (savedCards) {
        setFlashcards(JSON.parse(savedCards));
      } else {
        // Initialize with default cards
        setFlashcards(defaultFlashcards);
      }
      
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.warn('Failed to load flashcard data:', error);
      setFlashcards(defaultFlashcards);
    }
  }, [defaultFlashcards]);

  // Save flashcards when they change
  useEffect(() => {
    if (flashcards.length > 0) {
      try {
        localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
      } catch (error) {
        console.warn('Failed to save flashcard data:', error);
      }
    }
  }, [flashcards]);

  // Save sessions when they change
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.warn('Failed to save session data:', error);
      }
    }
  }, [sessions]);

  // Calculate next review interval using spaced repetition
  const calculateNextInterval = (currentInterval: number, correctStreak: number, wasCorrect: boolean): number => {
    if (!wasCorrect) {
      return 1; // Reset to 1 day if incorrect
    }
    
    // Modified SM-2 algorithm
    const easeFactor = Math.max(1.3, 2.5 + (0.15 * correctStreak) - (0.05 * (5 - correctStreak)));
    return Math.round(currentInterval * easeFactor);
  };

  // Get cards due for review
  const getDueCards = (): Flashcard[] => {
    const today = new Date().toISOString().split('T')[0];
    return flashcards.filter(card => {
      if (!card.nextReviewDate) return true;
      return card.nextReviewDate <= today;
    });
  };

  // Start a review session
  const startSession = () => {
    const dueCards = getDueCards();
    if (dueCards.length === 0) return;
    
    // Shuffle cards
    const shuffledCards = [...dueCards].sort(() => Math.random() - 0.5);
    setCurrentCard(shuffledCards[0]);
    setSessionActive(true);
    setSessionStats({ correct: 0, incorrect: 0 });
    setSessionStartTime(Date.now());
    setShowAnswer(false);
  };

  // Handle card review
  const reviewCard = (wasCorrect: boolean) => {
    if (!currentCard) return;

    // Update card statistics
    const updatedCard: Flashcard = {
      ...currentCard,
      lastReviewDate: new Date().toISOString().split('T')[0],
      reviewCount: currentCard.reviewCount + 1,
      correctStreak: wasCorrect ? currentCard.correctStreak + 1 : 0,
      interval: calculateNextInterval(currentCard.interval, currentCard.correctStreak, wasCorrect)
    };

    // Calculate next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + updatedCard.interval);
    updatedCard.nextReviewDate = nextDate.toISOString().split('T')[0];

    // Update flashcards array
    setFlashcards(prev => 
      prev.map(card => card.id === currentCard.id ? updatedCard : card)
    );

    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      incorrect: prev.incorrect + (wasCorrect ? 0 : 1)
    }));

    // Move to next card
    const remainingCards = getDueCards().filter(card => card.id !== currentCard.id);
    
    if (remainingCards.length > 0) {
      const nextCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
      setCurrentCard(nextCard);
      setShowAnswer(false);
    } else {
      // End session
      endSession();
    }
  };

  // End the session
  const endSession = () => {
    const sessionTime = Date.now() - sessionStartTime;
    const newSession: ReviewSession = {
      correct: sessionStats.correct,
      incorrect: sessionStats.incorrect,
      totalTime: sessionTime,
      cardsReviewed: [], // We could track this if needed
      date: new Date().toISOString().split('T')[0]
    };

    setSessions(prev => [...prev, newSession]);
    setSessionActive(false);
    setCurrentCard(null);
    setShowAnswer(false);
  };

  const dueCards = getDueCards();
  const totalCards = flashcards.length;
  const reviewedCards = flashcards.filter(card => card.reviewCount > 0).length;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Frame Economics Flashcards
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Master concepts through spaced repetition. Review cards when they\'re due for maximum retention.
        </p>
      </div>

      {!sessionActive ? (
        <>
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-red-500" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dueCards.length}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Due Today</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalCards}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Cards</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-green-500" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reviewedCards}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Reviewed</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-500" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {sessions.length}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Sessions</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mb-8">
            <div className="space-y-4">
              {dueCards.length > 0 ? (
                <button
                  onClick={startSession}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200"
                >
                  <Brain className="w-6 h-6" />
                  Start Review Session
                  <span className="bg-white/20 rounded-full px-2 py-1 text-sm">
                    {dueCards.length} cards
                  </span>
                </button>
              ) : (
                <div className="glass-effect rounded-2xl p-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    All caught up!
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    No cards are due for review right now. Come back tomorrow!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Performance */}
          {sessions.length > 0 && (
            <div className="glass-effect rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Recent Performance
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {sessions.slice(-3).reverse().map((session, idx) => (
                  <div key={idx} className="bg-white/30 dark:bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {Math.round(session.totalTime / 60000)}min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                            {session.correct}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                            {session.incorrect}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {Math.round((session.correct / (session.correct + session.incorrect)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Categories */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Card Categories
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(
                flashcards.reduce((acc, card) => {
                  acc[card.category] = (acc[card.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([category, count]) => (
                <div key={category} className="bg-white/30 dark:bg-black/20 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {category}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {count} cards
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Active Session */
        <div className="space-y-6">
          {/* Session Progress */}
          <div className="glass-effect rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Progress: {sessionStats.correct + sessionStats.incorrect + 1}/{dueCards.length}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {sessionStats.correct}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                      {sessionStats.incorrect}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={endSession}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                End Session
              </button>
            </div>
          </div>

          {/* Flashcard */}
          {currentCard && (
            <div className="glass-effect rounded-2xl p-8 min-h-[400px] flex flex-col justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                    {currentCard.category}
                    {currentCard.ruleId && ` • Rule ${currentCard.ruleId}`}
                  </span>
                </div>

                <div className="mb-8">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                    {showAnswer ? 'Answer' : 'Question'}
                  </div>
                  <div className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    {showAnswer ? currentCard.back : currentCard.front}
                  </div>
                </div>

                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Show Answer
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      How well did you know this?
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => reviewCard(false)}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                        Incorrect
                      </button>
                      <button
                        onClick={() => reviewCard(true)}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                      >
                        <Check className="w-5 h-5" />
                        Correct
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashcards;