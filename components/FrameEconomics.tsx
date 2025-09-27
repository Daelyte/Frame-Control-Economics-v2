import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

    const nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.08, // Much slower base speed
      vy: (Math.random() - 0.5) * 0.08,
      baseVx: (Math.random() - 0.5) * 0.08,
      baseVy: (Math.random() - 0.5) * 0.08,
      size: 3 + Math.random() * 4,
      baseSize: 3 + Math.random() * 4,
      morphTimer: Math.random() * Math.PI * 2,
      morphSpeed: 0.003 + Math.random() * 0.002, // Very slow morphing
      connections: [],
      shape: Math.floor(Math.random() * 4), // 0: circle, 1: triangle, 2: square, 3: diamond
      nextShape: Math.floor(Math.random() * 4),
      morphProgress: 0,
      morphing: false
    }));

    let time = 0;

    const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: number, morphProgress = 0, nextShape = 0) => {
      ctx.save();
      ctx.translate(x, y);
      
      if (morphProgress > 0 && morphProgress < 1) {
        // Morphing between shapes
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
        case 0: // Circle
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          break;
        case 1: // Triangle
          ctx.moveTo(0, -size);
          ctx.lineTo(-size * 0.866, size * 0.5);
          ctx.lineTo(size * 0.866, size * 0.5);
          ctx.closePath();
          break;
        case 2: // Square
          ctx.rect(-size, -size, size * 2, size * 2);
          break;
        case 3: // Diamond
          ctx.moveTo(0, -size);
          ctx.lineTo(size, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size, 0);
          ctx.closePath();
          break;
      }
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005; // Very slow time progression
      
      // Neural network animation
      nodes.forEach((node, i) => {
        // Update morph timer
        node.morphTimer += node.morphSpeed;
        
        // Trigger morphing occasionally
        if (!node.morphing && Math.sin(node.morphTimer) > 0.99) {
          node.morphing = true;
          node.nextShape = (node.shape + 1) % 4;
          node.morphProgress = 0;
        }
        
        // Update morph progress
        if (node.morphing) {
          node.morphProgress += 0.01; // Slow morphing
          if (node.morphProgress >= 1) {
            node.shape = node.nextShape;
            node.morphing = false;
            node.morphProgress = 0;
          }
        }
        
        // Bullet-time movement with wave distortion
        const waveX = Math.sin(time + node.y * 0.01) * 0.02;
        const waveY = Math.cos(time + node.x * 0.01) * 0.02;
        
        node.vx = node.baseVx + waveX;
        node.vy = node.baseVy + waveY;
        
        node.x += node.vx;
        node.y += node.vy;
        
        // Slow magnetic attraction to mouse
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300 && distance > 1) {
          const force = (300 - distance) / 300;
          node.vx += (dx / distance) * force * 0.00005; // Much weaker force
          node.vy += (dy / distance) * force * 0.00005;
        }
        
        // Gentle size pulsing
        const pulse = Math.sin(time * 0.5 + i * 0.2) * 0.3 + 1;
        node.size = node.baseSize * pulse;
        
        // Bounce off edges with damping
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -0.8;
          node.baseVx *= -0.8;
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -0.8;
          node.baseVy *= -0.8;
        }
        
        // Draw connections (slower fade-in/out)
        nodes.slice(i + 1).forEach(otherNode => {
          const dist = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2);
          if (dist < 150) {
            const opacity = (1 - (dist / 150)) * 0.2; // Much more subtle
            const connectionPulse = Math.sin(time * 0.3 + dist * 0.01) * 0.1 + 0.9;
            
            ctx.strokeStyle = `rgba(31, 122, 114, ${opacity * connectionPulse})`;
            ctx.lineWidth = opacity * 1.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
            
            // Add occasional data packet along connection
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
        
        // Draw morphing nodes
        const nodeDistance = Math.sqrt((mousePos.x - node.x) ** 2 + (mousePos.y - node.y) ** 2);
        const proximityHeat = Math.max(0, 1 - nodeDistance / 200);
        
        // Color based on proximity and shape
        const hue = nodeDistance < 200 ? 
          `rgba(255, ${Math.floor(59 + proximityHeat * 100)}, 48, ${0.7 + proximityHeat * 0.3})` :
          `rgba(31, 122, 114, ${0.6 + Math.sin(time + i) * 0.2})`;
        
        ctx.fillStyle = hue;
        drawShape(ctx, node.x, node.y, node.size, node.shape, node.morphProgress, node.nextShape);
      });
      
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mousePos]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(ellipse at center, #0f3b38 0%, #083230 50%, #041e1c 100%)' }}
    />
  );
};

