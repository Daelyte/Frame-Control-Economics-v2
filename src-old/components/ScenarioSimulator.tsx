import React, { useState, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Trophy,
  User,
  Bot,
  Lightbulb,
  Target
} from 'lucide-react';

interface ScenarioChoice {
  text: string;
  ruleApplied: number | null;
  effectiveness: 'poor' | 'fair' | 'good' | 'excellent';
  feedback: string;
  nextScenario?: string;
}

interface ScenarioStep {
  id: string;
  context: string;
  situation: string;
  character: string;
  characterMessage: string;
  choices: ScenarioChoice[];
  learningPoint: string;
}

interface Scenario {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  description: string;
  steps: { [key: string]: ScenarioStep };
  startStep: string;
}

const ScenarioSimulator: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [choiceHistory, setChoiceHistory] = useState<Array<{
    step: string;
    choice: ScenarioChoice;
    timestamp: number;
  }>>([]);
  const [showResults, setShowResults] = useState(false);

  const scenarios = useMemo(() => [
    {
      id: 'workplace_urgency',
      title: 'The Urgent Email Trap',
      difficulty: 'beginner',
      category: 'Patience Under Fire',
      description: 'Practice maintaining composure when faced with artificial urgency in professional settings.',
      startStep: 'initial_email',
      steps: {
        initial_email: {
          id: 'initial_email',
          context: 'It\'s Friday at 5:30 PM. You\'re wrapping up for the weekend when you receive an email.',
          situation: 'Your manager sends an email marked "URGENT" asking for a comprehensive report that would normally take 3-4 hours to prepare properly.',
          character: 'Your Manager',
          characterMessage: 'Hi, I need that market analysis report ASAP for Monday\'s meeting. This is urgent - can you get this done tonight? The client is expecting it first thing Monday.',
          choices: [
            {
              text: 'Immediately agree and cancel weekend plans',
              ruleApplied: null,
              effectiveness: 'poor',
              feedback: 'You\'ve fallen into present bias - overvaluing immediate response over rational assessment. This teaches others that "urgent" demands always work.',
              nextScenario: 'manager_escalation'
            },
            {
              text: 'Express frustration about the timing',
              ruleApplied: null,
              effectiveness: 'fair',
              feedback: 'While understandable, emotional reactions weaken your frame. Better to stay calm and professional.',
              nextScenario: 'manager_defensive'
            },
            {
              text: 'Ask clarifying questions about true urgency and deadline',
              ruleApplied: 1,
              effectiveness: 'good',
              feedback: 'Good application of Rule 1! You\'re resisting present bias by gathering information before reacting.',
              nextScenario: 'manager_clarification'
            },
            {
              text: 'Calmly explain what\'s possible by Monday and when you can deliver quality work',
              ruleApplied: 1,
              effectiveness: 'excellent',
              feedback: 'Excellent frame control! You\'re setting realistic expectations while maintaining professionalism. This teaches respect for your time.',
              nextScenario: 'manager_respect'
            }
          ],
          learningPoint: 'Present bias makes urgent requests feel more important than they are. Pause and assess before reacting.'
        },
        manager_escalation: {
          id: 'manager_escalation',
          context: 'You agreed to work over the weekend. Now it\'s Monday and your manager has another "urgent" request.',
          situation: 'Your pattern of immediate compliance has established an expectation. Your manager continues to rely on last-minute requests.',
          character: 'Your Manager',
          characterMessage: 'Great job on the weekend work! I have another urgent project that needs to be done by tomorrow. I knew I could count on you.',
          choices: [
            {
              text: 'Agree again to maintain your reputation',
              ruleApplied: null,
              effectiveness: 'poor',
              feedback: 'You\'re reinforcing a pattern that will continue to exploit your time. This is unsustainable.',
              nextScenario: 'burnout_path'
            },
            {
              text: 'Set boundaries about realistic timelines going forward',
              ruleApplied: 1,
              effectiveness: 'good',
              feedback: 'Better! You\'re beginning to reset expectations, though it may require consistency to change the established pattern.',
              nextScenario: 'boundary_setting'
            }
          ],
          learningPoint: 'Patterns of immediate compliance create expectations. Breaking these patterns requires consistent boundary setting.'
        },
        manager_respect: {
          id: 'manager_respect',
          context: 'Your calm, professional response has earned respect. Your manager values your clear communication.',
          situation: 'By maintaining your frame, you\'ve established yourself as someone who thinks before reacting and delivers quality work.',
          character: 'Your Manager',
          characterMessage: 'I appreciate your honesty about timelines. Let\'s schedule a brief call Monday morning to plan this properly.',
          choices: [
            {
              text: 'Confirm the Monday meeting time',
              ruleApplied: 1,
              effectiveness: 'excellent',
              feedback: 'Perfect! You\'ve successfully shifted from reactive urgency to proactive planning. This is sustainable professional behavior.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'Maintaining your frame often leads to better outcomes and increased respect from others.'
        },
        manager_defensive: {
          id: 'manager_defensive',
          context: 'Your emotional reaction has weakened your position.',
          situation: 'By expressing frustration, you\'ve given them emotional ammunition and weakened your frame.',
          character: 'Your Manager',
          characterMessage: 'Look, I understand you\'re frustrated, but this is part of the job. Can you just get it done?',
          choices: [
            {
              text: 'Apologize and agree to work over the weekend',
              ruleApplied: null,
              effectiveness: 'poor',
              feedback: 'You\'ve lost the frame battle and established a pattern of emotional compliance.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'Emotional reactions weaken your position and give others leverage over you.'
        },
        manager_clarification: {
          id: 'manager_clarification',
          context: 'Your questions have prompted more details about the actual urgency.',
          situation: 'By asking clarifying questions, you\'ve discovered the true timeline and can respond appropriately.',
          character: 'Your Manager',
          characterMessage: 'Well, the meeting is Monday afternoon, so I guess we could discuss it first thing Monday morning if needed.',
          choices: [
            {
              text: 'Offer to prepare an outline over the weekend and the full report Monday morning',
              ruleApplied: 1,
              effectiveness: 'excellent',
              feedback: 'Perfect balance - showing willingness to help while maintaining reasonable boundaries.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'Clarifying questions often reveal that "urgent" requests aren\'t actually urgent.'
        },
        boundary_setting: {
          id: 'boundary_setting',
          context: 'You\'re starting to establish better boundaries after the weekend work pattern.',
          situation: 'This is a crucial moment - will you maintain your new boundaries or fall back into old patterns?',
          character: 'Your Manager',
          characterMessage: 'I understand, but this client is really important. Can you make an exception just this once?',
          choices: [
            {
              text: 'Stick to your boundaries consistently',
              ruleApplied: 1,
              effectiveness: 'excellent',
              feedback: 'Excellent consistency! Boundaries only work when they\'re maintained consistently.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'Boundaries must be maintained consistently to be effective.'
        },
        burnout_path: {
          id: 'burnout_path',
          context: 'The pattern continues and you\'re heading toward burnout.',
          situation: 'Your consistent compliance has created an unsustainable expectation pattern.',
          character: 'Your Manager',
          characterMessage: 'You\'re such a team player! I have another rush project for this weekend...',
          choices: [
            {
              text: 'Continue the pattern',
              ruleApplied: null,
              effectiveness: 'poor',
              feedback: 'This pattern leads to burnout and resentment. Breaking it becomes harder over time.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'Patterns of immediate compliance create unsustainable expectations and lead to burnout.'
        }
      }
    },
    {
      id: 'social_challenge',
      title: 'The Group Tease',
      difficulty: 'intermediate',
      category: 'Social Pressure',
      description: 'Navigate social challenges and teasing in group settings while maintaining your composure.',
      startStep: 'group_setting',
      steps: {
        group_setting: {
          id: 'group_setting',
          context: 'You\'re at a social gathering with friends and acquaintances. The conversation is light and fun.',
          situation: 'Someone makes a comment about something you\'re wearing or a recent life choice, with a slight edge that feels like a test in front of the group.',
          character: 'Acquaintance',
          characterMessage: 'Oh wow, [your name], that\'s a... unique choice. I mean, you\'ve always been the \'adventurous\' one in the group, right?',
          choices: [
            {
              text: 'Get defensive and explain your choices',
              ruleApplied: null,
              effectiveness: 'poor',
              feedback: 'Defensiveness signals that the comment hit its mark. This often leads to more testing behavior.',
              nextScenario: 'group_feeding_frenzy'
            },
            {
              text: 'Fire back with a counter-criticism',
              ruleApplied: null,
              effectiveness: 'fair',
              feedback: 'This escalates conflict and makes the social situation uncomfortable for everyone. You\'re fighting on their terms.',
              nextScenario: 'social_tension'
            },
            {
              text: 'Smile and redirect: "Tough crowd tonight!" then change the subject',
              ruleApplied: 5,
              effectiveness: 'excellent',
              feedback: 'Perfect application of Rule 5! You\'ve acknowledged the comment without taking the bait, staying unruffled while redirecting social energy.',
              nextScenario: 'social_leadership'
            },
            {
              text: 'Laugh genuinely and own it: "Guilty as charged!" with confidence',
              ruleApplied: 5,
              effectiveness: 'good',
              feedback: 'Good frame control! By owning it without defensiveness, you\'ve removed their ammunition and shown confidence.',
              nextScenario: 'confident_response'
            }
          ],
          learningPoint: 'Social proof dynamics mean the group will follow confident, unruffled responses rather than defensive reactions.'
        },
        social_leadership: {
          id: 'social_leadership',
          context: 'Your playful redirect has shifted the group energy. Others are now following your lead in the conversation.',
          situation: 'The group naturally moves away from the testing behavior and toward more positive interaction.',
          character: 'Friend',
          characterMessage: 'Haha, you always know how to keep things light. So did you see that new movie that just came out?',
          choices: [
            {
              text: 'Continue leading positive conversation',
              ruleApplied: 5,
              effectiveness: 'excellent',
              feedback: 'Excellent! You\'ve successfully used social proof to elevate the entire group dynamic. This is leadership through frame control.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'When you maintain a strong, positive frame, others naturally follow your lead in social situations.'
        },
        confident_response: {
          id: 'confident_response',
          context: 'Your confident ownership has defused the situation.',
          situation: 'By owning it with confidence, you\'ve removed the ammunition from the comment and shown unshakeable self-assurance.',
          character: 'Acquaintance',
          characterMessage: 'Well, I respect that confidence. That takes guts.',
          choices: [
            {
              text: 'Accept the respect gracefully and continue the conversation',
              ruleApplied: 5,
              effectiveness: 'excellent',
              feedback: 'Perfect! You\'ve turned a potential attack into earned respect through confident frame control.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'Confident ownership of your choices removes ammunition from critics and often earns respect.'
        },
        group_feeding_frenzy: {
          id: 'group_feeding_frenzy',
          context: 'Your defensive response has encouraged more testing behavior.',
          situation: 'The group senses weakness and others begin to pile on with additional comments.',
          character: 'Another Friend',
          characterMessage: 'Yeah, you do have some... interesting style choices. Remember that phase you went through last year?',
          choices: [
            {
              text: 'Get more defensive and try to explain yourself',
              ruleApplied: null,
              effectiveness: 'poor',
              feedback: 'This makes the situation worse. The group now sees you as an easy target.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'Defensiveness signals weakness and often invites more testing behavior from groups.'
        },
        social_tension: {
          id: 'social_tension',
          context: 'The counter-attack has created uncomfortable tension in the group.',
          situation: 'Others feel awkward and the social dynamic has become hostile.',
          character: 'Friend',
          characterMessage: 'Okay, okay, let\'s just change the subject. Things are getting a bit heavy here.',
          choices: [
            {
              text: 'Agree to move on but note the lesson learned',
              ruleApplied: 5,
              effectiveness: 'fair',
              feedback: 'Better to learn from this. Fighting fire with fire often burns everyone.',
              nextScenario: 'scenario_complete'
            }
          ],
          learningPoint: 'Fighting on their terms often creates lose-lose situations where everyone feels uncomfortable.'
        }
      }
    }
  ] as Scenario[], []);

  const getCurrentScenarioData = () => {
    if (!currentScenario) return null;
    return scenarios.find(s => s.id === currentScenario);
  };

  const getCurrentStep = () => {
    const scenarioData = getCurrentScenarioData();
    if (!scenarioData || !currentStep) return null;
    return scenarioData.steps[currentStep];
  };

  const startScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setCurrentScenario(scenarioId);
      setCurrentStep(scenario.startStep);
      setChoiceHistory([]);
      setShowResults(false);
    }
  };

  const makeChoice = (choice: ScenarioChoice) => {
    const timestamp = Date.now();
    setChoiceHistory(prev => [...prev, {
      step: currentStep,
      choice,
      timestamp
    }]);

    if (choice.nextScenario === 'scenario_complete') {
      setShowResults(true);
    } else if (choice.nextScenario) {
      setCurrentStep(choice.nextScenario);
    }
  };

  const resetSimulator = () => {
    setCurrentScenario(null);
    setCurrentStep('');
    setChoiceHistory([]);
    setShowResults(false);
  };

  const getPerformanceScore = () => {
    if (choiceHistory.length === 0) return 0;
    
    const scoreMap = { poor: 1, fair: 2, good: 3, excellent: 4 };
    const totalScore = choiceHistory.reduce((sum, item) => sum + scoreMap[item.choice.effectiveness], 0);
    const maxPossible = choiceHistory.length * 4;
    
    return Math.round((totalScore / maxPossible) * 100);
  };

  const getEffectivenessColor = (effectiveness: ScenarioChoice['effectiveness']) => {
    switch (effectiveness) {
      case 'poor': return 'text-red-600 dark:text-red-400';
      case 'fair': return 'text-yellow-600 dark:text-yellow-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'excellent': return 'text-green-600 dark:text-green-400';
    }
  };

  const getEffectivenessIcon = (effectiveness: ScenarioChoice['effectiveness']) => {
    switch (effectiveness) {
      case 'poor': return <XCircle className="w-5 h-5" />;
      case 'fair': return <XCircle className="w-5 h-5" />;
      case 'good': return <CheckCircle className="w-5 h-5" />;
      case 'excellent': return <Trophy className="w-5 h-5" />;
    }
  };

  // Scenario selection screen
  if (!currentScenario) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="glass-effect rounded-3xl p-8 mb-8 text-center">
          <Play className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Frame Control Simulator
          </h2>
          <p className="text-lg text-slate-700 dark:text-purple-200 max-w-2xl mx-auto mb-8">
            Practice applying frame control principles in realistic scenarios. Make choices, get feedback, and improve your skills.
          </p>
        </div>

        <div className="grid gap-6">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="glass-effect rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {scenario.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      scenario.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                      scenario.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-3">
                    {scenario.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <Target className="w-4 h-4" />
                    Practice: {scenario.category}
                  </div>
                </div>
                <button
                  onClick={() => startScenario(scenario.id)}
                  className="ml-4 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Start
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const scenarioData = getCurrentScenarioData();
  const stepData = getCurrentStep();

  // Results screen
  if (showResults && scenarioData) {
    const score = getPerformanceScore();
    
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="glass-effect rounded-3xl p-8 mb-8">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Scenario Complete!
            </h2>
            <h3 className="text-xl text-slate-700 dark:text-purple-200 mb-4">
              {scenarioData.title}
            </h3>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-4">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {score}
              </span>
            </div>
            <p className="text-lg text-slate-700 dark:text-purple-200">
              Your Frame Control Performance
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Your Choices:
            </h4>
            {choiceHistory.map((item, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={getEffectivenessColor(item.choice.effectiveness)}>
                    {getEffectivenessIcon(item.choice.effectiveness)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white mb-1">
                      "{item.choice.text}"
                    </p>
                    <p className={`text-sm font-medium mb-2 ${getEffectivenessColor(item.choice.effectiveness)}`}>
                      {item.choice.effectiveness.charAt(0).toUpperCase() + item.choice.effectiveness.slice(1)} Response
                      {item.choice.ruleApplied && ` • Applied Rule ${item.choice.ruleApplied}`}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {item.choice.feedback}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={() => startScenario(scenarioData.id)}
              className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={resetSimulator}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Choose Another Scenario
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active scenario screen
  if (!stepData || !scenarioData) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="glass-effect rounded-3xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {scenarioData.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Practice: {scenarioData.category}
            </p>
          </div>
          <button
            onClick={resetSimulator}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Context */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Context</h3>
          <p className="text-blue-900 dark:text-blue-100">{stepData.context}</p>
        </div>

        {/* Situation */}
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Situation</h3>
          <p className="text-purple-900 dark:text-purple-100">{stepData.situation}</p>
        </div>

        {/* Character Message */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white mb-1">
                {stepData.character}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                "{stepData.characterMessage}"
              </p>
            </div>
          </div>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            How do you respond?
          </h3>
          {stepData.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => makeChoice(choice)}
              className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/70 transition-colors">
                  <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-100">
                    "{choice.text}"
                  </p>
                  {choice.ruleApplied && (
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                      Applies Rule {choice.ruleApplied}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Learning Point */}
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Learning Point
              </h4>
              <p className="text-green-900 dark:text-green-100">
                {stepData.learningPoint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;