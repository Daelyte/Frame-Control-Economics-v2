// components/HeroWithMotifs.tsx
'use client'
import React, { Suspense, useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerformanceMonitor } from '@react-three/drei'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { detectDeviceTier } from '../lib/dragonAssets'

// Dynamic imports for signature motifs
const NeuralOrb = dynamic(() => import('./NeuralOrb'), { ssr: false })
const FrameShard = dynamic(() => import('./FrameShard'), { ssr: false })
const CrystalPrisms = dynamic(() => import('./CrystalPrisms'), { ssr: false })
const CSSFrameShards = dynamic(() => import('./FrameShard').then(mod => mod.CSSFrameShards), { ssr: false })
const CSSCrystalPrisms = dynamic(() => import('./CrystalPrisms').then(mod => mod.CSSCrystalPrisms), { ssr: false })

interface HeroWithMotifsProps {
  className?: string;
  id?: string;
}

export default function HeroWithMotifs({ className = '', id }: HeroWithMotifsProps) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Transform values based on scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -50])

  // Performance and loading states
  const [ready, setReady] = useState(false)
  const [use3D, setUse3D] = useState(true)
  const [deviceTier, setDeviceTier] = useState<'low' | 'medium' | 'high'>('medium')
  useEffect(() => {
    const tier = detectDeviceTier()
    setDeviceTier(tier)
    setUse3D(tier !== 'low')
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as any).connection?.saveData
    
    if (prefersReducedMotion || saveData) {
      setUse3D(false)
    }
    
    // Ready Canvas after idle
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true))
      : window.setTimeout(() => setReady(true), 200)
      
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as any)
      else clearTimeout(id as any)
    }
  }, [])

  // CSS fallback for low-end devices
  if (!use3D) {
    return (
      <section 
        ref={containerRef} 
        id={id} 
        className={`relative w-full h-screen overflow-hidden ${className}`}
        style={{ background: 'linear-gradient(135deg, var(--color-bg-dark) 0%, var(--color-bg-section) 50%, var(--color-primary-dark) 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* CSS Frame Shards + Neural Network Fallback */}
          <div className="absolute inset-0 node-network-bg">
            <CSSFrameShards count={4} />
            <CSSCrystalPrisms count={6} />
            
            {/* Enhanced CSS Neural Network */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div 
                  className="w-32 h-32 rounded-full electric-glow opacity-60"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: 'easeInOut' 
                  }}
                  style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, var(--color-primary-dark) 70%)' }}
                />
                {/* Orbital rings */}
                {Array.from({ length: 3 }, (_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute inset-0 border rounded-full`}
                    style={{
                      width: `${140 + i * 40}px`,
                      height: `${140 + i * 40}px`,
                      left: `${-20 - i * 20}px`,
                      top: `${-20 - i * 20}px`,
                      borderColor: i === 0 ? 'var(--color-accent)' : 'var(--color-primary-light)',
                      borderWidth: '1px',
                      opacity: 0.4 - i * 0.1
                    }}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ 
                      duration: 15 + i * 5, 
                      repeat: Infinity, 
                      ease: 'linear'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Hero Content */}
        <HeroContent />
      </section>
    )
  }

  return (
    <section 
      ref={containerRef}
      id={id} 
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="absolute inset-0"
      >
        {ready ? (
          <Canvas
            dpr={deviceTier === 'high' ? [1, 2] : [1, 1.5]}
            camera={{ position: [0, 0.5, 4], fov: 45 }}
            shadows={deviceTier === 'high'}
            style={{ height: '100%', width: '100%' }}
            gl={{
              antialias: deviceTier === 'high',
              alpha: true,
              powerPreference: deviceTier === 'high' ? 'high-performance' : 'low-power'
            }}
          >
            {/* Cinematic Lighting */}
            <ambientLight intensity={0.3} color="#1c7a72" />
            <directionalLight 
              position={[8, 8, 5]} 
              intensity={1} 
              color="#e63946"
              castShadow={deviceTier === 'high'}
            />
            <pointLight 
              position={[-6, 2, 3]} 
              intensity={0.4} 
              color="#f4c542" 
            />
            
            <Suspense fallback={null}>
              {/* Central Neural Network - The brain/psychology metaphor */}
              <NeuralOrb 
                position={[0, 0, 0]} 
                scale={0.9} 
                deviceTier={deviceTier} 
              />
              
              {/* Frame Shards - Signature motif representing "frames" */}
              <FrameShard deviceTier={deviceTier} />
              
              {/* Crystal Prisms - Scientific precision background */}
              <CrystalPrisms count={6} deviceTier={deviceTier} />
              
              {/* Environment for high-end devices */}
              {deviceTier === 'high' && (
                <Environment preset="studio" background={false} />
              )}
            </Suspense>
            
            {/* Disable orbit controls for cinematic experience */}
            <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
            
            {/* Performance monitoring */}
            <PerformanceMonitor 
              onChange={({ factor }) => {
                if (factor < 0.4) {
                  console.log('⚠️ Performance warning: Consider reducing quality')
                }
              }} 
            />
          </Canvas>
        ) : (
          <HeroLoading />
        )}
      </motion.div>

      {/* Hero Content with enhanced typography */}
      <motion.div style={{ y: textY }}>
        <HeroContent />
      </motion.div>

      {/* Volumetric lighting overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-bg-dark/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-darker/40 pointer-events-none" />
    </section>
  )
}

// Enhanced Hero Content Component
function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1], // Custom reveal easing
            staggerChildren: 0.1 
          }}
          className="max-w-5xl mx-auto"
        >
          {/* Refined Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-display font-bold mb-6 leading-none"
            style={{ 
              background: 'var(--metallic-gradient)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          >
            Frame Economics
          </motion.h1>

          {/* Enhanced subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl md:text-3xl font-light mb-8 text-muted-light leading-tight tracking-wide"
          >
            Master Behavioral Psychology & Influence
          </motion.h2>

          {/* Refined description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the hidden patterns that shape decisions, influence outcomes, and transform understanding through advanced psychological frameworks.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-5 bg-accent text-white rounded-lg font-semibold text-lg transition-all duration-300 sheen-effect electric-glow overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-gold))',
                boxShadow: '0 8px 32px var(--color-accent-glow)'
              }}
            >
              <span className="relative z-10 electric-text" style={{ color: 'white' }}>Master Influence →</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 glass-tinted rounded-lg font-semibold text-lg text-primary-light transition-all duration-300 hover:glass-strong border border-primary-muted"
            >
              Explore Psychology
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Loading Component
function HeroLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--color-bg-dark)' }}>
      <div className="text-center">
        <motion.div 
          className="w-16 h-16 border-4 border-primary border-t-accent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-muted animate-pulse">Initializing Frame Economics...</p>
      </div>
    </div>
  )
}