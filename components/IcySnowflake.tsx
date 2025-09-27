// components/IcySnowflake.tsx
'use client'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import * as THREE from 'three'

interface IcySnowflakeProps {
  position?: [number, number, number]
  scale?: number
  deviceTier?: 'low' | 'medium' | 'high'
}

// Blender-Generated Icy Snowflake Loader
function BlenderSnowflake({ position = [0, 0, 0], scale = 1 }: IcySnowflakeProps) {
  const snowflakeRef = useRef<THREE.Group>(null)
  
  // Try to load the Blender-generated GLB model
  let gltf
  try {
    gltf = useGLTF('/models/icy_snowflake.glb')
  } catch (error) {
    console.log('Blender snowflake GLB not found, falling back to procedural snowflake')
    return <ProceduralSnowflake position={position} scale={scale} />
  }
  
  useFrame((state) => {
    if (snowflakeRef.current) {
      const time = state.clock.elapsedTime
      
      // Magical snowflake rotation with pulsing (matching original animation)
      const pulse = Math.sin(time * 1.5) * 0.15 + 1
      snowflakeRef.current.scale.setScalar(pulse * scale)
      snowflakeRef.current.rotation.z = time * 0.3
      
      // Add a slight wobble
      snowflakeRef.current.rotation.x = Math.sin(time * 0.8) * 0.1
      snowflakeRef.current.rotation.y = Math.cos(time * 0.6) * 0.1
    }
  })

  return (
    <group ref={snowflakeRef} position={position}>
      <primitive object={gltf.scene.clone()} />
    </group>
  )
}

// Fallback Procedural Snowflake (current implementation)
function ProceduralSnowflake({ position = [0, 0, 0], scale = 1 }: IcySnowflakeProps) {
  const snowflakeRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (snowflakeRef.current) {
      const time = state.clock.elapsedTime
      
      // Magical snowflake rotation with pulsing
      const pulse = Math.sin(time * 1.5) * 0.15 + 1
      snowflakeRef.current.scale.setScalar(pulse * scale)
      snowflakeRef.current.rotation.z = time * 0.3
      
      // Add a slight wobble
      snowflakeRef.current.rotation.x = Math.sin(time * 0.8) * 0.1
      snowflakeRef.current.rotation.y = Math.cos(time * 0.6) * 0.1
    }
  })

  return (
    <group ref={snowflakeRef} position={position}>
      {/* Create 6 main branches of the snowflake directly */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <group key={`branch-group-${i}`}>
            {/* Main branch */}
            <mesh
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
            
            {/* Sub-branches */}
            {Array.from({ length: 3 }, (_, j) => (
              <mesh
                key={`sub-branch-${j}`}
                position={[
                  Math.cos(angle) * (0.2 + j * 0.15),
                  Math.sin(angle) * (0.2 + j * 0.15),
                  0
                ]}
                rotation={[0, 0, angle + (j % 2 === 0 ? Math.PI / 6 : -Math.PI / 6)]}
                scale={[0.7, 0.7, 0.7]}
              >
                <cylinderGeometry args={[0.01, 0.01, 0.3, 6]} />
                <meshPhysicalMaterial
                  color="#ADD8E6" // Light blue
                  emissive="#87CEEB" // Sky blue
                  emissiveIntensity={0.3}
                  metalness={0.6}
                  roughness={0.2}
                  clearcoat={0.8}
                  transmission={0.4}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

// Main IcySnowflake component with error boundary
export default function IcySnowflake(props: IcySnowflakeProps) {
  const { deviceTier = 'medium' } = props
  
  // On low-end devices, always use procedural version
  if (deviceTier === 'low') {
    return (
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <ProceduralSnowflake {...props} />
      </Float>
    )
  }
  
  // For medium and high-end devices, try Blender version first
  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
      <React.Suspense fallback={<ProceduralSnowflake {...props} />}>
        <BlenderSnowflake {...props} />
      </React.Suspense>
    </Float>
  )
}

// Preload the GLB model
useGLTF.preload('/models/icy_snowflake.glb')