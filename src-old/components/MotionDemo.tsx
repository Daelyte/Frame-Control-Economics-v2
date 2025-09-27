import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
import { DramaticDragon } from './ambient/DragonPresets';
import DragonMark from './motion/DragonMark';
import ParallaxCards from './ParallaxCards';
import RevealSection, { RevealText } from './RevealSection';
import AnimatedChart from './AnimatedChart';
import { FadeInUp, Stagger, Item } from './motion/primitives';

// Sample data for the demo
const cardItems = [
  {
    title: "Perceptual Color Science",
    body: "OKLCH color space ensures consistent perceived brightness across all brand elements, creating harmonious visual hierarchies.",
    icon: <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600" />
  },
  {
    title: "Container Query Layouts", 
    body: "Responsive design that adapts to container size rather than viewport, enabling truly modular component architecture.",
    icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-400 to-accent-600" />
  },
  {
    title: "Motion with Purpose",
    body: "Carefully orchestrated animations that guide attention, provide feedback, and enhance usability without overwhelming.",
    icon: <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500" />
  }
];

const chartData = [
  { label: 'Performance', value: 92 },
  { label: 'Accessibility', value: 88 },
  { label: 'SEO', value: 95 },
  { label: 'Best Practices', value: 89 }
];

const MotionDemo: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  return (
    <div className="relative min-h-screen">
      <DramaticDragon />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <RevealSection direction="up" delay={0.2}>
            <DragonMark className="mx-auto mb-8" />
          </RevealSection>

          <FadeInUp delay={0.4}>
            <h1 
              className="font-bold mb-6 leading-tight"
              style={{ 
                fontSize: 'var(--fs-900)',
                color: 'var(--text-primary)'
              }}
            >
              Advanced Motion Design
              <span 
                className="block"
                style={{ color: 'var(--brand-500)' }}
              >
                Frame Economics v2
              </span>
            </h1>
          </FadeInUp>

          <RevealText delay={0.6} className="max-w-2xl mx-auto mb-8">
            <p 
              className="leading-relaxed"
              style={{ 
                fontSize: 'var(--fs-500)',
                color: 'var(--text-secondary)'
              }}
            >
              Experience advanced animation patterns, performant motion design, 
              and accessible interaction primitives built for modern web applications.
            </p>
          </RevealText>

          <FadeInUp delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <m.button
                className="px-8 py-3 rounded-full font-medium transition-all"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-500) 0%, var(--accent-500) 100%)',
                  color: 'white'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection('features')}
              >
                Explore Components
              </m.button>
              
              <m.button
                className="px-8 py-3 rounded-full font-medium glass-effect transition-all"
                style={{ color: 'var(--text-primary)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection('data')}
              >
                View Data Demo
              </m.button>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Features Section */}
      {activeSection === 'features' && (
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <RevealSection direction="up" className="text-center mb-16">
              <h2 
                className="font-bold mb-6"
                style={{ 
                  fontSize: 'var(--fs-800)',
                  color: 'var(--text-primary)'
                }}
              >
                Advanced Motion Patterns
              </h2>
              <p 
                className="max-w-2xl mx-auto leading-relaxed"
                style={{ 
                  fontSize: 'var(--fs-500)',
                  color: 'var(--text-secondary)'
                }}
              >
                Scroll-linked animations, parallax effects, and intersection-based reveals 
                create engaging experiences that respect user preferences.
              </p>
            </RevealSection>

            <ParallaxCards items={cardItems} />

            <div className="text-center mt-12">
              <m.button
                className="px-6 py-2 rounded-full font-medium glass-effect"
                style={{ color: 'var(--text-primary)' }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveSection('hero')}
              >
                ← Back to Hero
              </m.button>
            </div>
          </div>
        </section>
      )}

      {/* Data Section */}
      {activeSection === 'data' && (
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <RevealSection direction="right" className="text-center mb-16">
              <h2 
                className="font-bold mb-6"
                style={{ 
                  fontSize: 'var(--fs-800)',
                  color: 'var(--text-primary)'
                }}
              >
                Animated Data Stories
              </h2>
              <p 
                className="max-w-2xl mx-auto leading-relaxed"
                style={{ 
                  fontSize: 'var(--fs-500)',
                  color: 'var(--text-secondary)'
                }}
              >
                SVG-based charts with entrance animations and progressive data disclosure.
              </p>
            </RevealSection>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <RevealSection direction="left" delay={0.2}>
                <div>
                  <h3 
                    className="font-semibold mb-4"
                    style={{ 
                      fontSize: 'var(--fs-600)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Performance Scores
                  </h3>
                  <AnimatedChart 
                    data={chartData} 
                    type="progress"
                    className="space-y-4"
                  />
                </div>
              </RevealSection>

              <RevealSection direction="right" delay={0.4}>
                <div>
                  <h3 
                    className="font-semibold mb-4 text-center"
                    style={{ 
                      fontSize: 'var(--fs-600)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Visual Chart
                  </h3>
                  <AnimatedChart 
                    data={chartData} 
                    type="bar"
                    width={350}
                    height={200}
                  />
                </div>
              </RevealSection>
            </div>

            <div className="text-center mt-12">
              <m.button
                className="px-6 py-2 rounded-full font-medium glass-effect"
                style={{ color: 'var(--text-primary)' }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveSection('hero')}
              >
                ← Back to Hero
              </m.button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MotionDemo;