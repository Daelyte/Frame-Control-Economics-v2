// components/NeuralOrb.tsx
'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface NeuralOrbProps {
  position?: [number, number, number];
  scale?: number;
  deviceTier?: 'low' | 'medium' | 'high';
}

// Neural Network Orb with pulsing energy
export default function NeuralOrb({ 
  position = [0, 0, 0], 
  scale = 1, 
  deviceTier = 'medium'
}: NeuralOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null)
  const networkRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Generate neural network nodes
  const networkNodes = useMemo(() => {
    const nodes: THREE.Vector3[] = []
    const nodeCount = deviceTier === 'high' ? 20 : deviceTier === 'medium' ? 12 : 8
    
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount)
      const theta = Math.sqrt(nodeCount * Math.PI) * phi
      
      const x = Math.cos(theta) * Math.sin(phi) * 1.5
      const y = Math.cos(phi) * 1.5
      const z = Math.sin(theta) * Math.sin(phi) * 1.5
      
      nodes.push(new THREE.Vector3(x, y, z))
    }
    return nodes
  }, [deviceTier])

  // Generate connections between nodes
  const connections = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = []
    
    networkNodes.forEach((node1, i) => {
      networkNodes.forEach((node2, j) => {
        if (i < j && node1.distanceTo(node2) < 2.5) {
          lines.push([node1, node2])
        }
      })
    })
    
    return lines
  }, [networkNodes])

  // Particle system for energy flow
  const particles = useMemo(() => {
    const particleCount = deviceTier === 'high' ? 50 : deviceTier === 'medium' ? 30 : 15
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.5 + Math.random() * 2
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      
      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi)
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
      positions[i * 3 + 2] = radius * Math.cos(theta)
    }
    
    return positions
  }, [deviceTier])

  useFrame((state) => {
    if (orbRef.current) {
      // Pulsing core orb
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      orbRef.current.scale.setScalar(pulse)
      
      // Subtle rotation
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }

    if (networkRef.current) {
      // Network rotation
      networkRef.current.rotation.y = state.clock.elapsedTime * 0.1
      networkRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }

    if (particlesRef.current) {
      // Particle animation
      const positions = particlesRef.current.geometry.attributes.position
      const time = state.clock.elapsedTime
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const z = positions.getZ(i)
        
        // Orbital motion around the core
        const angle = time * 0.5 + i * 0.1
        const radius = Math.sqrt(x * x + z * z)
        
        positions.setX(i, Math.cos(angle) * radius)
        positions.setZ(i, Math.sin(angle) * radius)
        positions.setY(i, y + Math.sin(time * 2 + i) * 0.02)
      }
      
      positions.needsUpdate = true
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position} scale={scale}>
        {/* Central Energy Orb */}
        <mesh ref={orbRef}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#1F7A72"
            emissive="#1F7A72"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Neural Network Structure */}
        <group ref={networkRef}>
          {/* Network Nodes */}
          {networkNodes.map((node, index) => (
            <mesh key={`node-${index}`} position={[node.x, node.y, node.z]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#FF3B30"
                emissive="#FF3B30"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}

          {/* Network Connections */}
          {connections.map(([start, end], index) => {
            const direction = new THREE.Vector3().subVectors(end, start)
            const length = direction.length()
            const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
            
            return (
              <mesh key={`connection-${index}`} position={[midpoint.x, midpoint.y, midpoint.z]}>
                <cylinderGeometry args={[0.01, 0.01, length, 4]} />
                <meshStandardMaterial
                  color="#9BB0A7"
                  emissive="#9BB0A7"
                  emissiveIntensity={0.2}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            )
          })}
        </group>

        {/* Energy Particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#1F7A72"
            size={0.05}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </Float>
  )
}

// Fallback Geometric Neural Network (when GLB is not available)
export function GeometricNeuralOrb({ position = [0, 0, 0], scale = 1 }: NeuralOrbProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#1F7A72"
          emissive="#1F7A72"
          emissiveIntensity={0.3}
          wireframe
        />
      </mesh>

      {/* Orbital Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#9BB0A7"
          emissive="#9BB0A7"
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#FF3B30"
          emissive="#FF3B30"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}