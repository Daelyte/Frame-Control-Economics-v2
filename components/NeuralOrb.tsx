// components/NeuralOrb.tsx - Magical Snowflake with Dragon Balls
'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'

interface NeuralOrbProps {
  position?: [number, number, number];
  scale?: number;
  deviceTier?: 'low' | 'medium' | 'high';
}

// Magical Snowflake with Dragon Ball Network
export default function NeuralOrb({ 
  position = [0, 0, 0], 
  scale = 1, 
  deviceTier = 'medium'
}: NeuralOrbProps) {
  const networkRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const connectionsRef = useRef<THREE.Group>(null)
  const snowflakeRef = useRef<THREE.Group>(null)

  // Generate dragon ball positions (7 dragon balls arranged in a sphere)
  const dragonBalls = useMemo(() => {
    const balls: { position: THREE.Vector3; stars: number }[] = []
    const ballCount = 7 // Classic 7 dragon balls
    
    for (let i = 0; i < ballCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / ballCount)
      const theta = Math.sqrt(ballCount * Math.PI) * phi
      
      const radius = deviceTier === 'high' ? 2.5 : deviceTier === 'medium' ? 2.2 : 2.0
      const x = Math.cos(theta) * Math.sin(phi) * radius
      const y = Math.cos(phi) * radius
      const z = Math.sin(theta) * Math.sin(phi) * radius
      
      balls.push({
        position: new THREE.Vector3(x, y, z),
        stars: i + 1 // 1-7 stars for each dragon ball
      })
    }
    return balls
  }, [deviceTier])

  // Generate magical dancing connections between dragon balls
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3; id: number }[] = []
    
    dragonBalls.forEach((ball1, i) => {
      dragonBalls.forEach((ball2, j) => {
        if (i < j && ball1.position.distanceTo(ball2.position) < 4.0) {
          lines.push({
            start: ball1.position,
            end: ball2.position,
            id: i * 10 + j // Unique ID for each connection
          })
        }
      })
    })
    
    return lines
  }, [dragonBalls])

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

    // Magical snowflake rotation
    if (snowflakeRef.current) {
      const pulse = Math.sin(time * 1.5) * 0.15 + 1
      snowflakeRef.current.scale.setScalar(pulse)
      snowflakeRef.current.rotation.z = time * 0.3
      
      // Add a slight wobble
      snowflakeRef.current.rotation.x = Math.sin(time * 0.8) * 0.1
      snowflakeRef.current.rotation.y = Math.cos(time * 0.6) * 0.1
    }

    if (networkRef.current) {
      // Dragon balls orbital dance
      networkRef.current.rotation.y = time * 0.15
      networkRef.current.rotation.x = Math.sin(time * 0.7) * 0.2
    }

    if (connectionsRef.current) {
      // Dancing connection sticks - unique wave patterns
      connectionsRef.current.children.forEach((connection, index) => {
        if (connection instanceof THREE.Mesh) {
          // Each stick dances differently based on its index
          const phase = index * 0.5
          const waveSpeed = 2 + (index % 3) * 0.5
          const amplitude = 0.1 + (index % 4) * 0.05
          
          // Sine wave dance
          connection.rotation.z = Math.sin(time * waveSpeed + phase) * amplitude
          connection.rotation.x = Math.cos(time * (waveSpeed * 0.7) + phase) * amplitude
          
          // Scale pulsing
          const scalePulse = Math.sin(time * 3 + phase) * 0.2 + 1
          connection.scale.y = scalePulse
          
          // Color shifting through material
          if (connection.material instanceof THREE.MeshStandardMaterial) {
            const hue = (time * 0.5 + index * 0.3) % 1
            connection.material.color.setHSL(0.15 + hue * 0.3, 0.8, 0.5) // Golden to orange shifts
            connection.material.emissiveIntensity = Math.sin(time * 2 + phase) * 0.1 + 0.3
          }
        }
      })
    }

    if (particlesRef.current) {
      // Magical ice particles swirling around
      const positions = particlesRef.current.geometry.attributes.position
      
      for (let i = 0; i < positions.count; i++) {
        const originalRadius = 1 + Math.random() * 2
        const angle = time * 0.3 + i * 0.1
        const height = Math.sin(time + i * 0.5) * 0.5
        
        positions.setX(i, Math.cos(angle) * originalRadius)
        positions.setZ(i, Math.sin(angle) * originalRadius)
        positions.setY(i, height)
      }
      
      positions.needsUpdate = true
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
      <group position={position} scale={scale}>
        {/* Central Icy Blue Snowflake */}
        <group ref={snowflakeRef}>
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2
            return (
              <mesh
                key={`snowflake-${i}`}
                position={[Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0]}
                rotation={[0, 0, angle]}
              >
                <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                <meshPhysicalMaterial
                  color="#87CEEB" // Sky blue
                  emissive="#4169E1" // Royal blue
                  emissiveIntensity={0.4}
                  metalness={0.8}
                  roughness={0.1}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  transmission={0.3}
                  thickness={0.2}
                />
              </mesh>
            )
          })}
        </group>

        {/* Dragon Ball Network */}
        <group ref={networkRef}>
          {/* Dragon Balls with Stars */}
          {dragonBalls.map((ball, index) => (
            <group key={`dragonball-${index}`} position={[ball.position.x, ball.position.y, ball.position.z]}>
              {/* Main Dragon Ball */}
              <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshPhysicalMaterial
                  color="#FF8C00" // Dark orange
                  emissive="#FFD700" // Gold
                  emissiveIntensity={0.3}
                  metalness={0.2}
                  roughness={0.3}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                />
              </mesh>
              
              {/* Star pattern on each ball */}
              {Array.from({ length: ball.stars }, (_, starIndex) => (
                <Text
                  key={`star-${starIndex}`}
                  position={[
                    Math.cos(starIndex * (2 * Math.PI / ball.stars)) * 0.12,
                    Math.sin(starIndex * (2 * Math.PI / ball.stars)) * 0.12,
                    0.16
                  ]}
                  fontSize={0.08}
                  color="#DC143C" // Crimson red
                  anchorX="center"
                  anchorY="middle"
                >
                  ★
                </Text>
              ))}
            </group>
          ))}
        </group>

        {/* Dancing Magic Connections */}
        <group ref={connectionsRef}>
          {connections.map((connection) => {
            const direction = new THREE.Vector3().subVectors(connection.end, connection.start)
            const length = direction.length()
            const midpoint = new THREE.Vector3().addVectors(connection.start, connection.end).multiplyScalar(0.5)
            
            // Calculate rotation to align cylinder with direction
            const quaternion = new THREE.Quaternion()
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
            
            return (
              <mesh 
                key={`connection-${connection.id}`} 
                position={[midpoint.x, midpoint.y, midpoint.z]}
                quaternion={quaternion}
              >
                <cylinderGeometry args={[0.02, 0.02, length, 8]} />
                <meshStandardMaterial
                  color="#FFD700" // Gold
                  emissive="#FF8C00" // Dark orange
                  emissiveIntensity={0.4}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
            )
          })}
        </group>

        {/* Magical Ice Particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#B0E0E6" // Powder blue
            size={0.08}
            transparent
            opacity={0.7}
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