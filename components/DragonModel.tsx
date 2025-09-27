// components/DragonModel.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'

// Optional: type the GLTF result if you want more strictness
type GLTFResult = GLTF & {
  nodes?: any
  materials?: any
  animations?: any
}

export default function DragonModel(props: any) {
  // path inside public -> /models/dragon.optimized.glb
  const gltf = useGLTF('/models/dragon.optimized.glb') as GLTFResult
  const ref = useRef<THREE.Group>(null)
  const { actions, names } = useAnimations(gltf.animations, ref as any)

  useEffect(() => {
    // Play a named action if present, fallback to first animation
    const idleName = actions['Idle'] ? 'Idle' : names?.[0]
    if (idleName && actions[idleName]) {
      actions[idleName].reset().fadeIn(0.5).play()
    }
    // cleanup
    return () => {
      Object.values(actions).forEach((a: any) => a.stop && a.stop())
    }
  }, [actions, names])

  return (
    <group ref={ref as any} {...props} dispose={null}>
      <primitive object={gltf.scene} />
    </group>
  )
}

// Fallback Geometric Dragon (when GLB model is not available)
export function GeometricDragonModel(props: any) {
  const groupRef = useRef<THREE.Group>(null)
  
  return (
    <group ref={groupRef} {...props}>
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
  )
}

// recommended by drei to pre-cache GLTF
try {
  useGLTF.preload('/models/dragon.optimized.glb')
} catch (error) {
  console.log('Dragon model not found, using geometric fallback')
}