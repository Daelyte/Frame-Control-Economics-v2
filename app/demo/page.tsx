'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../../components/Navigation';

const InteractiveDemonstration = ({ title, description, demoType, isActive, onClick }: {
  title: string;
  description: string;
  demoType: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.div
    className={`relative p-6 rounded-xl backdrop-blur-md border cursor-pointer transition-all duration-300 ${
      isActive 
        ? 'border-orange-400/60 bg-orange-400/10 shadow-lg shadow-orange-400/20' 
        : 'border-orange-400/20 bg-black/30 hover:border-orange-400/40'
    }`}
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-orange-400">{title}</h3>
        <motion.div
          className="px-3 py-1 bg-orange-400/20 rounded text-orange-300 text-xs uppercase"
          animate={isActive ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {demoType}
        </motion.div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-4">{description}</p>
      <motion.button
        className="text-orange-400 text-sm font-semibold"
        whileHover={{ x: 5 }}
      >
        {isActive ? 'RUNNING →' : 'START DEMO →'}
      </motion.button>
    </div>
    
    {/* Active indicator */}
    {isActive && (
      <motion.div
        className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    )}
  </motion.div>
);

const PsychTechnique = ({ technique, example, effectiveness }: {
  technique: string;
  example: string;
  effectiveness: number;
}) => (
  <motion.div
    className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-400/30 rounded-lg p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-orange-400 font-semibold">{technique}</h4>
      <div className="flex items-center space-x-2">
        <div className="w-20 h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${effectiveness}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <span className="text-orange-300 text-sm">{effectiveness}%</span>
      </div>
    </div>
    <p className="text-gray-300 text-sm italic">&quot;{example}&quot;</p>
  </motion.div>
);

const RealtimeInfluenceAnalyzer = () => {
  const [analysisData, setAnalysisData] = useState({
    confidence: 78,
    persuasion: 65,
    authority: 89,
    rapport: 72
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisData(prev => ({
        confidence: Math.max(20, Math.min(100, prev.confidence + (Math.random() - 0.5) * 10)),
        persuasion: Math.max(20, Math.min(100, prev.persuasion + (Math.random() - 0.5) * 8)),
        authority: Math.max(20, Math.min(100, prev.authority + (Math.random() - 0.5) * 6)),
        rapport: Math.max(20, Math.min(100, prev.rapport + (Math.random() - 0.5) * 12))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 border border-orange-400/30 rounded-lg p-6">
      <h3 className="text-xl font-bold text-orange-400 mb-4">🧠 Real-time Influence Analysis</h3>
      
      <div className="space-y-4">
        {Object.entries(analysisData).map(([metric, value]) => (
          <div key={metric} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 capitalize">{metric}</span>
              <motion.span 
                className="text-orange-400 font-mono text-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {value}%
              </motion.span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                animate={{ width: `${value}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <motion.div
        className="mt-4 p-3 bg-orange-400/10 rounded border border-orange-400/20"
        animate={{ boxShadow: ['0 0 0px rgba(255, 165, 0, 0)', '0 0 20px rgba(255, 165, 0, 0.3)', '0 0 0px rgba(255, 165, 0, 0)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="text-orange-300 text-sm">
          💡 <strong>AI Insight:</strong> Increasing authority markers while maintaining rapport. 
          Subject shows high receptivity to frame adjustments.
        </p>
      </motion.div>
    </div>
  );
};

export default function ExperienceDemoPage() {
  const [activeDemoIndex, setActiveDemoIndex] = useState<number | null>(null);
  const [conversationStep, setConversationStep] = useState(0);

  const demonstrations = [
    {
      title: 'Anchoring Bias Manipulation',
      description: 'Watch how initial information shapes all subsequent judgments, even when irrelevant.',
      demoType: 'Cognitive'
    },
    {
      title: 'Social Proof Engineering', 
      description: 'See how perceived consensus drives individual decision-making in real-time.',
      demoType: 'Social'
    },
    {
      title: 'Scarcity Illusion Creation',
      description: 'Observe how artificial limitations increase perceived value and urgency.',
      demoType: 'Behavioral'
    },
    {
      title: 'Authority Halo Effect',
      description: 'Experience how expertise in one area creates credibility in unrelated domains.',
      demoType: 'Persuasion'
    },
    {
      title: 'Reciprocity Loop Activation',
      description: 'Learn how small favors create disproportionate obligation and compliance.',
      demoType: 'Exchange'
    },
    {
      title: 'Consistency Trap Formation',
      description: 'See how small commitments lead to larger behavioral changes automatically.',
      demoType: 'Commitment'
    }
  ];

  const psychTechniques = [
    {
      technique: 'Mirroring & Matching',
      example: 'Subtly copying their posture and speech patterns to build unconscious rapport',
      effectiveness: 85
    },
    {
      technique: 'Embedded Commands',
      example: 'You might find yourself considering this option more seriously than others',
      effectiveness: 72
    },
    {
      technique: 'False Time Constraints',
      example: 'This opportunity is only available until the end of the month',
      effectiveness: 91
    },
    {
      technique: 'Social Proof Stacking',
      example: 'Over 10,000 business leaders have already implemented this strategy',
      effectiveness: 88
    }
  ];

  const conversationFlow = [
    {
      speaker: 'Subject',
      text: "I'm not really interested in this product...",
      analysis: 'Initial resistance detected. Defensive frame active.'
    },
    {
      speaker: 'Influencer',
      text: "I completely understand. Most successful people I work with said the exact same thing initially.",
      analysis: 'Authority positioning + Social proof + Reframe resistance as common trait of success.'
    },
    {
      speaker: 'Subject',
      text: "Well... I mean, I am pretty successful in my field...",
      analysis: 'Identity anchor activated. Subject aligning with successful group.'
    },
    {
      speaker: 'Influencer', 
      text: "I can tell. That's exactly why this might actually be perfect for you. Can I ask you just one quick question?",
      analysis: 'Validation + Scarcity (perfect for YOU) + Commitment trap (just one question).'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-orange-950/20 to-black text-white relative overflow-hidden">
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <Navigation />
      
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl font-bold mb-4"
              style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffdd44 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              EXPERIENCE DEMO
            </motion.h1>
            <p className="text-xl text-orange-200 mb-6">
              Interactive Frame Control & Psychological Influence Laboratory
            </p>
            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Demonstrations */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-orange-400 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  🎭 Interactive Demonstrations
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {demonstrations.map((demo, index) => (
                    <InteractiveDemonstration
                      key={index}
                      {...demo}
                      isActive={activeDemoIndex === index}
                      onClick={() => setActiveDemoIndex(activeDemoIndex === index ? null : index)}
                    />
                  ))}
                </div>
              </div>

              {/* Conversation Analysis */}
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-orange-400 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  💬 Live Conversation Analysis
                </motion.h2>
                
                <div className="bg-black/40 border border-orange-400/30 rounded-lg p-6">
                  <div className="space-y-4 mb-6">
                    <AnimatePresence>
                      {conversationFlow.slice(0, conversationStep + 1).map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: message.speaker === 'Subject' ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.3 }}
                          className={`flex ${message.speaker === 'Subject' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-xs p-4 rounded-lg ${
                            message.speaker === 'Subject' 
                              ? 'bg-gray-800 text-gray-300' 
                              : 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                          }`}>
                            <div className="font-semibold text-sm mb-1">{message.speaker}</div>
                            <div className="mb-2">{message.text}</div>
                            <div className="text-xs opacity-80 italic">
                              🧠 {message.analysis}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  <motion.button
                    className="w-full py-3 bg-orange-400/20 border border-orange-400/40 rounded-lg text-orange-400 font-semibold hover:bg-orange-400/30 transition-colors"
                    onClick={() => setConversationStep((prev) => (prev + 1) % conversationFlow.length)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {conversationStep < conversationFlow.length - 1 ? 'Continue Conversation →' : 'Restart Analysis'}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Real-time Analysis */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <RealtimeInfluenceAnalyzer />
              </motion.div>

              {/* Psychology Techniques */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h3 className="text-xl font-bold text-orange-400 mb-4">⚡ Active Techniques</h3>
                <div className="space-y-4">
                  {psychTechniques.map((technique, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    >
                      <PsychTechnique {...technique} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Effectiveness Meter */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-black/40 border border-orange-400/30 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-orange-400 mb-4">📊 Session Effectiveness</h3>
                <div className="text-center">
                  <motion.div
                    className="text-5xl font-bold text-orange-400 mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    87%
                  </motion.div>
                  <p className="text-gray-300 text-sm">Overall Influence Success Rate</p>
                  <div className="mt-4 p-3 bg-green-400/10 border border-green-400/20 rounded">
                    <p className="text-green-400 text-xs">
                      🎯 Exceptional performance! Target showing high compliance indicators.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}