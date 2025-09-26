import React, { useState } from 'react';
import { ModernHero } from './ModernHero';
import { ModernRuleCard, Rule } from './ModernRuleCard';
import MotionDemo from './MotionDemo';
import DragonBackdrop from './ambient/DragonPresets';
import { Clock, Shield, Target, Zap, Users, Brain } from 'lucide-react';

// Sample rules data with complete structure
const sampleRules: Rule[] = [
  {
    id: 1,
    title: "Patience Under Fire",
    principle: "Present Bias",
    description: "Humans discount the future and overreact to the present. Sudden drama feels urgent but rarely is. This cognitive bias causes people to prioritize immediate rewards over long-term benefits, leading to reactive decision-making.",
    test: "Delays, inconveniences, or last-minute emotional storms",
    trap: "Impatience—snapping or scrambling for immediacy",
    counter: "Stay calm. Don't pay 'interest' on emotional present bias.",
    keyInsight: "Present bias makes people overvalue immediate rewards and undervalue future consequences.",
    practicalExample: "Pause 10 seconds. Ask: 'Will this matter in a week?' This simple question reframes urgency.",
    icon: <Clock className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Refusing Unfair Blame",
    principle: "Framing Effect", 
    description: "Frames dictate perceived fairness. How an issue is presented shapes judgment more than the facts themselves. Those who control the frame often control the outcome of discussions.",
    test: "'You should've reminded me.' or similar blame-shifting statements",
    trap: "Defending inside their frame, accepting false premises",
    counter: "Reframe: clarify ownership without accepting false premises.",
    keyInsight: "Frames swing outcomes even with identical facts. The first frame often sticks.",
    practicalExample: "'Looks like we have different views on responsibility here.' Neutral reframe without defensiveness.",
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Silence Games",
    principle: "Loss Aversion",
    description: "Silence is misread as loss; we chase. People fear losing connection more than they value gaining it, leading to over-pursuit when others withdraw.",
    test: "Withdrawal, stonewalling, or sudden communication cutoffs",
    trap: "Over-giving to win back attention, chasing validation",
    counter: "Treat silence as neutral information; don't chase.",
    keyInsight: "Losses loom larger than gains in human psychology—we'll work harder to avoid loss than to gain equivalent value.",
    practicalExample: "Return to your priorities. Let silence inform you about their state, not control your actions.",
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Mood Swings & Emotional Pace",
    principle: "Anchoring",
    description: "First emotions anchor the entire exchange. The initial emotional tone sets expectations and influences all subsequent interactions in that conversation.",
    test: "Volatility, dramatic emotional shifts, intense opening statements",
    trap: "Mirroring the chaos, matching their emotional intensity",
    counter: "Lower your voice, slow your pace; reset the anchor.",
    keyInsight: "Arbitrary anchors still influence decisions. Emotional anchors are especially powerful.",
    practicalExample: "When they're loud, you speak quietly. When they're fast, you slow down. Deliberate tempo forces a new emotional anchor.",
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 5,
    title: "Public Pressure",
    principle: "Social Proof",
    description: "Groups follow calm confidence more than they follow anxiety. Public challenges test your frame strength when others are watching.",
    test: "Public teasing, challenges, or attempts to embarrass",
    trap: "Reacting defensively, seeking group approval",
    counter: "Maintain calm authority; groups respect composure over reactivity.",
    keyInsight: "Social proof is powerful—people look to others for behavioral cues, especially in ambiguous situations.",
    practicalExample: "Acknowledge without defending: 'Interesting perspective.' Then redirect to substance without emotional charge.",
    icon: <Users className="w-6 h-6" />
  }
];

