// components/DragonHero.tsx
'use client'
import React, { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerformanceMonitor, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { detectDeviceTier } from '../lib/dragonAssets'

// Dynamic import dragon models and neural components to avoid SSR issues
const DragonModel = dynamic(() => import('./DragonModel'), { ssr: false })
const GeometricDragonModel = dynamic(() => import('./DragonModel').then(mod => ({ default: mod.GeometricDragonModel })), { ssr: false })
const NeuralOrb = dynamic(() => import('./NeuralOrb'), { ssr: false })
const CrystalPrisms = dynamic(() => import('./CrystalPrisms'), { ssr: false })
const CSSCrystalPrisms = dynamic(() => import('./CrystalPrisms').then(mod => ({ default: mod.CSSCrystalPrisms })), { ssr: false })

interface DragonHeroProps {
  className?: string;
  id?: string;
}

export default function DragonHero({ className = '', id }: DragonHeroProps) {
  // Performance and loading states
  const [ready, setReady] = useState(false)
  const [use3D, setUse3D] = useState(true)
  const [useGLTF, setUseGLTF] = useState(true)
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
    
    // Test if GLB model exists
    fetch('/models/dragon.optimized.glb', { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          console.log('GLB model not found, using geometric dragon')
          setUseGLTF(false)
        }
      })
      .catch(() => {
        setUseGLTF(false)
      })
    
    // Only render Canvas when idle or after delay to avoid blocking paint
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true))
      : window.setTimeout(() => setReady(true), 300)
      
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as any)
      else clearTimeout(id as any)
    }
  }, [])

  // CSS fallback for low-end devices
  if (!use3D) {
    return (
      <section id={id} className={`relative w-full h-[420px] md:h-[720px] ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900"
        >
          {/* CSS Neural Orb and Crystal Fallback */}
          <div className="absolute inset-0 overflow-hidden">
            {/* CSS Neural Network Orb */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative animate-pulse">
                {/* Central orb */}
                <div className="w-24 h-24 bg-gradient-radial from-primary-400/60 to-primary-600/80 rounded-full shadow-2xl" />
                {/* Orbital rings */}
                <div className="absolute inset-0 w-32 h-32 -top-4 -left-4 border border-muted-400/30 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-0 w-28 h-28 -top-2 -left-2 border border-accent-500/40 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                {/* Energy particles */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-accent-500 rounded-full animate-pulse" />
                <div className="absolute bottom-3 right-4 w-1 h-1 bg-primary-400 rounded-full animate-pulse delay-300" />
                <div className="absolute top-8 right-2 w-1 h-1 bg-muted-400 rounded-full animate-pulse delay-700" />
              </div>
            </div>
            
            {/* CSS Crystal Prisms */}
            <CSSCrystalPrisms count={6} />
            
            {/* Additional ambient particles */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-600/20 rounded-full blur-xl animate-float" />
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent-500/10 rounded-full blur-lg animate-bounce-gentle delay-300" />
          </div>
        </motion.div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-12 md:py-20 flex items-center h-full">
          <div>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-4">Frame Economics</h1>
            <p className="mt-3 max-w-lg text-muted-300">Master behavioral psychology & influence</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id={id} className={`relative w-full h-[420px] md:h-[720px] ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        {ready ? (
          <Canvas
            dpr={deviceTier === 'high' ? [1, 2] : [1, 1.5]} // limit DPR for performance
            camera={{ position: [0, 0.8, 3.2], fov: 35 }}
            shadows={deviceTier === 'high'}
            style={{ height: '100%', width: '100%' }}
            gl={{
              antialias: deviceTier === 'high',
              alpha: true,
              powerPreference: deviceTier === 'high' ? 'high-performance' : 'low-power'
            }}
          >
            {/* Lighting setup */}
            <ambientLight intensity={0.4} color="#1F7A72" />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={0.8} 
              color="#FF3B30"
              castShadow={deviceTier === 'high'}
            />
            <pointLight 
              position={[-5, 0, 2]} 
              intensity={0.3} 
              color="#9BB0A7" 
            />
            
            <Suspense fallback={null}>
              {/* Neural Network Orb - Central Focus */}
              <NeuralOrb 
                position={[0, 0, 0]} 
                scale={0.8} 
                deviceTier={deviceTier} 
              />
              
              {/* Dragon Model - Side Element */}
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                {useGLTF ? (
                  <DragonModel position={[3, -0.6, -1.5]} scale={0.6} />
                ) : (
                  <GeometricDragonModel position={[3, -0.6, -1.5]} scale={[0.8, 0.8, 0.8]} />
                )}
              </Float>
              
              {/* Crystal Prisms - Ambient Background */}
              <CrystalPrisms count={8} deviceTier={deviceTier} />
              
              {deviceTier === 'high' && (
                <Environment preset="night" background={false} />
              )}
            </Suspense>
            
            <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
            
            {/* Performance monitor */}
            <PerformanceMonitor 
              onChange={({ factor }) => {
                if (factor < 0.5) {
                  console.log('Low performance detected, consider reducing quality')
                }
              }} 
            />
          </Canvas>
        ) : (
          // Loading fallback
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
            <div className="text-center">
              <div className="text-6xl mb-4 text-muted-400 animate-bounce">🐉</div>
              <p className="text-muted-300 text-sm animate-pulse">Summoning Dragon...</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Overlay content: heading, CTA */}
      <div className="relative z-10 container mx-auto px-6 py-12 md:py-20 flex items-center h-full">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-display text-white mb-4"
          >
            Frame Economics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-3 max-w-lg text-muted-300"
          >
            Master behavioral psychology & influence
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-accent-500 text-white rounded-lg font-semibold text-fluid-base transition-all duration-normal focus-ring overflow-hidden"
            >
              <span className="relative z-10">Master Influence →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-normal"></div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 glass rounded-lg font-semibold text-fluid-base transition-all duration-normal focus-ring hover:bg-glass-200"
            >
              Explore Psychology
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}