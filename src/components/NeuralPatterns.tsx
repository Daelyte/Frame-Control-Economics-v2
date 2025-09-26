import React, { useState } from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp,
  Eye,
  Heart,
  Clock,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface Pattern {
  id: string;
  category: 'cognitive' | 'emotional' | 'social';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  trigger: string;
  mechanism: string;
  framePlay: string;
  example: string;
  color: string;
}

const NeuralPatterns: React.FC = () => {
  const [activePattern, setActivePattern] = useState<string | null>(null);

  const patterns: Pattern[] = [
    {
      id: 'mirror-neurons',
      category: 'cognitive',
      title: 'Mirror Neuron Sync',
      subtitle: 'Unconscious behavioral mimicry',
      icon: <Brain className="w-6 h-6" />,
      trigger: 'Observing others\' actions/emotions',
      mechanism: 'Mirror neurons fire when acting OR watching actions',
      framePlay: 'Lower your voice 20% when others escalate → their brain mirrors calm',
      example: 'In tense meetings: slower speech = slower room',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'loss-aversion',
      category: 'emotional', 
      title: 'Loss Aversion Trigger',
      subtitle: 'Losses feel 2x stronger than gains',
      icon: <Shield className="w-6 h-6" />,
      trigger: 'Potential loss or withdrawal',
      mechanism: 'Amygdala threat detection overrides logic',
      framePlay: 'Don\'t chase silence → treat withdrawal as information, not loss',
      example: 'Silent treatment: return to priorities vs. pursuing',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'anchoring-bias',
      category: 'cognitive',
      title: 'Anchoring Effect',
      subtitle: 'First impression shapes everything after',
      icon: <Target className="w-6 h-6" />,
      trigger: 'First number/emotion/frame presented',
      mechanism: 'Brain uses initial info as reference point',
      framePlay: 'Set emotional anchor first: calm voice = calm conversation',
      example: 'Negotiation: state your range first vs. reacting to theirs',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'social-proof',
      category: 'social',
      title: 'Social Proof Circuit',
      subtitle: 'Group behavior triggers conformity',
      icon: <Users className="w-6 h-6" />,
      trigger: 'Uncertain situations + group presence',
      mechanism: 'Social brain overrides individual judgment',
      framePlay: 'Public challenges: playful redirect vs. defensive explanation',
      example: 'Teasing in groups: "Tough crowd!" vs. counter-attack',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'present-bias',
      category: 'emotional',
      title: 'Present Bias Override',
      subtitle: 'Immediate rewards hijack decision-making',
      icon: <Clock className="w-6 h-6" />,
      trigger: 'Urgent demands or immediate pressures',
      mechanism: 'Dopamine system overvalues "now" vs "later"',
      framePlay: 'Expand time horizon: "Let\'s think quarterly" vs. reactive decisions',
      example: 'Urgent emails: 10-second pause → assess true priority',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'cortisol-hijack',
      category: 'emotional',
      title: 'Cortisol Narrowing', 
      subtitle: 'Stress reduces cognitive flexibility by 40%',
      icon: <Zap className="w-6 h-6" />,
      trigger: 'High-stress or confrontational situations',
      mechanism: 'Cortisol floods prefrontal cortex, narrows thinking',
      framePlay: 'Binary choice when overwhelmed: "This works or it doesn\'t"',
      example: 'Information overload: simplify to core decision points',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const categories = [
    { id: 'cognitive', label: 'Cognitive', icon: <Brain className="w-5 h-5" />, color: 'text-blue-400' },
    { id: 'emotional', label: 'Emotional', icon: <Heart className="w-5 h-5" />, color: 'text-red-400' },
    { id: 'social', label: 'Social', icon: <Users className="w-5 h-5" />, color: 'text-green-400' }
  ] as const;

  const filteredPatterns = (category?: string) => 
    category ? patterns.filter(p => p.category === category) : patterns;

  return (
    <section id="section-advanced" aria-labelledby="tab-advanced" className="max-w-6xl mx-auto animate-fade-in px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Neural Patterns
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
          The brain patterns that drive behavior. Master these to predict and influence outcomes.
        </p>
        
        {/* Category filters */}
        <div className="flex justify-center gap-2 mb-8">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2 px-4 py-2 bg-slate-800/20 border border-slate-700 rounded-lg">
              <span className={category.color}>{category.icon}</span>
              <span className="text-sm font-medium text-slate-300">{category.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className={`group cursor-pointer rounded-xl border transition-all duration-300 hover:scale-105 ${
              activePattern === pattern.id
                ? 'border-cyan-400/60 bg-slate-800/60'
                : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
            }`}
            onClick={() => setActivePattern(activePattern === pattern.id ? null : pattern.id)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${pattern.color} flex items-center justify-center text-white`}>
                  {pattern.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg leading-tight">
                    {pattern.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {pattern.subtitle}
                  </p>
                </div>
              </div>

              {/* Quick preview */}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-cyan-400 font-medium">Trigger: </span>
                  <span className="text-slate-300">{pattern.trigger}</span>
                </div>
              </div>

              {/* Expand indicator */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {activePattern === pattern.id ? 'Click to collapse' : 'Click to expand'}
                </span>
                <div className={`transition-transform duration-200 ${
                  activePattern === pattern.id ? 'rotate-90' : ''
                }`}>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {activePattern === pattern.id && (
              <div className="border-t border-slate-700 p-6 animate-slide-up">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Mechanism
                    </h4>
                    <p className="text-slate-300 text-sm">
                      {pattern.mechanism}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Frame Play
                    </h4>
                    <p className="text-slate-300 text-sm font-medium">
                      {pattern.framePlay}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Real Example
                    </h4>
                    <p className="text-slate-300 text-sm italic">
                      {pattern.example}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick tactics summary */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Neural Mastery Tactics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-cyan-300 mb-2">Recognition</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Notice the trigger pattern</li>
              <li>• Identify the brain mechanism at play</li>
              <li>• Predict the likely response</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-300 mb-2">Intervention</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Apply counter-pattern immediately</li>
              <li>• Lead the new neural state</li>
              <li>• Stay consistent until pattern shifts</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeuralPatterns;