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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;
      
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
        
        nodes.slice(i + 1).forEach(otherNode => {
          const dist = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2);
          if (dist < 150) {
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
};

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
                  FRAME
                  <br />
                  ECONOMICS
                </motion.h1>
                
                <motion.p
                  variants={itemVariants}
                  className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  Master the hidden psychology that shapes reality. 
                  <span className="text-[#1F7A72] font-semibold"> Transform perception. Control outcomes.</span>
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex gap-6 justify-center flex-wrap">
                  <LiquidButton onClick={() => {}}>
                    Enter The Matrix
                  </LiquidButton>
                  <LiquidButton 
                    className="bg-transparent border border-white/30"
                    onClick={() => {}}
                  >
                    Experience Demo
                  </LiquidButton>
                  <LiquidButton 
                    className="bg-gradient-to-r from-red-600/80 to-blue-600/80 border border-cyan-400/50"
                    onClick={() => setShowAbout(true)}
                  >
                    🔍 Discover Daelyte
                  </LiquidButton>
                </motion.div>
              </ParallaxSection>
            </section>

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

      {/* Matrix Portal About Page */}
      <AnimatePresence>
        {showAbout && (
          <MatrixPortal isOpen={showAbout} onClose={() => setShowAbout(false)}>
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
