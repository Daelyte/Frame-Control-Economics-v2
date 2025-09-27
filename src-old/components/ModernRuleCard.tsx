import React, { useState } from 'react';
import { ChevronDown, CheckCircle, AlertTriangle, Target, Shield, Brain, Lightbulb } from 'lucide-react';

export interface Rule {
  id: number;
  title: string;
  principle: string;
  description: string;
  test: string;
  trap: string;
  counter: string;
  keyInsight: string;
  practicalExample: string;
  icon?: React.ReactNode;
}

interface ModernRuleCardProps {
  rule: Rule;
  isCompleted?: boolean;
  onMarkComplete?: (id: number) => void;
}

export const ModernRuleCard: React.FC<ModernRuleCardProps> = ({
  rule,
  isCompleted = false,
  onMarkComplete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkComplete = () => {
    if (!isCompleted && onMarkComplete) {
      onMarkComplete(rule.id);
    }
  };

  return (
    <div className="content-container">
      <article 
        className={`
          rule-card card-hover glass-effect transition-all duration-300
          ${isCompleted ? 'ring-2 ring-success-500/40' : ''}
        `}
        style={{
          background: isCompleted 
            ? 'color-mix(in oklab, var(--success-50) 20%, var(--surface-1))' 
            : 'var(--surface-1)'
        }}
      >
        {/* Card Header - Always Visible */}
        <button
          onClick={handleToggle}
          className="w-full text-left focus-ring rounded-xl p-1 -m-1"
          aria-expanded={isExpanded}
          aria-controls={`rule-content-${rule.id}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Icon */}
              <div 
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  transition-all duration-200
                  ${isCompleted ? 'bg-success-500' : 'bg-brand-600'}
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  rule.icon || <Brain className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Title and Principle */}
              <div className="min-w-0 flex-1">
                <h3 
                  className="font-semibold leading-snug mb-1"
                  style={{ 
                    fontSize: 'var(--fs-600)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Rule {rule.id}: {rule.title}
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <strong>Principle:</strong> {rule.principle}
                </p>
              </div>
            </div>

            {/* Status and Toggle */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {isCompleted && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'var(--success-100)',
                    color: 'var(--success-700)'
                  }}
                >
                  Mastered
                </span>
              )}
              
              <div 
                className={`
                  transition-transform duration-200 text-brand-600
                  ${isExpanded ? 'rotate-180' : ''}
                `}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        <div 
          id={`rule-content-${rule.id}`}
          className={`
            accordion-panel transition-all duration-300 ease-smooth
            ${isExpanded ? 'mt-6' : 'is-collapsed'}
          `}
          style={{
            maxHeight: isExpanded ? '800px' : '0',
            overflow: 'hidden'
          }}
        >
          {/* Description */}
          <div className="mb-6">
            <h4 
              className="font-semibold mb-3"
              style={{ 
                color: 'var(--text-primary)',
                fontSize: 'var(--fs-500)'
              }}
            >
              Understanding the Psychology
            </h4>
            <p 
              className="leading-relaxed"
              style={{ 
                color: 'var(--text-secondary)',
                fontSize: 'var(--fs-400)'
              }}
            >
              {rule.description}
            </p>
          </div>

          {/* Rule Details Grid */}
          <div className="rule-details mb-6">
            {/* Test */}
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: 'color-mix(in oklab, var(--danger-50) 50%, transparent)',
                border: '1px solid color-mix(in oklab, var(--danger-200) 60%, transparent)'
              }}
            >
              <h5 
                className="flex items-center gap-2 font-semibold text-sm mb-2"
                style={{ color: 'var(--danger-700)' }}
              >
                <Target className="w-4 h-4" />
                The Test
              </h5>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--danger-800)' }}
              >
                {rule.test}
              </p>
            </div>

            {/* Trap */}
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: 'color-mix(in oklab, var(--warning-50) 50%, transparent)',
                border: '1px solid color-mix(in oklab, var(--warning-200) 60%, transparent)'
              }}
            >
              <h5 
                className="flex items-center gap-2 font-semibold text-sm mb-2"
                style={{ color: 'var(--warning-700)' }}
              >
                <AlertTriangle className="w-4 h-4" />
                The Trap
              </h5>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--warning-800)' }}
              >
                {rule.trap}
              </p>
            </div>

            {/* Counter-Move */}
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: 'color-mix(in oklab, var(--success-50) 50%, transparent)',
                border: '1px solid color-mix(in oklab, var(--success-200) 60%, transparent)'
              }}
            >
              <h5 
                className="flex items-center gap-2 font-semibold text-sm mb-2"
                style={{ color: 'var(--success-700)' }}
              >
                <Shield className="w-4 h-4" />
                Counter-Move
              </h5>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--success-800)' }}
              >
                {rule.counter}
              </p>
            </div>

            {/* Key Insight */}
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: 'color-mix(in oklab, var(--brand-50) 50%, transparent)',
                border: '1px solid color-mix(in oklab, var(--brand-200) 60%, transparent)'
              }}
            >
              <h5 
                className="flex items-center gap-2 font-semibold text-sm mb-2"
                style={{ color: 'var(--brand-700)' }}
              >
                <Brain className="w-4 h-4" />
                Key Insight
              </h5>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--brand-800)' }}
              >
                {rule.keyInsight}
              </p>
            </div>

            {/* Practical Example */}
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: 'color-mix(in oklab, var(--accent-50) 50%, transparent)',
                border: '1px solid color-mix(in oklab, var(--accent-200) 60%, transparent)'
              }}
            >
              <h5 
                className="flex items-center gap-2 font-semibold text-sm mb-2"
                style={{ color: 'var(--accent-700)' }}
              >
                <Lightbulb className="w-4 h-4" />
                In Practice
              </h5>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--accent-800)' }}
              >
                {rule.practicalExample}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={handleMarkComplete}
              disabled={isCompleted}
              className={`
                px-6 py-3 rounded-xl font-semibold flex items-center gap-2
                transition-all duration-200 min-h-[44px] focus-ring
                ${isCompleted 
                  ? 'cursor-not-allowed opacity-75' 
                  : 'hover-lift button-press'
                }
              `}
              style={{
                background: isCompleted 
                  ? 'var(--success-500)' 
                  : 'var(--brand-600)',
                color: 'white'
              }}
            >
              <CheckCircle className="w-4 h-4" />
              {isCompleted ? 'Mastered!' : 'Mark as Understood'}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ModernRuleCard;