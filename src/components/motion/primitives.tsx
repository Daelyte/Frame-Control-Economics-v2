"use client";
import { motion as m } from "framer-motion";
import { motion } from "framer-motion";

// Utility primitives for consistent motion patterns

export const FadeInUp = ({ 
  delay = 0, 
  children 
}: { 
  delay?: number; 
  children: React.ReactNode 
}) => (
  <m.div
    initial={{ y: 8, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.6 }}
    transition={{ 
      duration: 0.38, 
      ease: [0.2, 0.8, 0.2, 1], 
      delay 
    }}
  >
    {children}
  </m.div>
);

export const Stagger = ({ children }: { children: React.ReactNode }) => (
  <m.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.4 }}
    variants={{
      hidden: { opacity: 1 },
      show: { 
        transition: { staggerChildren: 0.06 } 
      },
    }}
  >
    {children}
  </m.div>
);

export const Item = ({ children }: { children: React.ReactNode }) => (
  <m.div
    variants={{
      hidden: { 
        opacity: 0, 
        y: 8 
      },
      show: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration: 0.22, 
          ease: [0.2, 0.8, 0.2, 1] 
        } 
      },
    }}
  >
    {children}
  </m.div>
);

// Enhanced version with scale for more dramatic reveals
export const ScaleItem = ({ children }: { children: React.ReactNode }) => (
  <m.div
    variants={{
      hidden: { 
        opacity: 0, 
        y: 8,
        scale: 0.98 
      },
      show: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
          duration: 0.32, 
          ease: [0.2, 0.8, 0.2, 1] 
        } 
      },
    }}
  >
    {children}
  </m.div>
);

// For slower, more deliberate reveals
export const SlowReveal = ({ 
  delay = 0, 
  children 
}: { 
  delay?: number; 
  children: React.ReactNode 
}) => (
  <m.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ 
      duration: 0.6, 
      ease: [0.25, 0.1, 0.25, 1], 
      delay 
    }}
  >
    {children}
  </m.div>
);