// DragonDebug.tsx - Guaranteed 3D Dragon Visibility
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, Center, Bounds, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { Suspense, useRef, useEffect } from 'react'

THREE.ColorManagement.enabled = true

function DragonModel() {
  const groupRef = useRef<THREE.Group>(null!)
  
  useEffect(() => {
    // Simple rotation animation
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.005
        groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <Bounds fit clip observe margin={1.2}>
      <Center disableZ>
        <group ref={groupRef}>
          {/* Dragon Body */}
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.8, 2, 4, 8]} />
            <meshStandardMaterial 
              color="#40E0D0" 
              emissive="#003D3D"
              emissiveIntensity={0.2}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          
          {/* Dragon Head */}
          <mesh position={[0, 0, 1.8]} rotation={[0.2, 0, 0]}>
            <coneGeometry args={[0.6, 1.5, 8]} />
            <meshStandardMaterial 
              color="#48F0E0" 
              emissive="#004040"
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          
          {/* Dragon Eyes */}
          <mesh position={[-0.25, 0.3, 2.2]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial 
              color="#FF4444"
              emissive="#FF0000"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0.25, 0.3, 2.2]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial 
              color="#FF4444"
              emissive="#FF0000"
              emissiveIntensity={0.8}
            />
          </mesh>
          
          {/* Dragon Wings */}
          <mesh position={[-1.2, 0.5, 0]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[1.5, 2]} />
            <meshStandardMaterial 
              color="#38D0C0"
              transparent={true}
              opacity={0.8}
              side={THREE.DoubleSide}
              emissive="#002020"
              emissiveIntensity={0.1}
            />
          </mesh>
          <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[1.5, 2]} />
            <meshStandardMaterial 
              color="#38D0C0"
              transparent={true}
              opacity={0.8}
              side={THREE.DoubleSide}
              emissive="#002020"
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* Dragon Tail */}
          <mesh position={[0, -0.2, -2.5]} rotation={[0.3, 0, 0]}>
            <coneGeometry args={[0.3, 2, 6]} />
            <meshStandardMaterial 
              color="#30C0B0" 
              emissive="#002020"
              emissiveIntensity={0.2}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
          
          {/* Particle Effect */}
          <mesh position={[0, 0.5, 2.8]}>
            <Sphere args={[0.1]}>
              <meshStandardMaterial 
                color="#FFFF00"
                emissive="#FFAA00"
                emissiveIntensity={1.0}
                transparent={true}
                opacity={0.6}
              />
            </Sphere>
          </mesh>
        </group>
      </Center>
    </Bounds>
  )
}

interface DragonDebugProps {
  visible?: boolean;
}

export default function DragonDebug({ visible = false }: DragonDebugProps) {
  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      height: '200px',
      border: '2px solid #40E0D0',
      borderRadius: '8px',
      overflow: 'hidden',
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.8)'
    }}>
      {/* Debug Label */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        color: '#40E0D0',
        fontSize: '12px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        zIndex: 10001,
        textShadow: '0 0 4px rgba(0,0,0,0.8)'
      }}>
        🐉 3D Dragon Debug
      </div>

      <Canvas
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
        camera={{ position: [3, 2, 4], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#0b0f14']} />
        
        <Suspense fallback={null}>
          <Stage 
            intensity={1.2} 
            preset="rembrandt" 
            environment="city"
            shadows={false}
          >
            <DragonModel />
          </Stage>
        </Suspense>
        
        <OrbitControls 
          makeDefault 
          enableDamping 
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI * 0.75}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>

      {/* Performance Info */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        color: '#40E0D0',
        fontSize: '10px',
        fontFamily: 'monospace',
        zIndex: 10001,
        textShadow: '0 0 4px rgba(0,0,0,0.8)'
      }}>
        R3F + React 19 + Three.js 0.180
      </div>
    </div>
  )
}