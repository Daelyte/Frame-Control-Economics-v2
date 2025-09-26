"use client";
import { useState, useEffect } from "react";
import { motion as m } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface SmoothNavProps {
  items: NavItem[];
  className?: string;
}

export default function SmoothNav({ items, className = "" }: SmoothNavProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0.1
      }
    );

    // Observe all sections
    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  };

  return (
    <nav className={`${className} flex space-x-1 p-1 rounded-full glass-effect`}>
      {items.map(({ id, label, href }) => {
        const isActive = activeSection === id;
        
        return (
          <button
            key={id}
            onClick={() => scrollToSection(href)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium
              transition-colors duration-200 z-10
              ${isActive 
                ? 'text-white' 
                : 'hover:text-brand-600'
              }
            `}
            style={{
              color: isActive ? 'white' : 'var(--text-secondary)'
            }}
          >
            {isActive && (
              <m.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-500) 0%, var(--accent-500) 100%)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Sticky navigation wrapper
export function StickyNav({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const trigger = document.getElementById('nav-trigger');
    if (trigger) observer.observe(trigger);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Invisible trigger element */}
      <div id="nav-trigger" className="absolute top-0" />
      
      <m.div
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          ${className}
        `}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </m.div>
    </>
  );
}