const LiquidButton = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
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
        speed: 0.2 + Math.random() * 0.4, // Much slower falling speed
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
          char: Math.random() < 0.02 ? String.fromCharCode(0x30A0 + Math.random() * 96) : digit.char, // Less frequent changes
          opacity: 0.2 + Math.sin(Date.now() * 0.001 + digit.id) * 0.3 // Slow pulsing
        };
        
        // Add to trail for morphing effect
        newDigit.trail = [...(digit.trail || []), { x: digit.x, y: digit.y, opacity: digit.opacity * 0.3 }].slice(-8);
        
        return newDigit;
      }));
    }, 150); // Slower update rate

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }} // Slower fade in
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Slower Matrix Rain with Trails */}
      <div className="absolute inset-0 overflow-hidden">
        {digits.map(digit => (
          <div key={digit.id}>
            {/* Trail effect */}
            {digit.trail?.map((trailPoint, idx) => (
              <motion.div
                key={`${digit.id}-trail-${idx}`}
                className="absolute text-green-400 font-mono text-lg"
                style={{
                  left: `${trailPoint.x}%`,
                  top: `${trailPoint.y}%`,
                  opacity: trailPoint.opacity * (idx / 8) // Fade trail
                }}
              >
                {digit.char}
              </motion.div>
            ))}
            
            {/* Main character */}
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

      {/* Portal Content with slower entrance */}
      <motion.div
        initial={{ scale: 0, rotateZ: 360, rotateX: 90 }}
        animate={{ scale: 1, rotateZ: 0, rotateX: 0 }}
        transition={{ 
          duration: 2.5, 
          ease: [0.25, 0.46, 0.45, 0.94], // More cinematic easing
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

const FloatingIsland = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
        rotateX: [-2, 2, -2],
        rotateY: [-1, 1, -1]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      className="transform-gpu"
    >
      {children}
    </motion.div>
  );
};

const DragonEye = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-32 h-32">
      {/* Eye socket */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl" />
      
      {/* Iris */}
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
        {/* Pupil */}
        <div className="absolute w-8 h-8 bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Highlight */}
        <div className="absolute w-3 h-3 bg-white rounded-full opacity-80 top-1/4 left-1/4" />
      </motion.div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-transparent animate-pulse" />
    </div>
  );
};

const ParallaxSection = ({ children, offset = 0.5, className = "" }: { children: React.ReactNode; offset?: number; className?: string }) => {
  const ref = useRef(null);
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

      // Predict if mouse is heading towards this element
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const predictedX = e.clientX + mouseVelocity.x * 10;
      const predictedY = e.clientY + mouseVelocity.y * 10;

      const isHeadingTowards = 
        predictedX >= rect.left && predictedX <= rect.right &&
        predictedY >= rect.top && predictedY <= rect.bottom &&
        Math.abs(mouseVelocity.x) > 2 || Math.abs(mouseVelocity.y) > 2;

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

const FrameEconomics = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

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
      
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative px-6">
              <ParallaxSection offset={0.3} className="text-center max-w-6xl mx-auto">
                <motion.div variants={itemVariants} className="mb-12">
                  <DragonEye />
                </motion.div>
                
                <motion.h1
                  variants={itemVariants}
                  className="text-8xl md:text-9xl font-black mb-6 tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #1F7A72 50%, #FF3B30 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 0 30px rgba(31,122,114,0.3)'
                  }}
                >
                  <GlitchText>FRAME</GlitchText>
                  <br />
                  <GlitchText>ECONOMICS</GlitchText>
                </motion.h1>
                
                <motion.p
                  variants={itemVariants}
                  className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  Master the hidden psychology that shapes reality. 
                  <span className="text-[#1F7A72] font-semibold"> Transform perception. Control outcomes.</span>
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex gap-6 justify-center flex-wrap">
                  <FloatingIsland delay={0}>
                    <LiquidButton onClick={() => {}}>
                      Enter The Matrix
                    </LiquidButton>
                  </FloatingIsland>
                  <FloatingIsland delay={0.2}>
                    <LiquidButton 
                      className="bg-transparent border border-white/30"
                      onClick={() => {}}
                    >
                      Experience Demo
                    </LiquidButton>
                  </FloatingIsland>
                  <FloatingIsland delay={0.4}>
                    <LiquidButton 
                      className="bg-gradient-to-r from-green-600 to-teal-600"
                      onClick={() => setShowAbout(true)}
                    >
                      About Me
                    </LiquidButton>
                  </FloatingIsland>
                </motion.div>
              </ParallaxSection>
            </section>

            {/* Capabilities Section */}
            <section className="py-32 px-6 relative">
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

            {/* Interactive Demo Section */}
            <section className="py-32 px-6 relative">
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

            {/* CTA Section */}
            <section className="py-32 px-6 relative">
              <ParallaxSection offset={0.1}>
                <div className="max-w-4xl mx-auto text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl font-bold mb-8"
                  >
                    Ready to <span className="text-[#1F7A72]">Transcend</span>?
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

      {/* Matrix Portal */}
      <MatrixPortal isOpen={showAbout} onClose={() => setShowAbout(false)}>
        <div className="text-center space-y-6">
          <motion.h2 
            className="text-4xl font-bold text-green-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <GlitchText>About Me</GlitchText>
          </motion.h2>
          
          <motion.div 
            className="space-y-4 text-left max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <p className="text-green-300 leading-relaxed">
              Hello! I'm a passionate developer and researcher exploring the fascinating intersection of artificial intelligence, 
              economics, and human potential. Through Frame Economics, I aim to create immersive digital experiences that 
              help people understand complex economic concepts and AI's role in shaping our future.
            </p>
            
            <p className="text-green-300 leading-relaxed">
              My work focuses on making advanced economic theories accessible through interactive visualizations and 
              AI-powered insights. I believe that by democratizing access to economic knowledge, we can empower individuals 
              to make better decisions in an increasingly complex world.
            </p>
            
            <p className="text-green-300 leading-relaxed">
              When I'm not coding or researching, you'll find me experimenting with new technologies, contributing to 
              open-source projects, and exploring the latest developments in machine learning and blockchain technology.
            </p>
            
            <motion.div 
              className="flex justify-center mt-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href="https://frame-control.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full 
                         hover:from-green-500 hover:to-teal-500 transition-all duration-300 shadow-lg
                         border border-green-400/40 hover:shadow-green-400/30"
              >
                <GlitchText>Visit My Project: Frame Control</GlitchText>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </MatrixPortal>
    </div>
  );
};

export default FrameEconomics;