'use client';

// Temporarily comment out imports until we set up the 3D system
// import { Suspense, useRef } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, Float } from '@react-three/drei';

// Placeholder Dragon Canvas Component
export default function DragonCanvas() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 opacity-90">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent-500/10 rounded-full blur-lg animate-bounce-gentle delay-300"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-primary-400/15 rounded-full blur-2xl animate-float delay-700"></div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Placeholder text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="text-center">
          <div className="text-6xl mb-4 text-muted-400">🐉</div>
          <p className="text-muted-400 text-sm">
            3D Dragon Loading...
          </p>
        </div>
      </div>
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