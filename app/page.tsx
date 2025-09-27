'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamic imports for performance
const DragonCanvas = dynamic(() => import('../components/DragonCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-primary-900 animate-pulse" />
});

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative min-h-screen flex items-center justify-center">
        {/* Background 3D Dragon (will be added later) */}
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={<div className="bg-primary-900" />}>
            <DragonCanvas />
          </Suspense>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            {/* Logo/Brand Mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-fluid-6xl font-display font-bold mb-4 metallic-text">
                Frame Economics
              </h1>
              <div className="w-32 h-1 bg-hero-metal mx-auto rounded-full opacity-60"></div>
            </motion.div>

            {/* Main Tagline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-fluid-2xl text-muted-300 mb-8 font-light leading-relaxed"
            >
              Master Behavioral Psychology & Influence
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-fluid-lg text-muted-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your understanding of human psychology through advanced frame control techniques. 
              Discover the hidden patterns that shape decisions, influence outcomes, and master the art of persuasion.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
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
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 border-2 border-muted-400 rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-muted-400 rounded-full mt-2"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon - Additional Sections */}
      <section className="py-24 bg-primary-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h3 className="text-fluid-3xl font-display font-bold mb-6">
              Revolutionary Psychology Education
            </h3>
            <p className="text-fluid-lg text-muted-300 leading-relaxed">
              Coming soon: Interactive learning modules, behavioral assessment tools, 
              and advanced influence techniques designed to unlock your psychological potential.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}