export const ModernDemo: React.FC = () => {
  const [completedRules, setCompletedRules] = useState<Set<number>>(new Set([1, 3])); // Demo some completed rules
  const [currentView, setCurrentView] = useState<'hero' | 'rules' | 'motion'>('hero');

  const handleStartAssessment = () => {
    console.log('Starting neural assessment...');
    // Would navigate to assessment
  };

  const handleExploreRules = () => {
    setCurrentView('rules');
  };

  const handleMarkComplete = (ruleId: number) => {
    setCompletedRules(prev => new Set([...prev, ruleId]));
  };

  const completionProgress = Math.round((completedRules.size / sampleRules.length) * 100);

  return (
    <div style={{ background: 'var(--surface-0)', minHeight: '100vh' }}>
      {/* Ominous Dragon Backdrop - subtle and professional */}
      <DragonBackdrop preset="executive" />
      {/* Demo Header */}
      <header className="section-container">
        <div className="container">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--brand-600)' }}
              >
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  Frame Economics v2.0
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Modern Design System Demo
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentView('hero')}
                className={`px-4 py-2 rounded-lg font-medium transition-all focus-ring ${
                  currentView === 'hero' ? 'button-primary' : 'glass-effect hover-lift'
                }`}
                style={{
                  background: currentView === 'hero' ? 'var(--brand-600)' : 'transparent',
                  color: currentView === 'hero' ? 'white' : 'var(--text-primary)'
                }}
              >
                Hero Section
              </button>
              <button
                onClick={() => setCurrentView('rules')}
                className={`px-4 py-2 rounded-lg font-medium transition-all focus-ring ${
                  currentView === 'rules' ? 'button-primary' : 'glass-effect hover-lift'
                }`}
                style={{
                  background: currentView === 'rules' ? 'var(--brand-600)' : 'transparent',
                  color: currentView === 'rules' ? 'white' : 'var(--text-primary)'
                }}
              >
                Rule Cards
              </button>
              <button
                onClick={() => setCurrentView('motion')}
                className={`px-4 py-2 rounded-lg font-medium transition-all focus-ring ${
                  currentView === 'motion' ? 'button-primary' : 'glass-effect hover-lift'
                }`}
                style={{
                  background: currentView === 'motion' ? 'var(--brand-600)' : 'transparent',
                  color: currentView === 'motion' ? 'white' : 'var(--text-primary)'
                }}
              >
                Motion Demo
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Demo Content */}
      <main>
        {currentView === 'hero' && (
          <ModernHero
            onStartAssessment={handleStartAssessment}
            onExploreRules={handleExploreRules}
            completionProgress={completionProgress}
          />
        )}

        {currentView === 'rules' && (
          <section className="section">
            <div className="container-narrow">
              <div className="text-center mb-8">
                <h2 
                  className="font-bold mb-4"
                  style={{ 
                    fontSize: 'var(--fs-800)',
                    color: 'var(--text-primary)'
                  }}
                >
                  The Rules of Frame Economics
                </h2>
                <p 
                  className="leading-relaxed"
                  style={{ 
                    fontSize: 'var(--fs-500)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Interactive cards with container-driven layouts and OKLCH color system.
                  Each rule combines behavioral psychology with practical tactics.
                </p>
                
                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-4 mt-6 glass-effect rounded-xl p-4 inline-flex">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="color-mix(in oklab, var(--neutral-300) 50%, transparent)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="var(--success-500)"
                        strokeWidth="4"
                        strokeDasharray={`${completionProgress * 1.759} 175.9`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {completionProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {completedRules.size} of {sampleRules.length} Rules Mastered
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Container queries adapt layout to card width
                    </div>
                  </div>
                </div>
              </div>

              {/* Rule Cards Grid */}
              <div className="card-grid-container">
                <div className="space-y-6">
                  {sampleRules.map(rule => (
                    <ModernRuleCard
                      key={rule.id}
                      rule={rule}
                      isCompleted={completedRules.has(rule.id)}
                      onMarkComplete={handleMarkComplete}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {currentView === 'motion' && (
          <MotionDemo />
        )}
      </main>

      {/* Demo Footer */}
      <footer className="section" style={{ borderTop: '1px solid color-mix(in oklab, var(--neutral-200) 30%, transparent)' }}>
        <div className="container text-center">
          <div className="glass-effect rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              🎨 Modern Design System Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold mb-2" style={{ color: 'var(--brand-600)' }}>
                  OKLCH Colors
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Perceptually uniform colors for consistent contrast across all hues and displays
                </p>
              </div>
              <div className="text-center">
                <div className="font-semibold mb-2" style={{ color: 'var(--accent-600)' }}>
                  Container Queries
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Components adapt to their container size, not just viewport width
                </p>
              </div>
              <div className="text-center">
                <div className="font-semibold mb-2" style={{ color: 'var(--success-600)' }}>
                  Optimized Motion
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Smooth, accessible animations that respect user preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernDemo;