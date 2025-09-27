import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Brain,
  ArrowRight,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface AssessmentQuestion {
  id: number;
  category: string;
  ruleId: number;
  scenario: string;
  question: string;
  options: {
    text: string;
    score: number; // 1-4 scale (1=weak, 4=strong)
    explanation?: string;
  }[];
}

interface AssessmentResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  weakestAreas: string[];
  strongestAreas: string[];
  recommendations: string[];
}

const Assessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const questions: AssessmentQuestion[] = useMemo(() => [
    {
      id: 1,
      category: "Patience Under Fire",
      ruleId: 1,
      scenario: "Your colleague sends you an urgent email at 9 PM demanding an immediate response to something that could wait until morning.",
      question: "What's your most likely response?",
      options: [
        { text: "Immediately respond to resolve the situation", score: 1, explanation: "This shows present bias - overvaluing immediate action" },
        { text: "Feel stressed but force myself to wait until morning", score: 2 },
        { text: "Calmly assess if it's truly urgent, then decide", score: 3 },
        { text: "Confidently wait until morning unless it's genuinely critical", score: 4, explanation: "Strong frame control - not reacting to artificial urgency" }
      ]
    },
    {
      id: 2,
      category: "Unfair Blame",
      ruleId: 2,
      scenario: "Someone says: 'You should have reminded me about that deadline. It's partially your fault we missed it.'",
      question: "How do you typically respond?",
      options: [
        { text: "Apologize and take responsibility", score: 1, explanation: "Accepting their frame without question" },
        { text: "Defend yourself by listing what you did do", score: 2 },
        { text: "Clarify the actual responsibilities without defensiveness", score: 3 },
        { text: "Reframe: 'Sounds like we have different views on responsibility'", score: 4, explanation: "Excellent reframing without accepting false premises" }
      ]
    },
    {
      id: 3,
      category: "Silent Treatment",
      ruleId: 3,
      scenario: "Someone you care about suddenly becomes distant and stops responding to your messages for several days.",
      question: "What's your natural tendency?",
      options: [
        { text: "Send multiple messages trying to fix whatever went wrong", score: 1, explanation: "Classic loss aversion - chasing to avoid perceived loss" },
        { text: "Feel anxious but try to give them space", score: 2 },
        { text: "Reach out once, then return to your own priorities", score: 3 },
        { text: "Treat silence as information, not a crisis to solve", score: 4, explanation: "Strong frame - not interpreting silence as loss" }
      ]
    },
    {
      id: 4,
      category: "Emotional Volatility",
      ruleId: 4,
      scenario: "During a discussion, the other person's voice gets louder and their energy becomes intense and scattered.",
      question: "How do you usually respond?",
      options: [
        { text: "Match their energy level to be heard", score: 1, explanation: "Mirroring chaos - letting them set the emotional anchor" },
        { text: "Get uncomfortable and try to end the conversation", score: 2 },
        { text: "Stay calmer but still feel affected by their energy", score: 3 },
        { text: "Deliberately lower my voice and slow my pace", score: 4, explanation: "Excellent anchoring reset - leading the emotional tone" }
      ]
    },
    {
      id: 5,
      category: "Social Pressure",
      ruleId: 5,
      scenario: "At a social gathering, someone makes a teasing comment about you in front of others that feels like a subtle challenge.",
      question: "Your go-to response is:",
      options: [
        { text: "Get defensive and explain why they're wrong", score: 1, explanation: "Over-defensiveness signals the comment hit its mark" },
        { text: "Feel uncomfortable and withdraw from the group", score: 2 },
        { text: "Try to make a comeback or counter-tease", score: 3 },
        { text: "Smile and redirect playfully: 'Tough crowd tonight!'", score: 4, explanation: "Perfect social proof management - staying unruffled" }
      ]
    }
  ], []);

  const calculateResults = (): AssessmentResult => {
    const categoryTotals: Record<string, { sum: number; count: number }> = {};
    let overallSum = 0;
    let totalQuestions = 0;

    Object.entries(answers).forEach(([questionId, score]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question) {
        if (!categoryTotals[question.category]) {
          categoryTotals[question.category] = { sum: 0, count: 0 };
        }
        categoryTotals[question.category].sum += score;
        categoryTotals[question.category].count += 1;
        overallSum += score;
        totalQuestions += 1;
      }
    });

    const overallScore = Math.round((overallSum / (totalQuestions * 4)) * 100);
    
    const categoryScores: Record<string, number> = {};
    Object.entries(categoryTotals).forEach(([category, { sum, count }]) => {
      categoryScores[category] = Math.round((sum / (count * 4)) * 100);
    });

    const sortedCategories = Object.entries(categoryScores).sort(([,a], [,b]) => a - b);
    const weakestAreas = sortedCategories.slice(0, 2).map(([category]) => category);
    const strongestAreas = sortedCategories.slice(-2).map(([category]) => category);

    const recommendations = generateRecommendations(weakestAreas, overallScore);

    return {
      overallScore,
      categoryScores,
      weakestAreas,
      strongestAreas,
      recommendations
    };
  };

  const generateRecommendations = (weakestAreas: string[], overallScore: number): string[] => {
    const recs: string[] = [];
    
    if (overallScore < 50) {
      recs.push("Start with the Introduction section to build your foundational understanding");
    }
    
    if (weakestAreas.includes("Patience Under Fire")) {
      recs.push("Practice the 10-second pause technique before responding to urgent requests");
    }
    
    if (weakestAreas.includes("Unfair Blame")) {
      recs.push("Study framing techniques and practice reframing conversations without defensiveness");
    }
    
    if (weakestAreas.includes("Silent Treatment")) {
      recs.push("Focus on loss aversion principles - silence isn't always loss");
    }

    recs.push("Focus on your weakest areas first - they'll give you the biggest improvement");
    recs.push("Practice one rule at a time in real-world situations");
    
    return recs;
  };

  const handleAnswer = (score: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: score }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const results = useMemo(() => {
    return showResults ? calculateResults() : null;
  }, [showResults, answers]);

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="glass-effect rounded-3xl p-8 text-center">
          <div className="mb-6">
            <BarChart3 className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Frame Control Assessment
            </h2>
            <p className="text-lg text-slate-700 dark:text-purple-200 max-w-2xl mx-auto">
              Discover your current frame control strengths and identify areas for improvement with this personalized assessment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What You'll Discover</h3>
              <ul className="space-y-1 text-blue-900 dark:text-blue-100 text-sm">
                <li>• Your overall frame control score</li>
                <li>• Specific strengths and weaknesses</li>
                <li>• Personalized learning recommendations</li>
                <li>• Priority areas for improvement</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6">
              <Target className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">How It Works</h3>
              <ul className="space-y-1 text-green-900 dark:text-green-100 text-sm">
                <li>• 5 scenario-based questions</li>
                <li>• Takes about 3-5 minutes</li>
                <li>• Based on behavioral psychology</li>
                <li>• Immediate detailed results</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => setIsStarted(true)}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-lg"
          >
            Start Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="glass-effect rounded-3xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-4">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {results.overallScore}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Your Frame Control Score
            </h2>
            <p className="text-lg text-slate-700 dark:text-purple-200">
              {results.overallScore >= 80 ? "Excellent frame control!" : 
               results.overallScore >= 60 ? "Good foundation with room for growth" :
               results.overallScore >= 40 ? "Developing your frame control skills" :
               "Great opportunity for significant improvement"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mb-3" />
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3">Areas for Improvement</h3>
              <div className="space-y-2">
                {results.weakestAreas.map(area => (
                  <div key={area} className="flex items-center justify-between">
                    <span className="text-red-900 dark:text-red-100 text-sm">{area}</span>
                    <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                      {results.categoryScores[area]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">Your Strengths</h3>
              <div className="space-y-2">
                {results.strongestAreas.map(area => (
                  <div key={area} className="flex items-center justify-between">
                    <span className="text-green-900 dark:text-green-100 text-sm">{area}</span>
                    <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                      {results.categoryScores[area]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
            <Lightbulb className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
              Personalized Recommendations
            </h3>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="text-blue-900 dark:text-blue-100 text-sm flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setIsStarted(false);
              setShowResults(false);
              setCurrentQuestion(0);
              setAnswers({});
            }}
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 mr-4"
          >
            Retake Assessment
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            Start Learning
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="glass-effect rounded-3xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-purple-200">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-purple-200">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
              Scenario: {currentQ.category}
            </h3>
            <p className="text-purple-900 dark:text-purple-100 leading-relaxed">
              {currentQ.scenario}
            </p>
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.score)}
              className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-purple-500 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assessment;