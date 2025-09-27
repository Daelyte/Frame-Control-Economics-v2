import React from 'react';
import { Brain, Target, Shield, ArrowRight, BarChart3 } from 'lucide-react';

interface ModernHeroProps {
  onStartAssessment: () => void;
  onExploreRules: () => void;
  completionProgress?: number;
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  onStartAssessment,
  onExploreRules,
  completionProgress = 0
}) => {
  return (
    <section className="hero-container section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="animate-stagger">
              {/* Brand mark */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center glass-effect"
                  style={{
                    background: 'var(--brand-600)',
                    boxShadow: '0 0 24px color-mix(in oklab, var(--brand-500) 40%, transparent)'
                  }}
                >
                  <span className="text-xl">🐉</span>
                </div>
                <div className="text-sm font-mono px-3 py-1 rounded-full glass-effect">
                  <span style={{ color: 'var(--brand-600)' }}>v4.0 • NEURAL</span>
                </div>
              </div>

              {/* Main headline */}
              <h1 className="hero-title font-black leading-tight tracking-tight mb-6">
                <span 
                  className="block mb-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--brand-600) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  FRAME
                </span>
                <span 
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--accent-500) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  ECONOMICS
                </span>
              </h1>

              {/* Subtitle */}
              <p 
                className="text-lg mb-8 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Master the hidden psychology of influence through behavioral economics and frame control. 
                Build unshakeable authority rooted in your values.
              </p>

              {/* Value propositions */}
              <div className="grid gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--brand-500)' }}
                  >
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    10 science-backed behavioral principles
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--accent-500)' }}
                  >
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Interactive scenarios with real-world practice
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--success-500)' }}
                  >
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Ethical influence that builds authentic confidence
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={onStartAssessment}
                  className="button-primary hover-lift button-press focus-ring px-6 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 min-h-[44px]"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-500) 100%)'
                  }}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Neural Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={onExploreRules}
                  className="hover-lift button-press focus-ring px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 glass-effect min-h-[44px]"
                  style={{
                    color: 'var(--text-primary)',
                    border: '1px solid color-mix(in oklab, var(--brand-500) 30%, transparent)'
                  }}
                >
                  <Target className="w-5 h-5" />
                  <span>Explore Rules</span>
                </button>
              </div>

              {/* Progress indicator */}
              {completionProgress > 0 && (
                <div className="glass-effect rounded-xl p-4 animate-scale-in">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      {/* Progress ring */}
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="color-mix(in oklab, var(--neutral-300) 50%, transparent)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="var(--success-500)"
                          strokeWidth="4"
                          strokeDasharray={`${completionProgress * 1.257} 125.7`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {completionProgress}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Progress Saved
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Continue your mastery journey
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visual element */}
          <div className="hero-visual hidden lg:block">
            <div className="relative">
              {/* Neural network visualization */}
              <div className="relative w-80 h-80">
                <svg
                  viewBox="0 0 320 320"
                  className="w-full h-full animate-pulse-subtle"
                  style={{ filter: 'drop-shadow(0 0 24px color-mix(in oklab, var(--brand-500) 30%, transparent))' }}
                >
                  {/* Neural nodes */}
                  <g fill="var(--brand-500)" opacity="0.8">
                    <circle cx="160" cy="60" r="8" className="animate-bounce-subtle" />
                    <circle cx="80" cy="120" r="6" className="animate-bounce-subtle" style={{ animationDelay: '0.5s' }} />
                    <circle cx="240" cy="120" r="6" className="animate-bounce-subtle" style={{ animationDelay: '1s' }} />
                    <circle cx="40" cy="200" r="5" className="animate-bounce-subtle" style={{ animationDelay: '1.5s' }} />
                    <circle cx="160" cy="200" r="8" className="animate-bounce-subtle" style={{ animationDelay: '2s' }} />
                    <circle cx="280" cy="200" r="5" className="animate-bounce-subtle" style={{ animationDelay: '0.3s' }} />
                    <circle cx="160" cy="260" r="6" className="animate-bounce-subtle" style={{ animationDelay: '0.8s' }} />
                  </g>
                  
                  {/* Neural connections */}
                  <g stroke="var(--brand-400)" strokeWidth="2" opacity="0.6" fill="none">
                    <line x1="160" y1="60" x2="80" y2="120" />
                    <line x1="160" y1="60" x2="240" y2="120" />
                    <line x1="80" y1="120" x2="40" y2="200" />
                    <line x1="80" y1="120" x2="160" y2="200" />
                    <line x1="240" y1="120" x2="160" y2="200" />
                    <line x1="240" y1="120" x2="280" y2="200" />
                    <line x1="40" y1="200" x2="160" y2="260" />
                    <line x1="160" y1="200" x2="160" y2="260" />
                    <line x1="280" y1="200" x2="160" y2="260" />
                  </g>
                </svg>

                {/* Floating psychology concepts */}
                <div className="absolute top-0 right-0 glass-effect rounded-lg px-3 py-2 animate-slide-left">
                  <div className="text-xs font-semibold" style={{ color: 'var(--brand-600)' }}>
                    Anchoring Bias
                  </div>
                </div>
                <div className="absolute left-0 top-1/3 glass-effect rounded-lg px-3 py-2 animate-slide-right" style={{ animationDelay: '0.5s' }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--accent-600)' }}>
                    Loss Aversion
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/3 glass-effect rounded-lg px-3 py-2 animate-slide-up" style={{ animationDelay: '1s' }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--success-600)' }}>
                    Social Proof
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle tagline */}
        <div className="text-center mt-8 pt-8" style={{ borderTop: '1px solid color-mix(in oklab, var(--neutral-200) 30%, transparent)' }}>
          <p className="text-sm font-light tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Calm beats chaos • Clarity beats pressure • Consent beats manipulation
          </p>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;