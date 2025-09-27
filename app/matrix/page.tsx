'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../../components/Navigation';

const MatrixTrainingModule = ({ title, description, progress, isActive, onClick, icon }: {
  title: string;
  description: string;
  progress: number;
  isActive: boolean;
  onClick: () => void;
  icon: string;
}) => (
  <motion.div
    className={`relative p-6 rounded-xl backdrop-blur-md border cursor-pointer overflow-hidden ${
      isActive ? 'border-green-400/60 bg-green-400/10' : 'border-green-400/20 bg-black/30'
    }`}
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    {/* Progress bar */}
    <div className="absolute top-0 left-0 h-1 bg-green-400/20 w-full">
      <motion.div 
        className="h-full bg-green-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
    
    {/* Matrix rain effect when active */}
    {isActive && (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-px font-mono text-xs text-green-400/30"
            style={{ left: `${10 + i * 12}%`, top: '-20px' }}
            animate={{ y: [0, 200] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: 'linear' }}
          >
            {['0', '1', '0', '1'].map((char, idx) => (
              <div key={idx}>{char}</div>
            ))}
          </motion.div>
        ))}
      </div>
    )}
    
    <div className="relative z-10">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-green-400 mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-green-400 text-sm">Progress: {progress}%</span>
        <motion.div
          className="px-3 py-1 bg-green-400/20 rounded text-green-400 text-xs"
          whileHover={{ bg: 'rgba(34, 197, 94, 0.3)' }}
        >
          {isActive ? 'ACTIVE' : 'ENTER'}
        </motion.div>
      </div>
    </div>
  </motion.div>
);

const PsychProfileCard = ({ metric, value, change, icon }: {
  metric: string;
  value: number;
  change: number;
  icon: string;
}) => (
  <div className="bg-black/40 border border-green-400/20 rounded-lg p-4 backdrop-blur-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      <motion.span 
        className={`text-sm px-2 py-1 rounded ${change >= 0 ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'}`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {change >= 0 ? '+' : ''}{change}%
      </motion.span>
    </div>
    <h4 className="text-green-400 text-sm font-semibold mb-1">{metric}</h4>
    <motion.div 
      className="text-2xl font-bold text-white"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {value}
    </motion.div>
  </div>
);

export default function MatrixTrainingPage() {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState({
    influence: 78,
    perception: 85,
    persuasion: 72,
    psychology: 91
  });
  
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> NEURAL_INTERFACE_LOADED...',
    '> PSYCHOLOGICAL_PROFILE_SCANNED...',
    '> MATRIX_TRAINING_PROTOCOLS_ACTIVE...',
    '> AWAITING_USER_INPUT...'
  ]);

  const modules = [
    {
      title: 'Neural Anchoring',
      description: 'Master the art of embedding psychological anchors in conversation. Learn to create instant emotional connections.',
      progress: 65,
      icon: '🧠'
    },
    {
      title: 'Reality Distortion Field',
      description: 'Bend perception to your advantage. Advanced techniques for shifting mental frameworks in real-time.',
      progress: 40,
      icon: '🌀'
    },
    {
      title: 'Cognitive Calibration', 
      description: 'Read micro-expressions, vocal patterns, and unconscious signals. Become a human lie detector.',
      progress: 78,
      icon: '👁️'
    },
    {
      title: 'Influence Architecture',
      description: 'Build systematic persuasion sequences. Engineer behavioral change through strategic frame control.',
      progress: 25,
      icon: '🏗️'
    },
    {
      title: 'Emotional Manipulation',
      description: 'Ethical influence through emotional intelligence. Navigate and guide emotional states responsibly.',
      progress: 55,
      icon: '❤️'
    },
    {
      title: 'Social Dynamics Matrix',
      description: 'Decode group psychology and social hierarchies. Become the invisible conductor of social interactions.',
      progress: 30,
      icon: '🕸️'
    }
  ];

  const handleModuleClick = useCallback((index: number) => {
    setActiveModule(activeModule === index ? null : index);
    
    const newOutput = [
      ...terminalOutput,
      `> MODULE_${index + 1}_ACTIVATED...`,
      `> SCANNING_NEURAL_PATTERNS...`,
      `> PSYCHOLOGICAL_BASELINE_ESTABLISHED...`,
      `> TRAINING_SEQUENCE_INITIATED...`
    ].slice(-12); // Keep only last 12 lines
    
    setTerminalOutput(newOutput);
  }, [activeModule, terminalOutput]);

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Matrix background */}
      <div className="fixed inset-0 opacity-10">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-px font-mono text-xs"
            style={{ left: `${i * 5}%`, top: '-50px' }}
            animate={{ y: [0, window.innerHeight + 50] }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity, 
              delay: i * 0.1,
              ease: 'linear' 
            }}
          >
            {Array.from({ length: 20 }, (_, j) => (
              <div key={j} className="leading-tight">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <Navigation />
      
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl font-bold mb-4 font-mono"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(34, 197, 94, 0.5)',
                  '0 0 20px rgba(34, 197, 94, 0.8)',
                  '0 0 10px rgba(34, 197, 94, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              THE_MATRIX.exe
            </motion.h1>
            <p className="text-xl text-green-300">
              PSYCHOLOGICAL_WARFARE_TRAINING_PROTOCOLS
            </p>
            <motion.div 
              className="w-2 h-6 bg-green-400 inline-block ml-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Training modules */}
            <div className="lg:col-span-2">
              <motion.h2 
                className="text-2xl font-bold mb-6 font-mono"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                &gt; TRAINING_MODULES
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module, index) => (
                  <MatrixTrainingModule
                    key={index}
                    {...module}
                    isActive={activeModule === index}
                    onClick={() => handleModuleClick(index)}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* User profile */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold mb-4 font-mono">&gt; PSYCH_PROFILE</h3>
                <div className="space-y-4">
                  <PsychProfileCard
                    metric="Influence Level"
                    value={userProfile.influence}
                    change={12}
                    icon="🎯"
                  />
                  <PsychProfileCard
                    metric="Perception Control"
                    value={userProfile.perception}
                    change={8}
                    icon="👁️"
                  />
                  <PsychProfileCard
                    metric="Persuasion Power"
                    value={userProfile.persuasion}
                    change={-3}
                    icon="💬"
                  />
                  <PsychProfileCard
                    metric="Psychological Insight"
                    value={userProfile.psychology}
                    change={15}
                    icon="🧠"
                  />
                </div>
              </motion.div>

              {/* Terminal */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-black border border-green-400/40 rounded-lg p-4 font-mono text-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-400">NEURAL_TERMINAL_v2.1</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {terminalOutput.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="text-green-300"
                    >
                      {line}
                    </motion.div>
                  ))}
                  <motion.div
                    className="text-green-400"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    &gt; _
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}