import React from 'react';
import { ArrowRight, Play, Sparkles, Shield } from 'lucide-react';

interface ModernHeroV2Props {
  onStartAssessment: () => void;
  onExploreRules: () => void;
}

export default function ModernHeroV2({ onStartAssessment, onExploreRules }: ModernHeroV2Props) {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/90 mb-8">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Version 4.0 • Neural Framework</span>
        </div>

        {/* Main headline */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-none">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            FRAME
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ECONOMICS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
          Master the psychology of influence through behavioral economics. 
          Build unshakeable authority with scientific precision.
        </p>

        {/* Value propositions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 text-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span>10 Science-backed Principles</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/20" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-cyan-400" />
            </div>
            <span>Interactive Scenarios</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/20" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <span>Real-world Practice</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={onStartAssessment}
            className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-full hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 flex items-center gap-3"
          >
            <span>Start Neural Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onExploreRules}
            className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-3"
          >
            <Play className="w-5 h-5" />
            <span>Explore Framework</span>
          </button>
        </div>

        {/* Social proof */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm mb-6">Trusted by professionals who value ethical influence</p>
          <div className="flex items-center justify-center gap-12 opacity-60">
            <div className="text-white/60 font-semibold text-sm">Psychology Today</div>
            <div className="text-white/60 font-semibold text-sm">Harvard Business Review</div>
            <div className="text-white/60 font-semibold text-sm">Behavioral Science</div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000" />
    </section>
  );
}