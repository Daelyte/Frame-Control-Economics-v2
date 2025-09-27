'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../../components/Navigation';

const TreasureChest = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const handleChestClick = () => {
    if (!isUnlocked) {
      // Show password input instead of just shaking
      setShowPasswordInput(true);
      setShakeTrigger(prev => prev + 1);
      
      // Generate particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }));
      setParticles(newParticles);
      
      setTimeout(() => {
        setParticles([]);
      }, 1000);
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'amy') {
      setIsUnlocked(true);
      setShowPasswordInput(false);
      // Epic unlock animation
      const unlockParticles = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }));
      setParticles(unlockParticles);
      setTimeout(() => setParticles([]), 2000);
    } else {
      setWrongPassword(true);
      setShakeTrigger(prev => prev + 1);
      setTimeout(() => setWrongPassword(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/50 via-purple-900/30 to-black relative overflow-hidden">
      {/* Aggressive Abyssal Black Waves */}
      <div className="fixed inset-0 z-0">
        {/* Main abyssal wave */}
        <motion.div
          className="absolute bottom-0 w-full"
          style={{
            height: '80%',
            background: 'radial-gradient(ellipse at bottom, #000000 0%, #0a0014 40%, transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Aggressive black tentacles rising */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`tentacle-${i}`}
            className="absolute bottom-0"
            style={{
              left: `${i * 15 - 10}%`,
              width: '200px',
              height: '100%',
              background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 40%, #000000 70%)`,
              filter: 'blur(20px)',
              transformOrigin: 'bottom'
            }}
            animate={{
              scaleY: [0.8, 1.4, 0.8],
              x: [0, 30 * Math.sin(i), 0],
              rotate: [0, 5 * Math.sin(i), 0]
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
        
        {/* White undercurrents */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`undercurrent-${i}`}
            className="absolute"
            style={{
              bottom: `${20 + i * 10}%`,
              left: '-10%',
              width: '120%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              filter: 'blur(2px)'
            }}
            animate={{
              x: ['-10%', '10%', '-10%'],
              opacity: [0.2, 0.6, 0.2],
              scaleY: [1, 2, 1]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3
            }}
          />
        ))}
        
        {/* Purple-black collision zones */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '60%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(128,0,255,0.3) 30%, rgba(0,0,0,0.95) 80%, #000000 100%)',
            mixBlendMode: 'multiply'
          }}
          animate={{
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Violent purple-black interaction */}
        <svg className="absolute bottom-0 left-0 right-0" style={{ height: '70%' }}>
          <defs>
            <filter id="turbulence">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" result="turbulence" />
              <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="20" />
            </filter>
          </defs>
          <motion.rect
            width="100%"
            height="100%"
            fill="url(#abyssGradient)"
            filter="url(#turbulence)"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="abyssGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b00ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#4b0082" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000000" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Mystical background particles */}
        <div className="absolute inset-0 opacity-30">
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
        
        {/* Abyssal vortex at bottom */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse, #000000 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      <Navigation />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* JARVIS C.I. Official Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block px-6 py-2 bg-black/90 border-2 border-cyan-400 rounded-lg"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 255, 255, 0.5)',
                  '0 0 40px rgba(0, 255, 255, 0.8)',
                  '0 0 20px rgba(0, 255, 255, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-cyan-400 text-sm font-mono mb-1">SECURE SYSTEM v2.4.1</div>
              <div
                className="text-3xl font-bold tracking-wider font-mono"
                style={{
                  textShadow: '0 0 20px rgba(0, 255, 255, 1)',
                  color: '#00ffff',
                }}
              >
                JARVIS C.I.
              </div>
              <div className="text-cyan-300 text-xs font-mono mt-1">Central Intelligence</div>
            </motion.div>
          </motion.div>
          
          {/* Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
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
                
                {/* Jarvis C.I. Text - Prominent and Official */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="text-4xl font-black tracking-wider px-8 py-3 bg-black/80 rounded border-2 border-cyan-400/60"
                    style={{
                      fontFamily: 'monospace',
                      textShadow: '0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.5)',
                      background: 'linear-gradient(135deg, #00ffff 0%, #ffffff 25%, #0088ff 50%, #ffffff 75%, #00ffff 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      backgroundSize: '200% 200%',
                      boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.2)'
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      textShadow: [
                        '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.5)',
                        '0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.7)',
                        '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.5)'
                      ]
                    }}
                    transition={{
                      backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
                      textShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    }}
                  >
                    JARVIS C.I.
                  </motion.div>
                  
                  {/* Tech circuit lines around text */}
                  <svg className="absolute inset-0 w-full h-full" style={{ width: '300px', height: '60px', left: '-75px', top: '-15px' }}>
                    <motion.path
                      d="M 10 30 L 50 30 L 55 25 L 100 25 L 105 30 L 140 30"
                      stroke="#00ffff"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.5"
                      animate={{
                        pathLength: [0, 1, 1, 0],
                        opacity: [0, 0.5, 0.5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    />
                    <motion.path
                      d="M 160 30 L 195 30 L 200 35 L 245 35 L 250 30 L 290 30"
                      stroke="#00ffff"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.5"
                      animate={{
                        pathLength: [0, 1, 1, 0],
                        opacity: [0, 0.5, 0.5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: 0.5
                      }}
                    />
                  </svg>
                  
                  {/* AI scanning effect */}
                  <motion.div
                    className="absolute inset-0 border border-cyan-400/30 rounded"
                    style={{ width: '200px', height: '40px', left: '-35px', top: '-5px' }}
                    animate={{
                      borderColor: ['rgba(0, 255, 255, 0.3)', 'rgba(0, 255, 255, 0.8)', 'rgba(0, 255, 255, 0.3)'],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                </motion.div>
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

          {/* Password Input */}
          <AnimatePresence>
            {showPasswordInput && !isUnlocked && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center space-y-4">
                  <motion.label
                    className="text-xl text-purple-300 font-semibold"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(168, 85, 247, 0.5)',
                        '0 0 20px rgba(168, 85, 247, 0.8)',
                        '0 0 10px rgba(168, 85, 247, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Enter the Secret Password:
                  </motion.label>
                  <motion.input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-6 py-3 bg-black/50 border-2 border-purple-400/50 rounded-lg text-white text-center text-xl focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-md"
                    placeholder="🔑 • • • • •"
                    autoFocus
                    whileFocus={{ scale: 1.05 }}
                  />
                  <motion.button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗝️ UNLOCK
                  </motion.button>
                  {wrongPassword && (
                    <motion.p
                      className="text-red-500 font-bold"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ❌ Wrong Password! Try Again...
                    </motion.p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Unlocked Message */}
          <AnimatePresence>
            {isUnlocked && (
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, type: 'spring' }}
              >
                <motion.h2
                  className="text-4xl font-bold mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                  animate={{
                    textShadow: [
                      '0 0 30px rgba(255, 215, 0, 0.8)',
                      '0 0 50px rgba(255, 215, 0, 1)',
                      '0 0 30px rgba(255, 215, 0, 0.8)',
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎉 CHEST UNLOCKED! 🎉
                </motion.h2>
                <motion.p
                  className="text-2xl text-yellow-300 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Welcome, Amy! The treasures are yours! 💎✨
                </motion.p>
                <motion.div
                  className="text-6xl mb-4"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1.5, repeat: Infinity }
                  }}
                >
                  💰
                </motion.div>
                <motion.p className="text-purple-300 text-lg italic">
                  "The one who holds the key holds infinite power..."
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Location Names */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Trillium Park */}
            <motion.div
              className="absolute left-10 top-32"
              initial={{ opacity: 0, x: -100 }}
              animate={{ 
                opacity: [0.3, 0.8, 0.3],
                x: [-100, 20, -100],
                y: [0, -20, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-3xl font-bold text-cyan-400/70" 
                style={{
                  textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em'
                }}>
                TRILLIUM PARK
              </div>
            </motion.div>

            {/* Ontario Place */}
            <motion.div
              className="absolute right-10 top-48"
              initial={{ opacity: 0, x: 100 }}
              animate={{ 
                opacity: [0.3, 0.9, 0.3],
                x: [100, -30, 100],
                y: [0, 30, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 0 40px rgba(168, 85, 247, 0.6)',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.15em'
                }}>
                ONTARIO PLACE
              </div>
            </motion.div>

            {/* Veld */}
            <motion.div
              className="absolute left-1/4 bottom-48"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
                x: [0, 50, 0],
                y: [0, -40, 0]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            >
              <div className="text-5xl font-black text-orange-500/80"
                style={{
                  textShadow: '0 0 50px rgba(255, 165, 0, 0.8), 0 0 100px rgba(255, 165, 0, 0.4)',
                  fontFamily: 'Impact, sans-serif',
                  letterSpacing: '0.3em',
                  transform: 'perspective(200px) rotateX(15deg)'
                }}>
                VELD
              </div>
            </motion.div>

            {/* Solaris */}
            <motion.div
              className="absolute right-1/3 bottom-32"
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ 
                opacity: [0.5, 0.95, 0.5],
                rotateY: [0, 360],
                x: [0, -60, 0],
                y: [0, 20, 0]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: 6
              }}
            >
              <div className="text-4xl font-bold bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 0 60px rgba(255, 215, 0, 0.9), 0 0 120px rgba(255, 215, 0, 0.5)',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '0.25em',
                  fontStyle: 'italic'
                }}>
                ✨ SOLARIS ✨
              </div>
            </motion.div>

            {/* Additional floating particles connecting the locations */}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={`connector-${i}`}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 200 - 100, 0],
                  y: [0, Math.random() * 200 - 100, 0],
                  opacity: [0, 0.6, 0],
                  scale: [0, 2, 0]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

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
          
          {/* Social Media Links */}
          <motion.div
            className="mt-16 flex justify-center space-x-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {/* Twitter/X */}
            <motion.a
              href="https://twitter.com/cereseve"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-black/70 to-blue-900/50 backdrop-blur-md border-2 border-blue-400/40 p-5 rounded-full group-hover:border-blue-400/80 transition-all duration-300 shadow-lg group-hover:shadow-blue-400/50">
                <svg
                  className="w-10 h-10 text-blue-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <motion.span
                className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-blue-400 text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-3 py-1 rounded-full border border-blue-400/40"
                initial={{ y: -10 }}
                whileHover={{ y: 0 }}
              >
                @cereseve
              </motion.span>
              
              {/* Floating particles around icon */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 120}deg) translateX(35px) translateY(-50%)`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.7
                    }}
                  />
                ))}
              </motion.div>
            </motion.a>
            
            {/* Instagram */}
            <motion.a
              href="https://instagram.com/j_m_f_g"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-black/70 to-purple-900/50 backdrop-blur-md border-2 border-pink-400/40 p-5 rounded-full group-hover:border-pink-400/80 transition-all duration-300 shadow-lg group-hover:shadow-pink-400/50">
                <svg
                  className="w-10 h-10 text-pink-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
              </div>
              <motion.span
                className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-pink-400 text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-3 py-1 rounded-full border border-pink-400/40"
                initial={{ y: -10 }}
                whileHover={{ y: 0 }}
              >
                @j_m_f_g
              </motion.span>
              
              {/* Rainbow ring effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, #f87171, #fbbf24, #34d399, #60a5fa, #a78bfa, #f87171)',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  opacity: 0
                }}
                whileHover={{
                  opacity: 1,
                  rotate: 360
                }}
                transition={{
                  rotate: { duration: 2, ease: "linear" },
                  opacity: { duration: 0.3 }
                }}
              />
            </motion.a>
          </motion.div>
          
          {/* Connection line between social icons */}
          <motion.svg
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ bottom: '140px', width: '200px', height: '60px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2 }}
          >
            <motion.path
              d="M 30 30 Q 100 10 170 30"
              stroke="url(#socialGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5 5"
              animate={{
                strokeDashoffset: [0, -10]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <defs>
              <linearGradient id="socialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </motion.svg>
          
          {/* Glowing divider */}
          <motion.div
            className="mt-16 w-64 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleX: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          {/* Social Media Links */}
          <motion.div
            className="mt-16 flex justify-center space-x-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {/* Twitter/X */}
            <motion.a
              href="https://twitter.com/YourHandle"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative bg-black/50 backdrop-blur-md border border-blue-400/30 p-4 rounded-full group-hover:border-blue-400/60 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <motion.span
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-blue-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                initial={{ y: -10 }}
                whileHover={{ y: 0 }}
              >
                @Daelyte
              </motion.span>
            </motion.a>
            
            {/* Instagram */}
            <motion.a
              href="https://instagram.com/YourHandle"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative bg-black/50 backdrop-blur-md border border-pink-400/30 p-4 rounded-full group-hover:border-pink-400/60 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-pink-400 group-hover:text-pink-300 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
              </div>
              <motion.span
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-pink-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                initial={{ y: -10 }}
                whileHover={{ y: 0 }}
              >
                @IceColdFroste
              </motion.span>
            </motion.a>
            
            {/* YouTube or TikTok - Optional */}
            <motion.a
              href="https://youtube.com/@YourChannel"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative bg-black/50 backdrop-blur-md border border-red-400/30 p-4 rounded-full group-hover:border-red-400/60 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-red-400 group-hover:text-red-300 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <motion.span
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                initial={{ y: -10 }}
                whileHover={{ y: 0 }}
              >
                Frame Economics
              </motion.span>
            </motion.a>
          </motion.div>
          
          {/* Glowing divider */}
          <motion.div
            className="mt-12 w-64 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleX: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
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