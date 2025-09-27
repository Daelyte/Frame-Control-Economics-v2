import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';

const EarthGodTrail = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [vines, setVines] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    life: number;
    angle: number;
    growth: number;
  }>>([]);
  const [earthParticles, setEarthParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    life: number;
    type: 'stone' | 'leaf' | 'ember';
    vx: number;
    vy: number;
  }>>([]);
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
  const particleIdRef = useRef(0);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePos(newPos);
      
      // Update mouse trail for earthy energy effect
      setMouseTrail(prev => [
        { x: newPos.x, y: newPos.y, opacity: 1 },
        ...prev.slice(0, 12)
      ].map((point, i) => ({ ...point, opacity: 1 - (i * 0.08) })));
      
      // Calculate mouse velocity for vine and particle generation
      const dx = newPos.x - lastMouseRef.current.x;
      const dy = newPos.y - lastMouseRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Generate vines based on movement
      if (speed > 2) {
        const vineCount = Math.min(Math.floor(speed / 10), 2);
        const newVines = Array.from({ length: vineCount }, () => ({
          id: particleIdRef.current++,
          x: newPos.x + (Math.random() - 0.5) * 30,
          y: newPos.y + (Math.random() - 0.5) * 30,
          size: 8 + Math.random() * 20,
          opacity: 0.8 + Math.random() * 0.2,
          life: 1,
          angle: Math.random() * 360,
          growth: 0
        }));
        
        setVines(prev => [...prev, ...newVines]);
      }
      
      // Generate earth particles
      if (speed > 4) {
        const particleCount = Math.min(Math.floor(speed / 15), 3);
        const newParticles = Array.from({ length: particleCount }, () => ({
          id: particleIdRef.current++,
          x: newPos.x + (Math.random() - 0.5) * 40,
          y: newPos.y + (Math.random() - 0.5) * 40,
          size: 3 + Math.random() * 8,
          opacity: 0.7 + Math.random() * 0.3,
          life: 1,
          type: Math.random() < 0.4 ? 'stone' : Math.random() < 0.7 ? 'leaf' : 'ember' as 'stone' | 'leaf' | 'ember',
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - 1
        }));
        
        setEarthParticles(prev => [...prev, ...newParticles]);
      }
      
      lastMouseRef.current = newPos;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate vines and particles
  useEffect(() => {
    const animate = () => {
      setVines(prev => 
        prev
          .map(vine => ({
            ...vine,
            life: vine.life - 0.03,
            opacity: vine.opacity * 0.95,
            growth: vine.growth + 0.1,
            size: vine.size * 1.02
          }))
          .filter(vine => vine.life > 0 && vine.opacity > 0.05)
      );
      
      setEarthParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.02,
            opacity: particle.opacity * 0.96,
            vy: particle.vy + 0.02 // Gravity
          }))
          .filter(particle => particle.life > 0 && particle.opacity > 0.02)
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Earthy energy trail */}
      {mouseTrail.map((point, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: point.x - 8,
            top: point.y - 8,
            width: 16,
            height: 16,
            background: `radial-gradient(circle, rgba(101, 67, 33, ${point.opacity * 0.8}) 0%, rgba(139, 69, 19, ${point.opacity * 0.6}) 50%, transparent 100%)`,
            filter: `blur(${1 + i * 0.3}px)`,
            opacity: point.opacity,
            boxShadow: `0 0 ${10 + i * 3}px rgba(101, 67, 33, ${point.opacity * 0.4})`
          }}
        />
      ))}
      
      {/* Growing vines */}
      {vines.map(vine => (
        <motion.div
          key={vine.id}
          className="absolute"
          style={{
            left: vine.x - vine.size / 2,
            top: vine.y - vine.size / 2,
            width: vine.size,
            height: vine.size * (1 + vine.growth),
            background: `linear-gradient(${vine.angle}deg, transparent 0%, rgba(34, 139, 34, ${vine.opacity}) 30%, rgba(107, 142, 35, ${vine.opacity * 0.8}) 70%, transparent 100%)`,
            filter: `blur(1px) drop-shadow(0 0 ${3}px rgba(34, 139, 34, ${vine.opacity * 0.5}))`,
            transformOrigin: 'center bottom',
            transform: `rotate(${vine.angle}deg)`,
            opacity: vine.opacity
          }}
          animate={{
            opacity: [vine.opacity, 0]
          }}
          transition={{
            duration: vine.life * 2,
            ease: 'easeOut'
          }}
        />
      ))}
      
      {/* Earth particles */}
      {earthParticles.map(particle => {
        const getParticleStyle = () => {
          switch (particle.type) {
            case 'stone':
              return {
                background: `radial-gradient(circle, rgba(105, 105, 105, ${particle.opacity}) 0%, rgba(169, 169, 169, ${particle.opacity * 0.8}) 50%, transparent 100%)`,
                borderRadius: '2px'
              };
            case 'leaf':
              return {
                background: `radial-gradient(ellipse, rgba(34, 139, 34, ${particle.opacity}) 0%, rgba(107, 142, 35, ${particle.opacity * 0.7}) 60%, transparent 100%)`,
                borderRadius: '50% 0 50% 0'
              };
            case 'ember':
              return {
                background: `radial-gradient(circle, rgba(255, 69, 0, ${particle.opacity}) 0%, rgba(255, 140, 0, ${particle.opacity * 0.8}) 50%, transparent 100%)`,
                borderRadius: '50%',
                boxShadow: `0 0 ${particle.size}px rgba(255, 69, 0, ${particle.opacity * 0.6})`
              };
          }
        };
        
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              width: particle.size,
              height: particle.size,
              ...getParticleStyle(),
              opacity: particle.opacity
            }}
            animate={{
              opacity: [particle.opacity, 0]
            }}
            transition={{
              duration: particle.life,
              ease: 'easeOut'
            }}
          />
        );
      })}
      
      {/* Mystical earth ripple at cursor */}
      <motion.div
        className="absolute w-12 h-12 rounded-full border-2"
        style={{
          left: mousePos.x - 24,
          top: mousePos.y - 24,
          pointerEvents: 'none',
          borderColor: 'rgba(107, 142, 35, 0.6)',
          boxShadow: '0 0 15px rgba(107, 142, 35, 0.4)'
        }}
        animate={{
          scale: [1, 2.2, 1],
          opacity: [0.7, 0, 0.7]
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />
      
      {/* Secondary nature ripple */}
      <motion.div
        className="absolute w-20 h-20 rounded-full border"
        style={{
          left: mousePos.x - 40,
          top: mousePos.y - 40,
          pointerEvents: 'none',
          borderColor: 'rgba(34, 139, 34, 0.4)',
          background: 'radial-gradient(circle, transparent 60%, rgba(34, 139, 34, 0.1) 80%, transparent 100%)',
          boxShadow: 'inset 0 0 20px rgba(34, 139, 34, 0.3), 0 0 30px rgba(34, 139, 34, 0.2)'
        }}
        animate={{
          scale: [1, 3.5, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.4
        }}
      />
    </div>
  );
};

const MatrixLightning = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lightningBolts, setLightningBolts] = useState<Array<{
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
    life: number;
    angle: number;
    intensity: number;
  }>>([]);
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
  const particleIdRef = useRef(0);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePos(newPos);
      
      // Update mouse trail for dark energy effect
      setMouseTrail(prev => [
        { x: newPos.x, y: newPos.y, opacity: 1 },
        ...prev.slice(0, 8)
      ].map((point, i) => ({ ...point, opacity: 1 - (i * 0.12) })));
      
      // Calculate mouse velocity for lightning generation
      const dx = newPos.x - lastMouseRef.current.x;
      const dy = newPos.y - lastMouseRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Generate lightning bolts based on movement speed
      if (speed > 3) {
        const boltCount = Math.min(Math.floor(speed / 8), 2);
        const newBolts = Array.from({ length: boltCount }, () => ({
          id: particleIdRef.current++,
          x: newPos.x + (Math.random() - 0.5) * 40,
          y: newPos.y + (Math.random() - 0.5) * 40,
          width: 2 + Math.random() * 4,
          height: 20 + Math.random() * 60,
          opacity: 0.8 + Math.random() * 0.2,
          life: 1,
          angle: Math.random() * 360,
          intensity: 0.5 + Math.random() * 0.5
        }));
        
        setLightningBolts(prev => [...prev, ...newBolts]);
      }
      
      lastMouseRef.current = newPos;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate lightning bolts
  useEffect(() => {
    const animate = () => {
      setLightningBolts(prev => 
        prev
          .map(bolt => ({
            ...bolt,
            life: bolt.life - 0.05,
            opacity: bolt.opacity * 0.92,
            intensity: bolt.intensity * 0.95,
            height: bolt.height * 1.05, // Grow and fade
            angle: bolt.angle + (Math.random() - 0.5) * 10 // Slight wobble
          }))
          .filter(bolt => bolt.life > 0 && bolt.opacity > 0.02)
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Dark energy trail */}
      {mouseTrail.map((point, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: point.x - 6,
            top: point.y - 6,
            width: 12,
            height: 12,
            background: `radial-gradient(circle, rgba(0, 0, 0, ${point.opacity * 0.8}) 0%, rgba(20, 20, 20, ${point.opacity * 0.6}) 50%, transparent 100%)`,
            filter: `blur(${1 + i * 0.5}px)`,
            opacity: point.opacity,
            boxShadow: `0 0 ${8 + i * 2}px rgba(0, 0, 0, ${point.opacity * 0.5})`
          }}
        />
      ))}
      
      {/* Lightning bolts */}
      {lightningBolts.map(bolt => (
        <motion.div
          key={bolt.id}
          className="absolute"
          style={{
            left: bolt.x - bolt.width / 2,
            top: bolt.y - bolt.height / 2,
            width: bolt.width,
            height: bolt.height,
            background: `linear-gradient(${bolt.angle}deg, transparent 0%, rgba(0, 255, 255, ${bolt.intensity * bolt.opacity}) 20%, rgba(255, 255, 255, ${bolt.opacity}) 50%, rgba(0, 255, 255, ${bolt.intensity * bolt.opacity}) 80%, transparent 100%)`,
            filter: `blur(0.5px) drop-shadow(0 0 ${4 * bolt.intensity}px rgba(0, 255, 255, ${bolt.opacity}))`,
            transform: `rotate(${bolt.angle}deg)`,
            opacity: bolt.opacity
          }}
          animate={{
            opacity: [bolt.opacity, 0]
          }}
          transition={{
            duration: bolt.life,
            ease: 'easeOut'
          }}
        />
      ))}
      
      {/* Dark energy ripple at cursor */}
      <motion.div
        className="absolute w-8 h-8 rounded-full border-2"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
          pointerEvents: 'none',
          borderColor: 'rgba(0, 255, 255, 0.6)',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)'
        }}
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.8, 0, 0.8]
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />
      
      {/* Secondary dark ripple */}
      <motion.div
        className="absolute w-16 h-16 rounded-full border"
        style={{
          left: mousePos.x - 32,
          top: mousePos.y - 32,
          pointerEvents: 'none',
          borderColor: 'rgba(0, 0, 0, 0.8)',
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.3)'
        }}
        animate={{
          scale: [1, 4, 1],
          opacity: [0.6, 0, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.3
        }}
      />
    </div>
  );
};

const NeuralBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const TARGET_FPS = 30; // Reduced from 60fps for better performance
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Reduced node count for better performance
    const nodes = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      baseVx: (Math.random() - 0.5) * 0.08,
      baseVy: (Math.random() - 0.5) * 0.08,
      size: 3 + Math.random() * 4,
      baseSize: 3 + Math.random() * 4,
      morphTimer: Math.random() * Math.PI * 2,
      morphSpeed: 0.003 + Math.random() * 0.002,
      connections: [],
      shape: Math.floor(Math.random() * 4),
      nextShape: Math.floor(Math.random() * 4),
      morphProgress: 0,
      morphing: false
    }));

    let time = 0;

    const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: number, morphProgress = 0, nextShape = 0) => {
      ctx.save();
      ctx.translate(x, y);
      
      if (morphProgress > 0 && morphProgress < 1) {
        ctx.globalAlpha = 1 - morphProgress;
        drawSingleShape(ctx, size, shape);
        ctx.globalAlpha = morphProgress;
        drawSingleShape(ctx, size, nextShape);
        ctx.globalAlpha = 1;
      } else {
        drawSingleShape(ctx, size, shape);
      }
      
      ctx.restore();
    };

    const drawSingleShape = (ctx: CanvasRenderingContext2D, size: number, shape: number) => {
      ctx.beginPath();
      switch(shape) {
        case 0:
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          break;
        case 1:
          ctx.moveTo(0, -size);
          ctx.lineTo(-size * 0.866, size * 0.5);
          ctx.lineTo(size * 0.866, size * 0.5);
          ctx.closePath();
          break;
        case 2:
          ctx.rect(-size, -size, size * 2, size * 2);
          break;
        case 3:
          ctx.moveTo(0, -size);
          ctx.lineTo(size, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size, 0);
          ctx.closePath();
          break;
      }
      ctx.fill();
    };

    const animate = (currentTime: number) => {
      // Frame throttling for consistent performance
      if (currentTime - lastFrameTimeRef.current < FRAME_INTERVAL) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01; // Slightly faster increment to compensate for lower FPS
      
      nodes.forEach((node, i) => {
        node.morphTimer += node.morphSpeed;
        
        if (!node.morphing && Math.sin(node.morphTimer) > 0.99) {
          node.morphing = true;
          node.nextShape = (node.shape + 1) % 4;
          node.morphProgress = 0;
        }
        
        if (node.morphing) {
          node.morphProgress += 0.01;
          if (node.morphProgress >= 1) {
            node.shape = node.nextShape;
            node.morphing = false;
            node.morphProgress = 0;
          }
        }
        
        const waveX = Math.sin(time + node.y * 0.01) * 0.02;
        const waveY = Math.cos(time + node.x * 0.01) * 0.02;
        
        node.vx = node.baseVx + waveX;
        node.vy = node.baseVy + waveY;
        
        node.x += node.vx;
        node.y += node.vy;
        
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300 && distance > 1) {
          const force = (300 - distance) / 300;
          node.vx += (dx / distance) * force * 0.00005;
          node.vy += (dy / distance) * force * 0.00005;
        }
        
        const pulse = Math.sin(time * 0.5 + i * 0.2) * 0.3 + 1;
        node.size = node.baseSize * pulse;
        
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -0.8;
          node.baseVx *= -0.8;
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -0.8;
          node.baseVy *= -0.8;
        }
        
        // Optimized connection drawing with reduced distance
        nodes.slice(i + 1).forEach(otherNode => {
          const dist = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2);
          if (dist < 100) { // Reduced from 150 to 100 for fewer calculations
            const opacity = (1 - (dist / 150)) * 0.2;
            const connectionPulse = Math.sin(time * 0.3 + dist * 0.01) * 0.1 + 0.9;
            
            ctx.strokeStyle = `rgba(31, 122, 114, ${opacity * connectionPulse})`;
            ctx.lineWidth = opacity * 1.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
            
            if (Math.sin(time * 2 + dist) > 0.98) {
              const packetX = node.x + (otherNode.x - node.x) * ((Math.sin(time * 3) + 1) / 2);
              const packetY = node.y + (otherNode.y - node.y) * ((Math.sin(time * 3) + 1) / 2);
              
              ctx.fillStyle = '#FF3B30';
              ctx.beginPath();
              ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
        
        const nodeDistance = Math.sqrt((mousePos.x - node.x) ** 2 + (mousePos.y - node.y) ** 2);
        const proximityHeat = Math.max(0, 1 - nodeDistance / 200);
        
        const hue = nodeDistance < 200 ? 
          `rgba(255, ${Math.floor(59 + proximityHeat * 100)}, 48, ${0.7 + proximityHeat * 0.3})` :
          `rgba(31, 122, 114, ${0.6 + Math.sin(time + i) * 0.2})`;
        
        ctx.fillStyle = hue;
        drawShape(ctx, node.x, node.y, node.size, node.shape, node.morphProgress, node.nextShape);
      });
      
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [mousePos]);

  const throttledMouseUpdate = useCallback((e: MouseEvent) => {
    // Throttle mouse updates for better performance
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => throttledMouseUpdate(e), 16); // ~60fps throttle
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [throttledMouseUpdate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'radial-gradient(ellipse at center, #0f3b38 0%, #083230 50%, #041e1c 100%)',
        willChange: 'transform' // Optimize for hardware acceleration
      }}
    />
  );
});

