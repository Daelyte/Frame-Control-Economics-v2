// components/NeuralOrb.tsx - Optimized Snowflake with Fiery Skulls
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

// Optimized Snowflake with Fiery Skulls Network
export default function NeuralOrb({ 
  position = [0, 0, 0], 
  scale = 1, 
  deviceTier = 'medium'
}: NeuralOrbProps) {
  const networkRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const connectionsRef = useRef<THREE.Group>(null)
  const snowflakeRef = useRef<THREE.Group>(null)

  // Generate fiery skull positions (reduced to 5 for better performance)
  const fieryskulls = useMemo(() => {
    const skulls: { position: THREE.Vector3; id: number }[] = []
    const skullCount = 5 // Reduced for performance
    
    for (let i = 0; i < skullCount; i++) {
      const angle = (i / skullCount) * Math.PI * 2
      const radius = deviceTier === 'high' ? 3.0 : deviceTier === 'medium' ? 2.5 : 2.2
      const height = (Math.random() - 0.5) * 1.5 // Random height variation
      
      skulls.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ),
        id: i
      })
    }
    return skulls
  }, [deviceTier])

  // Generate simple connections between skulls (only to center)
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3; id: number }[] = []
    const center = new THREE.Vector3(0, 0, 0)
    
    fieryskulls.forEach((skull, i) => {
      lines.push({
        start: center,
        end: skull.position,
        id: i
      })
    })
    
    return lines
  }, [fieryskulls])

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
    const time = state.clock.elapsedTime

    // Simple snowflake rotation
    if (snowflakeRef.current) {
      snowflakeRef.current.rotation.z = time * 0.2
    }

    // Simple skull network rotation
    if (networkRef.current) {
      networkRef.current.rotation.y = time * 0.1
    }

    // Simple fire particles animation
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
      
      for (let i = 0; i < positions.count; i++) {
        const angle = time * 0.5 + i * 0.2
        const radius = 0.3 + Math.sin(time * 2 + i) * 0.2
        const height = Math.sin(time * 1.5 + i * 0.3) * 1.5
        
        positions.setX(i, Math.cos(angle) * radius)
        positions.setZ(i, Math.sin(angle) * radius)
        positions.setY(i, height)
      }
      
      positions.needsUpdate = true
    }
  })

  return (
    <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position} scale={scale}>
        {/* Simple Icy Snowflake Center */}
        <group ref={snowflakeRef}>
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2
            return (
              <mesh
                key={`snowflake-${i}`}
                position={[Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0]}
                rotation={[0, 0, angle]}
              >
                <cylinderGeometry args={[0.015, 0.015, 0.8, 6]} />
                <meshStandardMaterial
                  color="#87CEEB"
                  emissive="#4169E1"
                  emissiveIntensity={0.2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )
          })}
        </group>

        {/* Fiery Skull Network */}
        <group ref={networkRef}>
          {fieryskulls.map((skull) => (
            <group key={`skull-${skull.id}`} position={[skull.position.x, skull.position.y, skull.position.z]}>
              {/* Skull Shape - simplified */}
              <mesh>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial
                  color="#8B0000" // Dark red
                  emissive="#FF4500" // Orange red
                  emissiveIntensity={0.5}
                />
              </mesh>
              
              {/* Eye sockets */}
              <mesh position={[-0.04, 0.02, 0.1]}>
                <sphereGeometry args={[0.02, 6, 6]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
              <mesh position={[0.04, 0.02, 0.1]}>
                <sphereGeometry args={[0.02, 6, 6]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
              
              {/* Fire particles around skull */}
              <points>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array([
                      0.1, 0.1, 0, -0.1, 0.1, 0, 0, 0.15, 0.05,
                      0.08, -0.05, 0, -0.08, -0.05, 0, 0.05, 0.12, -0.03
                    ]), 3]}
                  />
                </bufferGeometry>
                <pointsMaterial
                  color="#FF6347"
                  size={0.03}
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                />
              </points>
            </group>
          ))}
        </group>

        {/* Simple Connections */}
        <group ref={connectionsRef}>
          {connections.map((connection) => {
            const direction = new THREE.Vector3().subVectors(connection.end, connection.start)
            const length = direction.length()
            const midpoint = new THREE.Vector3().addVectors(connection.start, connection.end).multiplyScalar(0.5)
            
            const quaternion = new THREE.Quaternion()
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
            
            return (
              <mesh 
                key={`connection-${connection.id}`} 
                position={[midpoint.x, midpoint.y, midpoint.z]}
                quaternion={quaternion}
              >
                <cylinderGeometry args={[0.008, 0.008, length, 6]} />
                <meshStandardMaterial
                  color="#696969"
                  emissive="#2F2F2F"
                  emissiveIntensity={0.2}
                />
              </mesh>
            )
          })}
        </group>

        {/* Fire Particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#FF6347" // Fire orange
            size={0.05}
            transparent
            opacity={0.6}
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