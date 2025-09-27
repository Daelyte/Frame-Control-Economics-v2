'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamic import for the new DragonHero component
const DragonHero = dynamic(() => import('../components/DragonHero'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 text-muted-400 animate-bounce">🐉</div>
        <p className="text-muted-300">Loading Frame Economics...</p>
      </div>
    </div>
  )
});

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section with 3D Dragon */}
      <DragonHero id="main-content" />

      {/* Scroll Indicator */}
      <div className="relative -mt-20 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex justify-center"
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

      {/* Revolutionary Psychology Section */}
      <section className="py-24 bg-primary-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h3 className="text-fluid-3xl font-display font-bold mb-6 text-white">
              Revolutionary Psychology Education
            </h3>
            <p className="text-fluid-lg text-muted-300 leading-relaxed mb-8">
              Transform your understanding of human psychology through advanced frame control techniques. 
              Discover the hidden patterns that shape decisions, influence outcomes, and master the art of persuasion.
            </p>
            
            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-lg"
              >
                <div className="text-3xl mb-4">🧠</div>
                <h4 className="text-fluid-lg font-semibold mb-2 text-white">Behavioral Analysis</h4>
                <p className="text-muted-300 text-sm">Deep insights into human decision-making patterns</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-lg"
              >
                <div className="text-3xl mb-4">⚡</div>
                <h4 className="text-fluid-lg font-semibold mb-2 text-white">Influence Techniques</h4>
                <p className="text-muted-300 text-sm">Advanced methods for ethical persuasion</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-lg"
              >
                <div className="text-3xl mb-4">🎯</div>
                <h4 className="text-fluid-lg font-semibold mb-2 text-white">Frame Control</h4>
                <p className="text-muted-300 text-sm">Master the art of perspective manipulation</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
