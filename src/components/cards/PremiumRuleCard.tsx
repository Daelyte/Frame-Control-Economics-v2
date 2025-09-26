import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, Clock, Target, Shield } from 'lucide-react';

interface Rule {
  id: number;
  title: string;
  principle: string;
  description: string;
  test: string;
  trap: string;
  counter: string;
  keyInsight: string;
  practicalExample: string;
  icon: React.ReactNode;
}

interface PremiumRuleCardProps {
  rule: Rule;
  isCompleted: boolean;
  onMarkComplete: (id: number) => void;
}

export default function PremiumRuleCard({ rule, isCompleted, onMarkComplete }: PremiumRuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Completed indicator */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10">
          <div className="text-emerald-400">
            {rule.icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
              {rule.title}
            </h3>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">
              {rule.principle}
            </span>
          </div>
          
          <p className="text-white/70 leading-relaxed">
            {rule.description}
          </p>
        </div>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-semibold text-sm">Test Scenario</span>
          </div>
          <p className="text-white/80 text-sm">{rule.test}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-semibold text-sm">Counter Strategy</span>
          </div>
          <p className="text-white/80 text-sm">{rule.counter}</p>
        </div>
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/expand"
      >
        <span className="text-white/90 font-medium">
          {isExpanded ? 'Hide Details' : 'Show Details & Examples'}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          } group-hover/expand:text-emerald-400`} 
        />
      </button>

      {/* Expanded content */}
      <div className={`overflow-hidden transition-all duration-500 ease-out ${
        isExpanded ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
      }`}>
        <div className="space-y-6">
          {/* Key insight */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-400 font-semibold text-sm">Key Insight</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{rule.keyInsight}</p>
          </div>

          {/* Practical example */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-purple-400 font-semibold text-sm">Practical Example</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{rule.practicalExample}</p>
          </div>

          {/* Trap warning */}
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-orange-400 font-semibold text-sm">Common Trap</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{rule.trap}</p>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <button
          onClick={() => onMarkComplete(rule.id)}
          disabled={isCompleted}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25'
          }`}
        >
          {isCompleted ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Mastered</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Mark as Mastered</span>
            </div>
          )}
        </button>
      </div>

      {/* Hover glow effect */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 pointer-events-none transition-opacity duration-500" />
      )}
    </div>
  );
}