import React, { useEffect, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

/**
 * Floating Brand Particles - Premium background animation
 */
export const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
  }>>([]);

  useEffect(() => {
    const colors = [
      'rgba(147, 51, 234, 0.3)', // purple
      'rgba(59, 130, 246, 0.3)', // blue
      'rgba(99, 102, 241, 0.3)', // indigo
      'rgba(139, 92, 246, 0.3)', // violet
    ];

    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10 + 15,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.id * 0.5}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Premium Progress Ring Component
 */
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#8b5cf6',
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out drop-shadow-sm"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

/**
 * Premium Section Divider
 */
export const SectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center py-8 ${className}`}>
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
    </div>
    <div className="relative bg-white dark:bg-slate-900 px-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  </div>
);

/**
 * Premium Gradient Text Component
 */
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'purple' | 'blue' | 'rainbow' | 'fire';
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  gradient = 'purple'
}) => {
  const gradients = {
    purple: 'from-purple-600 via-blue-600 to-indigo-600',
    blue: 'from-blue-600 via-cyan-600 to-teal-600',
    rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
    fire: 'from-orange-500 via-red-500 to-pink-500'
  };

  return (
    <span className={`bg-gradient-to-r ${gradients[gradient]} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
};

/**
 * Interactive Feature Card
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  delay = 0
}) => (
  <div 
    className="group glass-premium rounded-2xl p-6 hover-lift card-interactive shadow-lg hover:shadow-2xl transition-all duration-500"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
      {title}
    </h3>
    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
      {description}
    </p>
  </div>
);

/**
 * Premium Stats Display
 */
interface StatsDisplayProps {
  stats: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
  }>;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat, index) => (
      <div
        key={stat.label}
        className="text-center p-4 glass-premium rounded-xl hover-lift"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
          {stat.icon}
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {stat.value}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          {stat.label}
        </div>
      </div>
    ))}
  </div>
);

/**
 * Premium Loading Spinner
 */
export const PremiumSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} relative`}>
        {/* Outer ring */}
        <div className={`${sizes[size]} rounded-full border-2 border-purple-200 dark:border-purple-800`} />
        {/* Inner spinning ring */}
        <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-transparent border-t-purple-600 border-r-purple-600 animate-spin`} />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-purple-600 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

/**
 * Brand Signature - Unique identifier
 */
export const BrandSignature: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-blue-500 animate-pulse" />
    </div>
    <div className="text-sm font-semibold">
      <GradientText gradient="purple">Frame Economics</GradientText>
    </div>
  </div>
);