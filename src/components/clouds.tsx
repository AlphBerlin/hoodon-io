'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Clouds() {
  const group = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime / 4) * 0.3
  })

  return (
    <group ref={group}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[
          Math.random() * 10 - 10,
          Math.random() * 10 - 5,
          Math.random() * 10 - 15
        ]}>
          <sphereGeometry args={[0.3 + Math.random() * 0.5, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.6} 
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  )
}

