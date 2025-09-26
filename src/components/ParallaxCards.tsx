"use client";
import { useRef } from "react";
import { motion as m, useScroll, useTransform } from "framer-motion";

interface ParallaxCardsProps {
  items: { title: string; body: string; icon?: React.ReactNode }[];
}

export default function ParallaxCards({ items }: ParallaxCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start end", "end start"] 
  });

  return (
    <div ref={ref} className="card-grid-container">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 card-grid">
        {items.map((item, i) => {
          // Create varying parallax effects
          const yOffset = i % 3 === 0 ? 12 : i % 3 === 1 ? -8 : 4;
          const y = useTransform(
            scrollYProgress, 
            [0, 1], 
            [yOffset, -yOffset]
          );
          const opacity = useTransform(
            scrollYProgress, 
            [0, 0.2, 0.8, 1], 
            [0.75, 1, 1, 0.9]
          );

          return (
            <m.article
              key={`${item.title}-${i}`}
              style={{ y, opacity }}
              className="
                relative p-6 rounded-2xl glass-effect 
                hover:shadow-lg card-hover
                transition-shadow duration-300
              "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.2, 0.8, 0.2, 1],
                delay: i * 0.1 
              }}
            >
              {/* Icon */}
              {item.icon && (
                <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                     style={{ background: 'var(--brand-100)' }}>
                  <div style={{ color: 'var(--brand-600)' }}>
                    {item.icon}
                  </div>
                </div>
              )}
              
              {/* Content */}
              <h3 
                className="font-semibold mb-3 leading-snug"
                style={{ 
                  fontSize: 'var(--fs-600)',
                  color: 'var(--text-primary)'
                }}
              >
                {item.title}
              </h3>
              
              <p 
                className="leading-relaxed"
                style={{ 
                  fontSize: 'var(--fs-400)',
                  color: 'var(--text-secondary)'
                }}
              >
                {item.body}
              </p>

              {/* Subtle hover gradient */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-500) 0%, var(--accent-500) 100%)'
                }}
              />
            </m.article>
          );
        })}
      </div>
    </div>
  );
}