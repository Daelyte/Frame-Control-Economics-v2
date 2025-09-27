// components/CrystalPrisms.tsx
'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface CrystalPrismsProps {
  count?: number;
  deviceTier?: 'low' | 'medium' | 'high';
}

// Individual Crystal Prism
function CrystalPrism({ 
  position, 
  rotation, 
  scale, 
  variant = 0 
}: { 
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  variant: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation around multiple axes
      meshRef.current.rotation.x += 0.003 + variant * 0.001
      meshRef.current.rotation.y += 0.005 + variant * 0.002
      meshRef.current.rotation.z += 0.002 + variant * 0.001

      // Subtle scale pulsing
      const pulse = Math.sin(state.clock.elapsedTime + variant * 2) * 0.1 + 1
      meshRef.current.scale.setScalar(scale * pulse)
    }
  })

  // Different prism geometries based on variant
  const geometry = useMemo(() => {
    switch (variant % 3) {
      case 0:
        // Triangular prism
        const triangleShape = new THREE.Shape()
        triangleShape.moveTo(0, 1)
        triangleShape.lineTo(-0.87, -0.5)
        triangleShape.lineTo(0.87, -0.5)
        triangleShape.lineTo(0, 1)
        return new THREE.ExtrudeGeometry(triangleShape, { depth: 1, bevelEnabled: false })
        
      case 1:
        // Hexagonal prism
        const hexShape = new THREE.Shape()
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 0.8
          const y = Math.sin(angle) * 0.8
          if (i === 0) hexShape.moveTo(x, y)
          else hexShape.lineTo(x, y)
        }
        hexShape.lineTo(Math.cos(0) * 0.8, Math.sin(0) * 0.8)
        return new THREE.ExtrudeGeometry(hexShape, { depth: 0.6, bevelEnabled: false })
        
      case 2:
      default:
        // Octahedron-like crystal
        return new THREE.OctahedronGeometry(0.8, 0)
    }
  }, [variant])

  return (
    <Float 
      speed={1 + variant * 0.5} 
      rotationIntensity={0.3 + variant * 0.1} 
      floatIntensity={0.4 + variant * 0.2}
    >
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        geometry={geometry}
        scale={scale}
      >
        <meshPhysicalMaterial
          color="#1F7A72"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
          emissive="#0F3B38"
          emissiveIntensity={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  )
}

// Main Crystal Prisms Component
export default function CrystalPrisms({ count = 8, deviceTier = 'medium' }: CrystalPrismsProps) {
  // Adjust count based on device performance
  const actualCount = useMemo(() => {
    switch (deviceTier) {
      case 'high': return count
      case 'medium': return Math.max(4, Math.floor(count * 0.7))
      case 'low': return Math.max(2, Math.floor(count * 0.4))
      default: return count
    }
  }, [count, deviceTier])

  // Generate prism positions and properties
  const prisms = useMemo(() => {
    const result = []
    
    for (let i = 0; i < actualCount; i++) {
      // Distribute prisms in a large sphere around the scene
      const phi = Math.acos(-1 + (2 * i) / actualCount)
      const theta = Math.sqrt(actualCount * Math.PI) * phi
      
      const radius = 8 + Math.random() * 4 // 8-12 units from center
      const x = Math.cos(theta) * Math.sin(phi) * radius
      const y = (Math.cos(phi) * radius) + Math.random() * 4 - 2 // Some vertical variation
      const z = Math.sin(theta) * Math.sin(phi) * radius

      result.push({
        id: i,
        position: [x, y, z] as [number, number, number],
        rotation: [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.4, // 0.3 - 0.7 scale
        variant: i,
      })
    }
    
    return result
  }, [actualCount])

  return (
    <group>
      {prisms.map((prism) => (
        <CrystalPrism
          key={prism.id}
          position={prism.position}
          rotation={prism.rotation}
          scale={prism.scale}
          variant={prism.variant}
        />
      ))}
    </group>
  )
}

// Simplified CSS-based crystal fallback
export function CSSCrystalPrisms({ count = 6 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`absolute animate-float opacity-30`}
          style={{
            left: `${10 + (i * 15) % 70}%`,
            top: `${20 + (i * 11) % 60}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        >
          {/* CSS Crystal Shape */}
          <div
            className={`w-8 h-8 bg-gradient-to-br from-primary-400/20 to-primary-600/40 
                       backdrop-blur-sm border border-primary-400/30 
                       ${i % 3 === 0 ? 'rotate-45' : i % 3 === 1 ? 'rounded-full' : ''}`}
            style={{
              clipPath: i % 3 === 2 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
            }}
          />
        </div>
      ))}
    </div>
  )
}