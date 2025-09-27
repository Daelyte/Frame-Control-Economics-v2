'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamic import for the new HeroWithMotifs component
const HeroWithMotifs = dynamic(() => import('../components/HeroWithMotifs'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-dark)' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-muted">Loading Frame Economics...</p>
      </div>
    </div>
  )
});

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: 'var(--color-bg-dark)' }}>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section with Frame Shards + Neural Network */}
      <HeroWithMotifs id="main-content" />

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
            className="w-6 h-10 border-2 border-muted rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-muted rounded-full mt-2"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Revolutionary Psychology Section - Enhanced */}
      <section className="py-24 node-network-bg" style={{ background: 'var(--color-bg-section)' }}>
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
            <p className="text-fluid-lg text-muted-light leading-relaxed mb-8">
              Transform your understanding of human psychology through advanced frame control techniques. 
              Discover the hidden patterns that shape decisions, influence outcomes, and master the art of persuasion.
            </p>
            
            {/* Enhanced Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="glass-tinted p-8 rounded-xl border border-primary-muted hover:border-primary-light transition-all duration-300"
              >
                <div className="text-4xl mb-6 electric-text">🧠</div>
                <h4 className="text-xl font-semibold mb-4 text-white">Behavioral Analysis</h4>
                <p className="text-muted-light leading-relaxed">Deep insights into human decision-making patterns and psychological frameworks</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="glass-tinted p-8 rounded-xl border border-primary-muted hover:border-accent transition-all duration-300"
              >
                <div className="text-4xl mb-6" style={{ color: 'var(--color-accent-gold)' }}>⚡</div>
                <h4 className="text-xl font-semibold mb-4 text-white">Influence Techniques</h4>
                <p className="text-muted-light leading-relaxed">Advanced methods for ethical persuasion and behavioral influence</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="glass-tinted p-8 rounded-xl border border-primary-muted hover:border-primary-light transition-all duration-300"
              >
                <div className="text-4xl mb-6 text-primary-light">🎯</div>
                <h4 className="text-xl font-semibold mb-4 text-white">Frame Control</h4>
                <p className="text-muted-light leading-relaxed">Master the art of perspective manipulation and psychological framing</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
