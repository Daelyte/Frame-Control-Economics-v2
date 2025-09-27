'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';

const TreasureChest = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleChestClick = () => {
    // Trigger shake animation
    setShakeTrigger(prev => prev + 1);
    setShowMessage(true);
    
    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);
    
    setTimeout(() => {
      setShowMessage(false);
      setParticles([]);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Mystical background particles */}
      <div className="fixed inset-0 opacity-30">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <Navigation />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #ff8c00 50%, #ffd700 75%, #ffed4e 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
            }}
          >
            The Forbidden Vault
          </motion.h1>

          <motion.p
            className="text-xl text-purple-300 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Only those who possess the key may unlock the secrets within...
          </motion.p>

          {/* Treasure Chest Container */}
          <motion.div
            className="relative inline-block"
            animate={{
              rotate: shakeTrigger > 0 ? [0, -2, 2, -2, 2, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            }}
          >
            {/* Chest Shadow */}
            <div className="absolute inset-0 top-4 bg-black/50 rounded-lg blur-xl transform scale-110" />

            {/* Main Chest */}
            <motion.div
              className="relative w-80 h-64 cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleChestClick}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Chest Base */}
              <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-lg border-4 border-amber-900">
                {/* Wood grain texture */}
                <div className="absolute inset-0 opacity-30">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-px bg-amber-950"
                      style={{ top: `${i * 12.5}%` }}
                    />
                  ))}
                </div>

                {/* Metal reinforcements */}
                <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded" />
                <div className="absolute bottom-2 left-2 right-2 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded" />
              </div>

              {/* Chest Lid */}
              <motion.div
                className="absolute top-0 w-full h-32 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-t-3xl border-4 border-amber-900"
                style={{
                  transformOrigin: 'bottom center',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateX: isHovered ? -10 : 0,
                }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {/* Lid decorations */}
                <div className="absolute inset-x-4 top-4 h-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded" />
                <div className="absolute inset-x-8 bottom-4 h-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded" />
              </motion.div>

              {/* Giant Lock */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                animate={{
                  scale: isHovered ? [1, 1.1, 1] : 1,
                  rotate: isHovered ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 1,
                }}
              >
                {/* Lock body */}
                <div className="relative">
                  <div className="w-24 h-28 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-lg border-2 border-gray-600">
                    {/* Keyhole */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-black rounded-full" />
                      <div className="w-2 h-6 bg-black mx-auto -mt-1" />
                    </div>
                    
                    {/* Lock shine */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-lg"
                      animate={{
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </div>

                  {/* Lock shackle */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-16 border-8 border-gray-700 rounded-t-full border-b-0" />
                </div>

                {/* Glowing effect when hovered */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 -m-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.2 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-32 h-36 bg-red-500/30 rounded-full blur-2xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Chains */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
              >
                <motion.path
                  d="M 40 120 Q 160 80 280 120"
                  stroke="url(#chainGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  animate={{
                    d: isHovered
                      ? ['M 40 120 Q 160 80 280 120', 'M 40 120 Q 160 75 280 120', 'M 40 120 Q 160 80 280 120']
                      : 'M 40 120 Q 160 80 280 120',
                  }}
                  transition={{
                    duration: 1,
                    repeat: isHovered ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                />
                <defs>
                  <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6b7280" />
                    <stop offset="50%" stopColor="#9ca3af" />
                    <stop offset="100%" stopColor="#6b7280" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Sparkles around the chest */}
              <AnimatePresence>
                {isHovered && (
                  <>
                    {Array.from({ length: 6 }, (_, i) => (
                      <motion.div
                        key={`sparkle-${i}`}
                        className="absolute w-2 h-2"
                        style={{
                          left: `${20 + i * 12}%`,
                          top: `${30 + (i % 2) * 40}%`,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      >
                        <div className="w-full h-full bg-yellow-400 rotate-45" />
                        <div className="absolute inset-0 bg-yellow-400" style={{ transform: 'rotate(45deg)' }} />
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Impact particles when clicked */}
            <AnimatePresence>
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 bg-red-500 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Message when clicked */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.p
                  className="text-2xl font-bold text-red-500"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(239, 68, 68, 0.5)',
                      '0 0 20px rgba(239, 68, 68, 0.8)',
                      '0 0 10px rgba(239, 68, 68, 0.5)',
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔒 ACCESS DENIED 🔒
                </motion.p>
                <p className="text-lg text-purple-300 mt-2">
                  The ancient lock remains sealed. Only the worthy may enter...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mysterious hint */}
          <motion.div
            className="mt-12 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="text-sm italic">
              "Those who seek the key must first master the frames of reality..."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Add CSS animation for gradient */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default TreasureChest;