const LiquidButton = ({ children, className = "", onClick, isSpecial = false }: { children: React.ReactNode; className?: string; onClick?: () => void; isSpecial?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (isSpecial) {
    return (
      <motion.button
        className={`relative overflow-hidden px-8 py-4 text-white font-semibold tracking-wide ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #ff6b35 50%, #f7931e 75%, #ffdd44 100%)',
          borderRadius: '25px', // More skateboard-like rounded corners
          border: '3px solid #333',
          backgroundClip: 'padding-box',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 221, 68, 0.1)',
        }}
      >
        {/* Skateboard Wheels */}
        <motion.div
          className="absolute -bottom-2 left-4 w-6 h-6 rounded-full"
          style={{
            background: 'radial-gradient(circle, #333 30%, #666 60%, #999 100%)',
            border: '2px solid #ff6b35',
            boxShadow: '0 0 10px rgba(255, 107, 53, 0.5)'
          }}
          animate={{
            rotate: isHovered ? [0, 360] : [0, 45],
            scale: isHovered ? [1, 1.2, 1] : [1],
            boxShadow: isHovered ? 
              ['0 0 10px rgba(255, 107, 53, 0.5)', '0 0 20px rgba(255, 107, 53, 0.8)', '0 0 10px rgba(255, 107, 53, 0.5)'] 
              : ['0 0 10px rgba(255, 107, 53, 0.3)']
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        
        <motion.div
          className="absolute -bottom-2 right-4 w-6 h-6 rounded-full"
          style={{
            background: 'radial-gradient(circle, #333 30%, #666 60%, #999 100%)',
            border: '2px solid #ff6b35',
            boxShadow: '0 0 10px rgba(255, 107, 53, 0.5)'
          }}
          animate={{
            rotate: isHovered ? [0, -360] : [0, -45],
            scale: isHovered ? [1, 1.2, 1] : [1],
            boxShadow: isHovered ? 
              ['0 0 10px rgba(255, 107, 53, 0.5)', '0 0 20px rgba(255, 107, 53, 0.8)', '0 0 10px rgba(255, 107, 53, 0.5)'] 
              : ['0 0 10px rgba(255, 107, 53, 0.3)']
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear', delay: 0.1 }}
        />
        
        {/* Skateboard Sparks */}
        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute w-1 h-3"
            style={{
              background: 'linear-gradient(180deg, #ffdd44 0%, #ff6b35 50%, transparent 100%)',
              left: `${20 + (i * 15)}%`,
              bottom: '2px',
              filter: 'drop-shadow(0 0 3px #ffdd44)',
              transformOrigin: 'bottom'
            }}
            animate={{
              scaleY: isHovered ? [0, 1, 0.3, 1.5, 0] : [0, 0.2, 0],
              x: isHovered ? [0, -3, 2, -5, 8] : [0],
              opacity: isHovered ? [0, 1, 0.4, 0.9, 0] : [0, 0.3, 0],
              rotate: isHovered ? [0, -10, 5, -15, 10] : [0]
            }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeOut' }}
          />
        ))}
        
        {/* Quantum Energy Beams */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-0.5"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00ff41 20%, #ffffff 50%, #00ff41 80%, transparent 100%)',
            transformOrigin: 'center',
            filter: 'drop-shadow(0 0 6px #00ff41)'
          }}
          animate={{
            scaleX: isHovered ? [0, 1.8, 0] : [0],
            opacity: isHovered ? [0, 1, 0] : [0]
          }}
          transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0, repeatDelay: 1.2 }}
        />
        
        {/* Glitch Lines */}
        <motion.div
          className="absolute top-1/3 left-0 w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #ff0040 30%, #00ff41 50%, #0040ff 70%, transparent 100%)',
            filter: 'drop-shadow(0 0 2px #ffffff)'
          }}
          animate={{
            scaleX: isHovered ? [0, 2, 0.5, 1.5, 0] : [0],
            opacity: isHovered ? [0, 1, 0.3, 0.8, 0] : [0],
            x: isHovered ? [0, 10, -5, 8, 0] : [0]
          }}
          transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0, repeatDelay: 0.6, delay: 0.2 }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-0 w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00ff41 25%, #ffffff 50%, #00ff41 75%, transparent 100%)',
            filter: 'drop-shadow(0 0 3px #00ff41)'
          }}
          animate={{
            scaleX: isHovered ? [0, 1.6, 0] : [0],
            opacity: isHovered ? [0, 0.9, 0] : [0],
            x: isHovered ? [0, -8, 12, -4, 0] : [0]
          }}
          transition={{ duration: 0.7, repeat: isHovered ? Infinity : 0, repeatDelay: 0.9, delay: 0.4 }}
        />
        
        {/* Light Rays - Reduced count */}
        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-0.5 h-8"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, #ffffff 50%, transparent 100%)',
              transformOrigin: 'center top',
              filter: 'blur(0.5px)'
            }}
            animate={{
              rotate: isHovered ? [i * 45, (i * 45) + 360] : [i * 45],
              scale: isHovered ? [0, 1, 0.5, 1, 0] : [0],
              opacity: isHovered ? [0, 0.8, 0.4, 0.9, 0] : [0]
            }}
            transition={{ 
              duration: 2, 
              repeat: isHovered ? Infinity : 0, 
              ease: 'easeInOut',
              delay: i * 0.1
            }}
          />
        ))}
        
        {/* Pulsating Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            filter: 'blur(2px)'
          }}
          animate={{
            scale: isHovered ? [1, 1.3, 1.1, 1.4, 1] : [1, 1.05, 1],
            opacity: isHovered ? [0.3, 0.7, 0.4, 0.8, 0.3] : [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Sparkles - Reduced count */}
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${20 + (i * 12)}%`,
              left: `${15 + (i * 15)}%`,
              filter: 'drop-shadow(0 0 2px #ffffff)'
            }}
            animate={{
              scale: isHovered ? [0, 1, 0.5, 1.2, 0] : [0, 0.3, 0],
              opacity: isHovered ? [0, 1, 0.3, 0.9, 0] : [0, 0.2, 0],
              rotate: isHovered ? [0, 180, 360] : [0]
            }}
            transition={{ 
              duration: 1.8, 
              repeat: isHovered ? Infinity : 0, 
              ease: 'easeInOut',
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Original shine effect enhanced */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{
            x: isHovered ? ['0%', '200%'] : '-100%',
            opacity: isHovered ? [0, 0.6, 0] : 0
          }}
          transition={{ duration: 0.4, ease: 'easeInOut', repeat: isHovered ? Infinity : 0, repeatDelay: 1.5 }}
          style={{ transform: 'skewX(-20deg)' }}
        />
        
        <motion.span 
          className="relative z-20 drop-shadow-lg font-mono"
          animate={{
            textShadow: isHovered ? [
              '0 0 0px #00ff41',
              '2px 0 0px #ff0040, -2px 0 0px #0040ff',
              '0 0 0px #00ff41',
              '1px 0 0px #ff0040, -1px 0 0px #0040ff',
              '0 0 0px #00ff41'
            ] : ['0 0 0px #00ff41']
          }}
          transition={{ duration: 0.15, repeat: isHovered ? Infinity : 0, repeatDelay: 2 }}
        >
          {children}
        </motion.span>
      </motion.button>
    );
  }
  
  return (
    <motion.button
      className={`relative overflow-hidden px-8 py-4 text-white font-semibold tracking-wide ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: 'linear-gradient(135deg, rgba(31,122,114,0.8) 0%, rgba(15,59,56,0.9) 100%)',
        borderRadius: '50px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          x: isHovered ? ['0%', '200%'] : '-100%',
          opacity: isHovered ? [0, 0.3, 0] : 0
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transform: 'skewX(-20deg)' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

const DragonEye = React.memo(() => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const throttledMouseUpdate = useCallback((e: MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => throttledMouseUpdate(e), 32); // 30fps throttle
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [throttledMouseUpdate]);

  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl" />
      
      <motion.div
        className="absolute w-20 h-20 rounded-full top-1/2 left-1/2"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #1F7A72, #0F3B38, #000)',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          x: (mousePos.x - 0.5) * 20,
          y: (mousePos.y - 0.5) * 20
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        <div className="absolute w-8 h-8 bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-3 h-3 bg-white rounded-full opacity-80 top-1/4 left-1/4" />
      </motion.div>
      
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-transparent animate-pulse" />
    </div>
  );
});

const ParallaxSection = ({ children, offset = 0.5, className = "" }: { children: React.ReactNode; offset?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100 * offset, -100 * offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

const PredictiveHoverCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  const [isPredicted, setIsPredicted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let mouseVelocity = { x: 0, y: 0 };
    let lastMouse = { x: 0, y: 0 };
    let predictiveTimer: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      mouseVelocity.x = e.clientX - lastMouse.x;
      mouseVelocity.y = e.clientY - lastMouse.y;
      lastMouse = { x: e.clientX, y: e.clientY };

      const rect = card.getBoundingClientRect();
      const predictedX = e.clientX + mouseVelocity.x * 10;
      const predictedY = e.clientY + mouseVelocity.y * 10;

      const isHeadingTowards = 
        predictedX >= rect.left && predictedX <= rect.right &&
        predictedY >= rect.top && predictedY <= rect.bottom &&
        (Math.abs(mouseVelocity.x) > 2 || Math.abs(mouseVelocity.y) > 2);

      if (isHeadingTowards && !isPredicted) {
        clearTimeout(predictiveTimer);
        predictiveTimer = setTimeout(() => setIsPredicted(true), 100);
      } else if (!isHeadingTowards && isPredicted) {
        clearTimeout(predictiveTimer);
        predictiveTimer = setTimeout(() => setIsPredicted(false), 200);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(predictiveTimer);
    };
  }, [isPredicted]);

  return (
    <motion.div
      ref={cardRef}
      className="relative p-8 rounded-2xl backdrop-blur-md border border-white/10 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      }}
      animate={{
        scale: isPredicted ? 1.02 : 1,
        y: isPredicted ? -5 : 0
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      whileHover={{ scale: 1.05, y: -10 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#1F7A72]/20 to-transparent"
        animate={{ opacity: isPredicted ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const MatrixPortal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  const [digits, setDigits] = useState<Array<{
    id: number;
    char: string;
    x: number;
    y: number;
    speed: number;
    opacity: number;
    trail: Array<{x: number; y: number; opacity: number}>;
  }>>([]);
  
  useEffect(() => {
    if (isOpen) {
      const newDigits = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        char: String.fromCharCode(0x30A0 + Math.random() * 96),
        x: Math.random() * 100,
        y: -10,
        speed: 0.2 + Math.random() * 0.4,
        opacity: Math.random(),
        trail: []
      }));
      setDigits(newDigits);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setDigits(prev => prev.map(digit => {
        const newDigit = {
          ...digit,
          y: digit.y > 110 ? -10 : digit.y + digit.speed,
          char: Math.random() < 0.02 ? String.fromCharCode(0x30A0 + Math.random() * 96) : digit.char,
          opacity: 0.2 + Math.sin(Date.now() * 0.001 + digit.id) * 0.3
        };
        
        newDigit.trail = [...(digit.trail || []), { x: digit.x, y: digit.y, opacity: digit.opacity * 0.3 }].slice(-8);
        
        return newDigit;
      }));
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <div className="absolute inset-0 overflow-hidden">
        {digits.map(digit => (
          <div key={digit.id}>
            {digit.trail?.map((trailPoint, idx) => (
              <motion.div
                key={`${digit.id}-trail-${idx}`}
                className="absolute text-green-400 font-mono text-lg"
                style={{
                  left: `${trailPoint.x}%`,
                  top: `${trailPoint.y}%`,
                  opacity: trailPoint.opacity * (idx / 8)
                }}
              >
                {digit.char}
              </motion.div>
            ))}
            
            <motion.div
              className="absolute text-green-400 font-mono text-lg"
              style={{
                left: `${digit.x}%`,
                top: `${digit.y}%`,
                opacity: digit.opacity
              }}
              animate={{
                opacity: [digit.opacity * 0.5, digit.opacity, digit.opacity * 0.7]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {digit.char}
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotateZ: 360, rotateX: 90 }}
        animate={{ scale: 1, rotateZ: 0, rotateX: 0 }}
        transition={{ 
          duration: 2.5, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.8 
        }}
        className="absolute inset-0 flex items-center justify-center perspective-1000"
      >
        <motion.div 
          className="relative max-w-4xl mx-auto p-8 bg-black/90 backdrop-blur-xl rounded-3xl border border-green-400/40"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0,255,0,0.2)', 
              '0 0 40px rgba(0,255,0,0.4)', 
              '0 0 20px rgba(0,255,0,0.2)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 text-green-400 hover:text-white text-2xl"
            whileHover={{ scale: 1.2, rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            ×
          </motion.button>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const GlitchText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative ${className}`}>
      {children}
      {isGlitching && (
        <>
          <span className="absolute inset-0 text-red-500 animate-pulse" style={{ transform: 'translate(-2px, 0)' }}>
            {children}
          </span>
          <span className="absolute inset-0 text-blue-500 animate-pulse" style={{ transform: 'translate(2px, 0)' }}>
            {children}
          </span>
        </>
      )}
    </span>
  );
};


const FrameEconomics = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [cursorEffect, setCursorEffect] = useState<'matrix' | 'earth' | 'none'>('matrix');
  const [showHeartExplosion, setShowHeartExplosion] = useState(false);

  const handleShowAbout = useCallback(() => setShowAbout(true), []);
  const handleCloseAbout = useCallback(() => setShowAbout(false), []);
  
  const triggerHeartExplosion = useCallback(() => {
    setShowHeartExplosion(true);
    setTimeout(() => setShowHeartExplosion(false), 4000); // Reset after 4 seconds
  }, []);
  
  // Trigger heart explosion randomly every 30-60 seconds
  useEffect(() => {
    const randomTrigger = () => {
      const delay = 30000 + Math.random() * 30000; // 30-60 seconds
      setTimeout(() => {
        triggerHeartExplosion();
        randomTrigger(); // Set up next random trigger
      }, delay);
    };
    randomTrigger();
  }, [triggerHeartExplosion]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      <NeuralBackground />
      {cursorEffect === 'matrix' && <MatrixLightning />}
      {cursorEffect === 'earth' && <EarthGodTrail />}
      <Navigation />
      
      {/* Floating Cursor Effect Toggle */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
            cursorEffect === 'matrix' 
              ? 'bg-green-400/20 border-green-400/60 text-green-400' 
              : 'bg-black/30 border-white/20 text-gray-400 hover:border-green-400/40'
          }`}
          onClick={() => setCursorEffect('matrix')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Matrix Lightning Trail"
        >
          ⚡
        </motion.button>
        
        <motion.button
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
            cursorEffect === 'earth' 
              ? 'bg-green-600/20 border-green-600/60 text-green-300' 
              : 'bg-black/30 border-white/20 text-gray-400 hover:border-green-600/40'
          }`}
          onClick={() => setCursorEffect('earth')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Earth God Trail"
        >
          🌿
        </motion.button>
        
        <motion.button
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
            cursorEffect === 'none' 
              ? 'bg-gray-600/20 border-gray-600/60 text-gray-300' 
              : 'bg-black/30 border-white/20 text-gray-400 hover:border-gray-600/40'
          }`}
          onClick={() => setCursorEffect('none')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="No Cursor Effects"
        >
          🚫
        </motion.button>
        
        {/* Heart Explosion Trigger */}
        <motion.button
          className="p-3 rounded-full backdrop-blur-md border bg-pink-600/20 border-pink-600/60 text-pink-400 hover:bg-pink-600/30 transition-all duration-300"
          onClick={triggerHeartExplosion}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          title="Trigger Heart Explosion!"
          animate={{
            boxShadow: [
              '0 0 0px rgba(236, 72, 153, 0)',
              '0 0 20px rgba(236, 72, 153, 0.6)',
              '0 0 0px rgba(236, 72, 153, 0)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ❤️
        </motion.button>
      </motion.div>
      
      {/* Epic Heart Explosion Effect */}
      <AnimatePresence>
        {showHeartExplosion && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main Heart */}
            <motion.div
              className="text-[20rem] relative"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.4, 1.8, 1.0, 0],
                rotate: [0, 10, -10, 5, 0],
              }}
              transition={{ 
                duration: 4,
                times: [0, 0.3, 0.6, 0.8, 1]
              }}
            >
              {/* Big Red Heart */}
              <motion.span
                style={{
                  color: '#ff1744',
                  filter: 'drop-shadow(0 0 40px rgba(255, 23, 68, 0.9)) drop-shadow(0 0 80px rgba(255, 23, 68, 0.6))',
                  textShadow: '0 0 30px rgba(255, 23, 68, 0.8)'
                }}
                animate={{
                  filter: [
                    'drop-shadow(0 0 40px rgba(255, 23, 68, 0.9)) drop-shadow(0 0 80px rgba(255, 23, 68, 0.6))',
                    'drop-shadow(0 0 60px rgba(255, 23, 68, 1)) drop-shadow(0 0 120px rgba(255, 23, 68, 0.8))',
                    'drop-shadow(0 0 40px rgba(255, 23, 68, 0.9)) drop-shadow(0 0 80px rgba(255, 23, 68, 0.6))'
                  ]
                }}
                transition={{ duration: 2, repeat: 2 }}
              >
                ❤️
              </motion.span>
              
              {/* Heart explosion particles */}
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ 
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 0
                  }}
                  animate={{
                    scale: [0, 1, 0.5, 0],
                    x: [0, (Math.cos(i * 18 * Math.PI / 180) * 200)],
                    y: [0, (Math.sin(i * 18 * Math.PI / 180) * 200)],
                    opacity: [0, 1, 0.7, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    delay: 1,
                    ease: 'easeOut'
                  }}
                >
                  💖
                </motion.div>
              ))}
              
              {/* Love wave rings */}
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute inset-0 border-4 border-pink-400/40 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{
                    scale: [0, 8],
                    opacity: [0.8, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    delay: 0.5 + i * 0.3,
                    ease: 'easeOut'
                  }}
                />
              ))}
              
              {/* Sparkle shower */}
              {Array.from({ length: 30 }, (_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute text-lg"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ 
                    scale: 0,
                    y: -100,
                    opacity: 0,
                    rotate: 0
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    y: [-100, 200],
                    opacity: [0, 1, 0],
                    rotate: [0, 720]
                  }}
                  transition={{
                    duration: 3,
                    delay: 1.5 + Math.random() * 1,
                    ease: 'easeOut'
                  }}
                >
                  ✨
                </motion.div>
              ))}
              
              {/* EPIC DRAGON LOGO */}
              <motion.div
                className="absolute text-8xl"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ 
                  scale: 0,
                  rotate: -180,
                  opacity: 0,
                  x: 200,
                  y: -200
                }}
                animate={{
                  scale: [0, 0.8, 1.2, 1, 0.5, 0],
                  rotate: [-180, -90, 0, 15, -15, 0],
                  opacity: [0, 0.8, 1, 1, 0.8, 0],
                  x: [200, 100, 0, -20, 20, 0],
                  y: [-200, -100, 0, 10, -10, 0]
                }}
                transition={{
                  duration: 4.5,
                  delay: 0.8,
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  ease: 'easeOut'
                }}
              >
                <motion.span
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.8)) drop-shadow(0 0 40px rgba(255, 69, 0, 0.6))',
                    textShadow: '0 0 30px rgba(255, 140, 0, 0.9)'
                  }}
                  animate={{
                    filter: [
                      'drop-shadow(0 0 20px rgba(255, 107, 53, 0.8)) drop-shadow(0 0 40px rgba(255, 69, 0, 0.6))',
                      'drop-shadow(0 0 40px rgba(255, 107, 53, 1)) drop-shadow(0 0 80px rgba(255, 69, 0, 0.8))',
                      'drop-shadow(0 0 20px rgba(255, 107, 53, 0.8)) drop-shadow(0 0 40px rgba(255, 69, 0, 0.6))'
                    ]
                  }}
                  transition={{ duration: 2, repeat: 2, delay: 1 }}
                >
                  🐉
                </motion.span>
              </motion.div>
              
              {/* Dragon fire breath */}
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={`fire-${i}`}
                  className="absolute text-2xl"
                  style={{
                    left: '60%',
                    top: '48%',
                  }}
                  initial={{ 
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 0,
                    rotate: 0
                  }}
                  animate={{
                    scale: [0, 1, 0.8, 0],
                    x: [0, 80 + (i * 20)],
                    y: [0, (Math.random() - 0.5) * 40],
                    opacity: [0, 1, 0.6, 0],
                    rotate: [0, (Math.random() - 0.5) * 60]
                  }}
                  transition={{
                    duration: 2,
                    delay: 2 + (i * 0.1),
                    ease: 'easeOut'
                  }}
                >
                  🔥
                </motion.div>
              ))}
              
              {/* Dragon roar effect */}
              <motion.div
                className="absolute text-4xl font-bold text-orange-400"
                style={{
                  left: '50%',
                  top: '35%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ 
                  scale: 0,
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  scale: [0, 1.5, 1, 0],
                  opacity: [0, 1, 0.8, 0],
                  y: [20, -10, -20, -40]
                }}
                transition={{
                  duration: 2.5,
                  delay: 1.8,
                  ease: 'easeOut'
                }}
              >
                ROARRR! 🔥
              </motion.div>
            </motion.div>
            
            {/* Text that appears */}
            <motion.div
              className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-pink-400"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [50, 0, -10, -30],
                scale: [0.8, 1.2, 1, 0.9]
              }}
              transition={{ 
                duration: 3,
                delay: 2,
                times: [0, 0.3, 0.8, 1]
              }}
              style={{
                textShadow: '0 0 20px rgba(236, 72, 153, 0.8)'
              }}
            >
              LOVE THE PROCESS! 💫
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <section className="min-h-screen flex items-center justify-center relative px-6 pt-20">
              <ParallaxSection offset={0.3} className="text-center max-w-6xl mx-auto">
                <motion.div variants={itemVariants} className="mb-12">
                  <DragonEye />
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="relative text-8xl md:text-9xl font-black mb-6 tracking-tight"
                >
                  {/* Static TV effect overlay - tighter around text */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                  >
                    {Array.from({ length: 80 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-px h-px bg-white"
                        style={{
                          left: `${25 + Math.random() * 50}%`,
                          top: `${15 + Math.random() * 70}%`,
                        }}
                        animate={{
                          opacity: [0, 0.8, 0],
                          x: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
                          y: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]
                        }}
                        transition={{
                          duration: 0.08,
                          repeat: Infinity,
                          delay: Math.random() * 1
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Smoke/Steam effects */}
                  {Array.from({ length: 12 }, (_, i) => (
                    <motion.div
                      key={`smoke-${i}`}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        left: `${10 + (i * 8)}%`,
                        top: '90%',
                        width: `${8 + Math.random() * 16}px`,
                        height: `${8 + Math.random() * 16}px`,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(128,128,128,0.2) 50%, transparent 100%)',
                        filter: `blur(${2 + Math.random() * 3}px)`
                      }}
                      animate={{
                        y: [0, -80, -120],
                        scale: [0.5, 1.2, 2],
                        opacity: [0.8, 0.4, 0]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}

                  {/* Pound/Impact waves */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    {/* Impact ring effects */}
                    {Array.from({ length: 3 }, (_, i) => (
                      <motion.div
                        key={`ring-${i}`}
                        className="absolute inset-0 border-2 border-white/10 rounded-lg"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: 'easeOut'
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Main text with enhanced effects */}
                  <motion.div
                    className="relative z-10 leading-[0.85] select-none"
                    style={{
                      perspective: '1000px',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* FRAME text with 3D rotation */}
                    <motion.h1
                      className="text-8xl md:text-9xl font-black tracking-tight"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #00ffff 25%, #1F7A72 50%, #FF3B30 75%, #ffffff 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        backgroundSize: '200% 200%',
                        textShadow: '0 0 40px rgba(31,122,114,0.4)',
                        filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.3)) drop-shadow(0 0 10px rgba(255,255,255,0.2))'
                      }}
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        rotateX: [0, 2, -2, 0],
                        rotateY: [0, -3, 3, 0],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{
                        backgroundPosition: {
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear'
                        },
                        rotateX: {
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        },
                        rotateY: {
                          duration: 5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        },
                        scale: {
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }
                      }}
                    >
                      <motion.span
                        className="inline-block"
                        animate={{
                          x: [0, -2, 2, -1, 1, 0],
                          y: [0, -1, 1, 0]
                        }}
                        transition={{
                          duration: 0.15,
                          repeat: Infinity,
                          repeatDelay: 6,
                          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                        }}
                      >
                        FRAME
                      </motion.span>
                    </motion.h1>
                    
                    {/* ECONOMICS text with wave effect */}
                    <motion.h1
                      className="text-8xl md:text-9xl font-black -mt-6 md:-mt-8 tracking-tight"
                      style={{
                        background: 'linear-gradient(135deg, #FF3B30 0%, #ff6b35 25%, #1F7A72 50%, #00ffff 75%, #ffffff 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        backgroundSize: '200% 200%',
                        textShadow: '0 0 40px rgba(255,59,48,0.3)',
                        filter: 'drop-shadow(0 0 20px rgba(255,107,53,0.3)) drop-shadow(0 0 10px rgba(255,255,255,0.2))'
                      }}
                      animate={{
                        backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                        rotateX: [0, -2, 2, 0],
                        rotateY: [0, 3, -3, 0],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{
                        backgroundPosition: {
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear'
                        },
                        rotateX: {
                          duration: 5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        },
                        rotateY: {
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        },
                        scale: {
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.5
                        }
                      }}
                    >
                      {/* Animated individual letters */}
                      {'ECONOMICS'.split('').map((letter, i) => (
                        <motion.span
                          key={i}
                          className="inline-block"
                          animate={{
                            y: [0, -5 * Math.sin((i + 1) * 0.5), 0],
                            rotateZ: [0, 2 * Math.sin((i + 1) * 0.3), 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: 'easeInOut'
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </motion.h1>
                    
                    {/* Glowing underline effect */}
                    <motion.div
                      className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #00ffff, #ffffff, #ff6b35, transparent)',
                        width: '80%',
                        filter: 'blur(1px)',
                        boxShadow: '0 0 20px rgba(0,255,255,0.6)'
                      }}
                      animate={{
                        scaleX: [0.5, 1, 0.5],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.div>

                  {/* Electric sparks around the text */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <motion.div
                      key={`spark-${i}`}
                      className="absolute w-1 h-4 pointer-events-none"
                      style={{
                        left: `${15 + (i * 10)}%`,
                        top: `${20 + (i % 2 * 60)}%`,
                        background: 'linear-gradient(180deg, #00ffff 0%, #ffffff 50%, transparent 100%)',
                        filter: 'blur(0.5px) drop-shadow(0 0 4px #00ffff)',
                        transformOrigin: 'bottom'
                      }}
                      animate={{
                        scaleY: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30]
                      }}
                      transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatDelay: 2 + Math.random() * 3,
                        delay: i * 0.1
                      }}
                    />
                  ))}

                  {/* Glitch bars */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.05, repeat: Infinity, repeatDelay: 8 }}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <motion.div
                        key={`glitch-${i}`}
                        className="absolute w-full h-2 bg-cyan-400/30"
                        style={{
                          top: `${20 * i}%`,
                          mixBlendMode: 'screen'
                        }}
                        animate={{
                          x: ['-100%', '100%'],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{
                          duration: 0.1,
                          delay: i * 0.02
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
                
                <motion.p
                  variants={itemVariants}
                  className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  Master the hidden psychology that shapes reality. 
                  <span className="text-[#1F7A72] font-semibold"> Transform perception. Control outcomes.</span>
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex gap-6 justify-center flex-wrap">
                  <LiquidButton onClick={() => window.location.href = '/matrix'}>
                    Enter The Matrix
                  </LiquidButton>
                  <LiquidButton 
                    className="bg-transparent border border-white/30"
                    onClick={() => window.location.href = '/demo'}
                  >
                    Experience Demo
                  </LiquidButton>
                  <LiquidButton 
                    className="bg-gradient-to-r from-red-600/80 to-blue-600/80 border border-cyan-400/50"
                    onClick={handleShowAbout}
                    isSpecial={true}
                  >
                    🛹 KICKFLIP REALITY 🛹
                  </LiquidButton>
                </motion.div>
              </ParallaxSection>
            </section>

            <section id="mastery" className="py-32 px-6 relative">
              <ParallaxSection offset={0.2}>
                <div className="max-w-7xl mx-auto">
                  <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl font-bold text-center mb-20"
                  >
                    Psychological <span className="text-[#1F7A72]">Mastery</span>
                  </motion.h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PredictiveHoverCard
                      icon="🧠"
                      title="Neural Mapping"
                      description="Decode decision-making patterns using advanced behavioral analysis. Understand the subconscious drivers behind every choice."
                    />
                    <PredictiveHoverCard
                      icon="⚡"
                      title="Influence Architecture"
                      description="Build systematic approaches to ethical persuasion. Engineer outcomes through strategic frame positioning."
                    />
                    <PredictiveHoverCard
                      icon="🎭"
                      title="Reality Engineering"
                      description="Master the art of perspective control. Shape how others perceive situations, opportunities, and outcomes."
                    />
                  </div>
                </div>
              </ParallaxSection>
            </section>

            <section id="experience" className="py-32 px-6 relative">
              <ParallaxSection offset={-0.1}>
                <div className="max-w-4xl mx-auto text-center">
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl font-bold mb-12"
                  >
                    Watch Your Mind <span className="text-[#FF3B30]">Adapt</span>
                  </motion.h2>
                  
                  <motion.div
                    className="bg-black/30 backdrop-blur-lg rounded-3xl p-12 border border-white/10"
                    whileInView={{ rotateX: [5, 0], opacity: [0, 1] }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  >
                    <p className="text-2xl text-gray-300 mb-8">
                      Notice how this interface responds to your behavior? 
                      <br />
                      <span className="text-[#1F7A72]">That's frame control in action.</span>
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <div className="text-left">
                        <h4 className="text-xl font-semibold text-[#1F7A72] mb-3">What You're Experiencing:</h4>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Neural network responds to your cursor</li>
                          <li>• Interface predicts your intentions</li>
                          <li>• Visual hierarchy guides your attention</li>
                          <li>• Color psychology influences emotion</li>
                        </ul>
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-semibold text-[#FF3B30] mb-3">Psychological Techniques:</h4>
                        <ul className="text-gray-300 space-y-2">
                          <li>• Anchoring through visual metaphors</li>
                          <li>• Scarcity via exclusive terminology</li>
                          <li>• Authority through technical mastery</li>
                          <li>• Social proof via interaction design</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ParallaxSection>
            </section>

            <section id="contact" className="py-32 px-6 relative">
              <ParallaxSection offset={0.1}>
                <div className="max-w-4xl mx-auto text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-6xl font-bold mb-8 relative overflow-hidden"
                  >
                    <motion.div
                      animate={{
                        x: [0, -2, 2, -1, 1, 0],
                        y: [0, -1, 1, -0.5, 0.5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2
                      }}
                  >
                    <span className="relative inline-block">
                      Ready to{' '}
                      <motion.span 
                        className="text-[#1F7A72] relative inline-block"
                        animate={{
                          x: [0, -3, 3, -2, 2, 0],
                          y: [0, -2, 2, -1, 1, 0]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1.5
                        }}
                      >
                        Transcend
                        {/* Melting drips */}
                        <motion.div
                          className="absolute -bottom-2 left-2 w-1 bg-[#1F7A72] rounded-full"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: [0, 20, 25, 30],
                            opacity: [0, 0.8, 0.6, 0]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: 3
                          }}
                        />
                        <motion.div
                          className="absolute -bottom-2 right-4 w-0.5 bg-[#1F7A72] rounded-full"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: [0, 15, 20, 25],
                            opacity: [0, 0.9, 0.7, 0]
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: 3.8
                          }}
                        />
                        <motion.div
                          className="absolute -bottom-2 left-1/2 w-0.5 bg-[#1F7A72] rounded-full"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: [0, 18, 22, 28],
                            opacity: [0, 0.7, 0.5, 0]
                          }}
                          transition={{
                            duration: 4.2,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: 2.5
                          }}
                        />
                      </motion.span>
                      ?
                    </span>
                    
                    {/* Additional melting effect from the entire text */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1F7A72] to-transparent"
                      animate={{
                        opacity: [0, 0.8, 0.4, 0],
                        scaleX: [0, 1.2, 0.8, 0]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 4
                      }}
                    />
                    </motion.div>
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-2xl text-gray-300 mb-12"
                  >
                    Join the select few who understand reality's operating system
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <LiquidButton onClick={() => window.location.href = 'mailto:contact@frameeconomics.com'}>
                      Claim Your Access
                    </LiquidButton>
                  </motion.div>
                </div>
              </ParallaxSection>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matrix Portal About Page */}
      <AnimatePresence>
        {showAbout && (
          <MatrixPortal isOpen={showAbout} onClose={handleCloseAbout}>
            <div className="text-green-400">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {/* Terminal Header */}
                <div className="mb-8 text-center font-mono">
                  <motion.div
                    animate={{
                      opacity: [0, 1, 1, 0, 1]
                    }}
                    transition={{ duration: 0.1, repeat: 3, repeatDelay: 0.5 }}
                    className="text-green-400 text-sm mb-2"
                  >
                    INITIATING QUANTUM FINANCIAL SCAN...
                  </motion.div>
                  
                  {/* Barcode Scanner Animation */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-black p-4 rounded border border-green-400/30">
                      <div className="font-mono text-xs text-green-400 mb-2">ENTITY_BARCODE:</div>
                      <motion.div 
                        className="flex space-x-1"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        {[1,0,1,1,0,1,0,0,1,1,0,1,0,1,1,0,0,1,0,1,1,0,1,0,0,1].map((bar, i) => (
                          <div 
                            key={i}
                            className={`bg-green-400 ${bar ? 'w-1' : 'w-0.5'} h-8`}
                          />
                        ))}
                      </motion.div>
                      <div className="text-xs text-green-400 mt-1">DAE-LYT3-7749-X1</div>
                    </div>
                  </div>

                  {/* Financial Ticker */}
                  <div className="bg-black/80 border border-yellow-400/50 p-2 rounded mb-4 overflow-hidden">
                    <motion.div 
                      className="flex space-x-8 text-xs whitespace-nowrap"
                      animate={{ x: [300, -800] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="text-green-400">💰 DAECOINS: +847.23% ▲</span>
                      <span className="text-red-400">📈 NVDA: $892.45 ▼</span>
                      <span className="text-yellow-400">₿ BTC: $67,840 ▲</span>
                      <span className="text-blue-400">💎 ETH: $3,240 ▲</span>
                      <span className="text-purple-400">🚀 TSLA: $245.67 ▼</span>
                      <span className="text-cyan-400">💡 AMZN: $3,456 ▲</span>
                      <span className="text-pink-400">🔥 FRAME: $∞ ▲▲▲</span>
                      <span className="text-green-400">¥ RARE_EARTH: +234% ▲</span>
                      <span className="text-orange-400">€ NEURAL_NET: $777.77 ▲</span>
                    </motion.div>
                  </div>
                  
                  <div className="border border-green-400/30 bg-black/70 p-4 rounded-lg mb-6">
                    <div className="text-xs text-green-600 mb-2 flex items-center justify-between">
                      <span>PARALLEL_UNIVERSE_DATABASE &gt; ENTITY_SCAN &gt; DAELYTE.exe</span>
                      <div className="flex space-x-2 text-xs">
                        <span className="text-yellow-400">💳 AMEX</span>
                        <span className="text-blue-400">💳 VISA</span>
                        <span className="text-green-400">💳 MC</span>
                        <span className="text-purple-400">💰 CRYPTO</span>
                      </div>
                    </div>
                    
                    <div className="text-green-400 mb-2">
                      <span className="animate-pulse">█</span> SCANNING DIMENSIONAL SIGNATURES...
                    </div>
                    
                    {/* Struggling Progress Bar */}
                    <div className="relative">
                      <div className="w-full bg-gray-800 h-3 rounded overflow-hidden">
                        <motion.div 
                          className="h-full rounded transition-colors duration-300"
                          initial={{ width: "0%", backgroundColor: "#ef4444" }}
                          animate={{
                            width: ["0%", "15%", "12%", "28%", "25%", "45%", "40%", "67%", "63%", "82%", "78%", "95%", "92%", "98%", "100%", "120%"],
                            backgroundColor: [
                              "#ef4444", "#ef4444", "#ef4444", "#f59e0b", "#f59e0b", "#f59e0b", 
                              "#eab308", "#eab308", "#84cc16", "#84cc16", "#22c55e", "#22c55e", 
                              "#10b981", "#00ff00", "#00ff00", "#00ffff"
                            ]
                          }}
                          transition={{ 
                            duration: 4, 
                            times: [0, 0.1, 0.12, 0.25, 0.27, 0.4, 0.42, 0.6, 0.62, 0.75, 0.77, 0.85, 0.87, 0.92, 0.95, 1],
                            delay: 1.5 
                          }}
                        />
                      </div>
                      
                      {/* Overflow effect */}
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-cyan-400 opacity-0"
                        animate={{ 
                          opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                          width: ["100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "120%", "150%"]
                        }}
                        transition={{ duration: 4, delay: 1.5, times: [0, 0.1, 0.12, 0.25, 0.27, 0.4, 0.42, 0.6, 0.62, 0.75, 0.77, 0.85, 0.87, 0.92, 0.95, 1] }}
                      />
                      
                      {/* Progress Text */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                        animate={{
                          color: ["#ef4444", "#ef4444", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#00ff00", "#00ffff"]
                        }}
                        transition={{ duration: 4, delay: 1.5 }}
                      >
                        <motion.span
                          initial={{ opacity: 1 }}
                          animate={{ opacity: [1, 1, 1, 1, 1, 1, 1, 0, 1] }}
                          transition={{ duration: 4, delay: 1.5, times: [0, 0.7, 0.75, 0.8, 0.85, 0.9, 0.92, 0.95, 1] }}
                        >
                          BREACH DETECTED
                        </motion.span>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      className="text-xs mt-2 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                        color: ["#00ff00", "#00ffff", "#ff00ff", "#00ff00"]
                      }}
                      transition={{ 
                        duration: 4, 
                        delay: 1.5,
                        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.92, 0.95, 1]
                      }}
                    >
                      FIREWALL BYPASSED | REALITY.EXE COMPROMISED
                    </motion.div>
                  </div>

                  <GlitchText>
                    <h2 className="text-4xl font-bold text-white mb-4">MULTIVERSE ENTITY LOCATED</h2>
                  </GlitchText>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                    <div className="bg-black/50 p-3 rounded border border-green-400/20">
                      <div className="text-cyan-400">UNIVERSE α-7749</div>
                      <div className="text-white">TECH SALES SPECIALIST</div>
                      <div className="text-green-400 text-xs">STATUS: ACTIVE</div>
                      <div className="text-xs text-yellow-400 mt-1">💰 $$ REVENUE_STREAM</div>
                    </div>
                    <div className="bg-black/50 p-3 rounded border border-blue-400/20">
                      <div className="text-blue-400">UNIVERSE β-2184</div>
                      <div className="text-white">NIGHTLIFE ARCHITECT</div>
                      <div className="text-blue-400 text-xs">STATUS: SYNCHRONOUS</div>
                      <div className="text-xs text-purple-400 mt-1">🎭 INFLUENCE_CAPITAL</div>
                    </div>
                    <div className="bg-black/50 p-3 rounded border border-purple-400/20">
                      <div className="text-purple-400">UNIVERSE γ-9021</div>
                      <div className="text-white">REALITY ENGINEER</div>
                      <div className="text-purple-400 text-xs">STATUS: TRANSCENDENT</div>
                      <div className="text-xs text-green-400 mt-1">∞ UNLIMITED_POTENTIAL</div>
                    </div>
                  </div>
                </div>

                {/* Simple Terminal Content */}
                <div className="space-y-4 max-h-96 overflow-y-auto font-mono text-sm bg-black/90 p-6 rounded-lg border border-green-400/30">
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3, duration: 0.8 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="text-cyan-400 flex-shrink-0">[SCAN_001]</span>
                    <div className="text-green-400">
                      <div>🔭 CURRENT_OPERATIONS_DETECTED...</div>
                      <div className="ml-4 mt-2 space-y-1">
                        <div>&gt; Building_career_in_tech_sales.exe 💰 HIGH_ROI</div>
                        <div>&gt; Focus_onboarding_post_sales_management.dll ₿ +127%</div>
                        <div>&gt; Systems_optimization_specialist.mod 💎 PREMIUM</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3.5, duration: 0.8 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="text-yellow-400 flex-shrink-0">[SCAN_002]</span>
                    <div className="text-green-400">
                      <div>🌱 SKILL_ACQUISITION_PROTOCOLS...</div>
                      <div className="ml-4 mt-2 space-y-1">
                        <div>&gt; Cloud_architecture_fundamentals.learning € AZURE_CERTS</div>
                        <div>&gt; Cybersecurity_protocols.downloading ¥ THREAT_INTEL</div>
                        <div>&gt; AI_integration_strategies.compiling $ ML_TOKENS</div>
                        <div>&gt; Technical_client_bridge_mastery.installing £ COMMISSION++</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 6, duration: 0.8 }}
                    className="border-t border-cyan-400/30 pt-4"
                  >
                    <div className="text-center">
                      <div className="text-cyan-400 mb-4">🚀 ACTIVE_PROJECT_TRANSMISSION_DETECTED</div>
                      <motion.div
                        animate={{ 
                          boxShadow: [
                            '0 0 20px rgba(0,255,255,0.3)', 
                            '0 0 40px rgba(0,255,255,0.6)', 
                            '0 0 20px rgba(0,255,255,0.3)'
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="inline-block p-4 bg-black/90 rounded-lg border border-cyan-400"
                      >
                        <div className="text-cyan-300 text-xs mb-2">QUANTUM_LINK_ESTABLISHED:</div>
                        <a 
                          href="https://icecoldfroste.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-cyan-400 transition-colors font-bold"
                        >
                          https://icecoldfroste.com/
                        </a>
                        <div className="mt-2 text-xs text-green-400">
                          STATUS: <span className="animate-pulse text-green-300">DIMENSION_BRIDGE_ACTIVE</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 6.5, duration: 0.8 }}
                    className="bg-gray-900/50 p-4 rounded border border-gray-600 text-xs"
                  >
                    <div className="text-gray-400 mb-2">// ENCRYPTED_WISDOM_PROTOCOLS_DETECTED:</div>
                    <div className="text-gray-300 space-y-1 italic">
                      <div>consciousness.anger_detection() → mind.capture_prevent()</div>
                      <div>lake.disturbed() → ripples.fade() → truth.reflect()</div>
                      <div>bamboo.flexibility() &gt; mountain.rigid_pride()</div>
                      <div>sun.walk_toward() → shadows.auto_behind()</div>
                      <div>human.stumble() + nature.rise() === growth.infinite()</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 7, duration: 0.8 }}
                    className="text-center pt-4 border-t border-green-400/30"
                  >
                    <div className="text-green-400 font-mono text-xs mb-2">
                      CONTACT_PROTOCOLS_ESTABLISHED:
                    </div>
                    <div className="space-y-1">
                      <div>
                        GITHUB_LINK: <a href="https://github.com/Daelyte" className="text-cyan-400 hover:text-white">github.com/Daelyte</a>
                      </div>
                      <div className="text-gray-400 text-xs">
                        PRONOUNS: he/him | AUTHENTICATION: <span className="text-green-400">✓ MULTIVERSE_VERIFIED</span>
                      </div>
                    </div>
                  </motion.div>

                </div>

                <div className="mt-4 text-center">
                  <motion.div
                    animate={{ 
                      color: ['#00ff00', '#00ffff', '#ff00ff', '#00ff00']
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-xs font-mono"
                  >
                    SCAN_COMPLETE | ENTITY_CLASSIFICATION: REALITY_ARCHITECT | THREAT_LEVEL: INSPIRING
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </MatrixPortal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FrameEconomics;
