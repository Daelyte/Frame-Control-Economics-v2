import { useState } from 'react';

// Motion components
import TechBackdrop from '../components/motion/TechBackdrop';
import DragonMark from '../components/motion/DragonMark';
import MagneticButton from '../components/motion/MagneticButton';
import ParallaxCards from '../components/ParallaxCards';
import RevealSection, { RevealText, RevealImage } from '../components/RevealSection';
import SmoothNav, { StickyNav } from '../components/SmoothNav';
import AnimatedChart from '../components/AnimatedChart';
import { FadeInUp, Stagger, Item } from '../components/motion/primitives';

// Sample data
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
  },
  {
    title: "Accessibility First",
    body: "Motion respects user preferences, colors meet contrast standards, and interactions remain usable across devices.",
    icon: <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-jade-500" />
  },
  {
    title: "Performance Optimized",
    body: "Server components, efficient animations, and thoughtful loading strategies create seamless user experiences.",
    icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-jade-400 to-teal-600" />
  },
  {
    title: "Design Token System",
    body: "Semantic design tokens create consistency across components while enabling efficient theme customization.",
    icon: <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-accent-400 to-brand-500" />
  }
];

const navItems = [
  { id: 'hero', label: 'Hero', href: '#hero' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'data', label: 'Data', href: '#data' },
  { id: 'motion', label: 'Motion', href: '#motion' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];

const chartData = [
  { label: 'Performance', value: 92 },
  { label: 'Accessibility', value: 88 },
  { label: 'SEO', value: 95 },
  { label: 'Best Practices', value: 89 }
];

const lineChartData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 82 },
  { label: 'Apr', value: 71 },
  { label: 'May', value: 89 },
  { label: 'Jun', value: 94 }
];

export default function MotionDemo() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen">
        {/* Tech Backdrop */}
        <TechBackdrop />

        {/* Sticky Navigation */}
        <StickyNav>
          <SmoothNav items={navItems} />
        </StickyNav>

        {/* Hero Section */}
        <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-4">
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
                Motion Design
                <span 
                  className="block"
                  style={{ color: 'var(--brand-500)' }}
                >
                  Demonstration
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
                <MagneticButton 
                  variant="primary"
                  className="px-8 py-3 rounded-full font-medium"
                >
                  Explore Components
                </MagneticButton>
                
                <MagneticButton 
                  variant="secondary"
                  className="px-8 py-3 rounded-full font-medium"
                >
                  View Source Code
                </MagneticButton>
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-24 px-4">
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
          </div>
        </section>

        {/* Data Visualization Section */}
        <section id="data" className="relative z-10 py-24 px-4 glass-section">
          <div className="max-w-6xl mx-auto">
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
                SVG-based charts with entrance animations, hover states, 
                and progressive disclosure of information.
              </p>
            </RevealSection>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <RevealSection direction="left" delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <h3 
                      className="font-semibold mb-4"
                      style={{ 
                        fontSize: 'var(--fs-600)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Lighthouse Scores
                    </h3>
                    <AnimatedChart 
                      data={chartData} 
                      type="progress"
                      className="space-y-4"
                    />
                  </div>

                  <div>
                    <h3 
                      className="font-semibold mb-4"
                      style={{ 
                        fontSize: 'var(--fs-600)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Performance Metrics
                    </h3>
                    <AnimatedChart 
                      data={chartData} 
                      type="bar"
                      width={350}
                      height={200}
                    />
                  </div>
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
                    Growth Trajectory
                  </h3>
                  <AnimatedChart 
                    data={lineChartData} 
                    type="line"
                    width={400}
                    height={250}
                  />
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* Motion Primitives Section */}
        <section id="motion" className="relative z-10 py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <RevealSection direction="up" className="text-center mb-16">
              <h2 
                className="font-bold mb-6"
                style={{ 
                  fontSize: 'var(--fs-800)',
                  color: 'var(--text-primary)'
                }}
              >
                Motion Primitives
              </h2>
              <p 
                className="max-w-2xl mx-auto leading-relaxed"
                style={{ 
                  fontSize: 'var(--fs-500)',
                  color: 'var(--text-secondary)'
                }}
              >
                Reusable animation components with consistent timing, 
                easing, and accessibility considerations.
              </p>
            </RevealSection>

            <Stagger className="grid md:grid-cols-2 gap-8">
              <Item>
                <div 
                  className="p-6 rounded-2xl glass-effect text-center"
                  onMouseEnter={() => setHoveredCard(0)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <h3 
                    className="font-semibold mb-3"
                    style={{ 
                      fontSize: 'var(--fs-600)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Staggered Reveals
                  </h3>
                  <p 
                    style={{ 
                      fontSize: 'var(--fs-400)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Sequential animations that create rhythm and visual interest
                  </p>
                </div>
              </Item>

              <Item>
                <div 
                  className="p-6 rounded-2xl glass-effect text-center"
                  onMouseEnter={() => setHoveredCard(1)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <h3 
                    className="font-semibold mb-3"
                    style={{ 
                      fontSize: 'var(--fs-600)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Magnetic Interactions
                  </h3>
                  <p 
                    style={{ 
                      fontSize: 'var(--fs-400)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Cursor-aware elements that respond to proximity and movement
                  </p>
                </div>
              </Item>

              <Item>
                <div 
                  className="p-6 rounded-2xl glass-effect text-center"
                  onMouseEnter={() => setHoveredCard(2)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <h3 
                    className="font-semibold mb-3"
                    style={{ 
                      fontSize: 'var(--fs-600)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Parallax Effects
                  </h3>
                  <p 
                    style={{ 
                      fontSize: 'var(--fs-400)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Depth and layering through scroll-linked motion
                  </p>
                </div>
              </Item>

              <Item>
                <div 
                  className="p-6 rounded-2xl glass-effect text-center"
                  onMouseEnter={() => setHoveredCard(3)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <h3 
                    className="font-semibold mb-3"
                    style={{ 
                      fontSize: 'var(--fs-600)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Accessibility First
                  </h3>
                  <p 
                    style={{ 
                      fontSize: 'var(--fs-400)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Respects prefers-reduced-motion and maintains usability
                  </p>
                </div>
              </Item>
            </Stagger>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative z-10 py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <RevealSection direction="up">
              <h2 
                className="font-bold mb-6"
                style={{ 
                  fontSize: 'var(--fs-800)',
                  color: 'var(--text-primary)'
                }}
              >
                Ready to Implement?
              </h2>
              <p 
                className="mb-8 leading-relaxed"
                style={{ 
                  fontSize: 'var(--fs-500)',
                  color: 'var(--text-secondary)'
                }}
              >
                These motion patterns can be integrated into your existing codebase 
                or built from scratch as part of a comprehensive design system.
              </p>

              <MagneticButton 
                variant="primary"
                className="px-12 py-4 rounded-full font-semibold"
                style={{ fontSize: 'var(--fs-500)' }}
              >
                Start Your Project
              </MagneticButton>
            </RevealSection>
          </div>
        </section>
    </div>
  );
}