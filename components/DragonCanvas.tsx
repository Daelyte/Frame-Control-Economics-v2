'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { detectDeviceTier } from '../lib/dragonAssets';

// Dynamically import R3F components to avoid SSR issues
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Float })), { ssr: false });
const Environment = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Environment })), { ssr: false });

// Dragon 3D Model Component
function DragonModel() {
  const groupRef = useRef<any>(null);
  const [deviceTier, setDeviceTier] = useState<'low' | 'medium' | 'high'>('medium');
  
  useEffect(() => {
    setDeviceTier(detectDeviceTier());
  }, []);

  // For now, create a geometric dragon until we get real models
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={[1.5, -0.5, -1]} scale={[1.2, 1.2, 1.2]}>
        {/* Dragon Head (Main Body) */}
        <mesh position={[0, 0, 0]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[1.5, 1, 2]} />
          <meshStandardMaterial 
            color="#1F7A72" 
            metalness={0.8} 
            roughness={0.3}
            emissive="#0F3B38"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Dragon Eyes */}
        <mesh position={[-0.3, 0.2, 0.8]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial 
            color="#FF3B30" 
            emissive="#FF3B30"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0.3, 0.2, 0.8]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial 
            color="#FF3B30" 
            emissive="#FF3B30"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Dragon Horns */}
        <mesh position={[-0.2, 0.6, 0.3]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.1, 0.6, 6]} />
          <meshStandardMaterial color="#9BB0A7" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.2, 0.6, 0.3]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.1, 0.6, 6]} />
          <meshStandardMaterial color="#9BB0A7" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Dragon Snout */}
        <mesh position={[0, -0.2, 1.2]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.8]} />
          <meshStandardMaterial 
            color="#1F7A72" 
            metalness={0.7} 
            roughness={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Fallback Component for Low-End Devices
function DragonFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 opacity-90">
      {/* Animated CSS Dragon Silhouette */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stylized CSS Dragon */}
        <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2">
          <div className="relative animate-float">
            {/* Dragon Body */}
            <div className="w-32 h-16 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full opacity-80 shadow-2xl" />
            {/* Dragon Head */}
            <div className="absolute -right-8 top-1 w-20 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-90" />
            {/* Dragon Eyes */}
            <div className="absolute -right-4 top-3 w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <div className="absolute -right-1 top-3 w-2 h-2 bg-accent-500 rounded-full animate-pulse delay-75" />
            {/* Dragon Glow */}
            <div className="absolute inset-0 w-32 h-16 bg-primary-600/30 rounded-full blur-xl animate-glow" />
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-600/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent-500/10 rounded-full blur-lg animate-bounce-gentle delay-300" />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-primary-400/15 rounded-full blur-2xl animate-float delay-700" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-60" />
      </div>
    </div>
  );
}

// Loading Component
function DragonLoading() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 opacity-90">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-muted-400 animate-bounce">🐉</div>
          <p className="text-muted-300 text-sm animate-pulse">
            Summoning Dragon...
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Dragon Canvas Component
export default function DragonCanvas() {
  const [deviceTier, setDeviceTier] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoaded, setIsLoaded] = useState(false);
  const [use3D, setUse3D] = useState(false);
  
  useEffect(() => {
    const tier = detectDeviceTier();
    setDeviceTier(tier);
    setUse3D(tier !== 'low');
    
    // Simulate loading time
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!isLoaded) {
    return <DragonLoading />;
  }
  
  if (!use3D || deviceTier === 'low') {
    return <DragonFallback />;
  }
  
  return (
    <div className="absolute inset-0">
      <Suspense fallback={<DragonLoading />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ 
            antialias: deviceTier === 'high', 
            alpha: true,
            powerPreference: deviceTier === 'high' ? 'high-performance' : 'low-power'
          }}
          dpr={deviceTier === 'high' ? [1, 2] : [1, 1.5]}
          performance={{ min: 0.5 }}
          style={{ pointerEvents: 'none' }}
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.4} color="#1F7A72" />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8} 
            color="#FF3B30" 
            castShadow={deviceTier === 'high'}
          />
          <pointLight 
            position={[-5, 0, 2]} 
            intensity={0.3} 
            color="#9BB0A7" 
          />
          
          {/* Dragon Model */}
          <DragonModel />
          
          {/* Environment lighting for high-end devices */}
          {deviceTier === 'high' && (
            <Environment preset="night" background={false} />
          )}
        </Canvas>
      </Suspense>
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/60 to-primary-900/80 pointer-events-none" />
    </div>
  );
}

// Future 3D Dragon Component (will be implemented in step 6)
/*
function DragonMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={2}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#1F7A72" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
    </Float>
  );
}

function DragonCanvas3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <DragonMesh />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Suspense>
    </Canvas>
  );
}
*/