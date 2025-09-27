// components/FrameShard.tsx
'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface FrameShardProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  variant?: 'thin' | 'thick' | 'corner' | 'L-shape';
  speed?: number;
  deviceTier?: 'low' | 'medium' | 'high';
}

// Individual Frame Shard
function FrameShardMesh({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1, 
  variant = 'thin',
  speed = 1 
}: FrameShardProps) {
  const meshRef = useRef<THREE.Group>(null)

  // Generate different frame geometries based on variant
  const geometry = useMemo(() => {
    switch (variant) {
      case 'thin':
        // Thin rectangular frame strip
        return new THREE.BoxGeometry(3, 0.1, 0.1)
        
      case 'thick':
        // Thicker frame strip
        return new THREE.BoxGeometry(2.5, 0.2, 0.15)
        
      case 'corner':
        // L-shaped corner frame
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(2, 0)
        shape.lineTo(2, 0.1)
        shape.lineTo(0.1, 0.1)
        shape.lineTo(0.1, 1.5)
        shape.lineTo(0, 1.5)
        shape.lineTo(0, 0)
        return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false })
        
      case 'L-shape':
      default:
        // Complex L-frame
        const lShape = new THREE.Shape()
        lShape.moveTo(0, 0)
        lShape.lineTo(1.8, 0)
        lShape.lineTo(1.8, 0.15)
        lShape.lineTo(0.15, 0.15)
        lShape.lineTo(0.15, 1.2)
        lShape.lineTo(0, 1.2)
        lShape.lineTo(0, 0)
        return new THREE.ExtrudeGeometry(lShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02 })
    }
  }, [variant])

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation and drift
      meshRef.current.rotation.x += 0.002 * speed
      meshRef.current.rotation.y += 0.003 * speed
      meshRef.current.rotation.z += 0.001 * speed
      
      // Subtle floating motion
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.001
    }
  })

  return (
    <Float 
      speed={0.5 * speed} 
      rotationIntensity={0.1} 
      floatIntensity={0.2}
    >
      <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#8a9ba8"
            metalness={0.9}
            roughness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
            emissive="#4a5a68"
            emissiveIntensity={0.05}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Main Frame Shards System
export default function FrameShard({ deviceTier = 'medium' }: { deviceTier?: 'low' | 'medium' | 'high' }) {
  // Adjust complexity based on device performance
  const shardCount = useMemo(() => {
    switch (deviceTier) {
      case 'high': return 4
      case 'medium': return 3
      case 'low': return 2
      default: return 3
    }
  }, [deviceTier])

  // Generate shard configurations
  const shards = useMemo(() => {
    const configs = []
    const variants: ('thin' | 'thick' | 'corner' | 'L-shape')[] = ['thin', 'thick', 'corner', 'L-shape']
    
    for (let i = 0; i < shardCount; i++) {
      const angle = (i / shardCount) * Math.PI * 2
      const radius = 4 + Math.random() * 2
      
      configs.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 3,
          Math.sin(angle) * radius - 2
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
        scale: 0.6 + Math.random() * 0.4,
        variant: variants[i % variants.length],
        speed: 0.8 + Math.random() * 0.4
      })
    }
    
    return configs
  }, [shardCount])

  return (
    <group>
      {shards.map((shard) => (
        <FrameShardMesh
          key={shard.id}
          position={shard.position}
          rotation={shard.rotation}
          scale={shard.scale}
          variant={shard.variant}
          speed={shard.speed}
        />
      ))}
    </group>
  )
}

// CSS-based fallback for low-end devices
export function CSSFrameShards({ count = 3 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`absolute frame-shard opacity-20`}
          style={{
            left: `${15 + (i * 25) % 50}%`,
            top: `${20 + (i * 15) % 40}%`,
            width: i % 2 === 0 ? '120px' : '80px',
            height: '8px',
            transform: `rotate(${-45 + i * 30}deg)`,
            animation: `float ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
      
      {/* L-shaped frames */}
      {Array.from({ length: Math.max(1, Math.floor(count / 2)) }, (_, i) => (
        <div
          key={`L-${i}`}
          className="absolute frame-shard opacity-15"
          style={{
            right: `${20 + i * 30}%`,
            bottom: `${25 + i * 20}%`,
            width: '60px',
            height: '60px',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 15%, 15% 15%, 15% 100%, 0% 100%)',
            animation: `float ${4 + i * 1.5}s ease-in-out infinite reverse`,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}
    </div>
  )
}