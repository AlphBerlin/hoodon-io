'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import * as THREE from 'three'

interface VideoWindowProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  children: React.ReactNode
}

export function VideoWindow({ position, rotation, children }: VideoWindowProps) {
  const ref = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    // Subtle floating animation
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
    // Follow mouse on hover
    if (hovered) {
      const x = (state.mouse.x * viewport.width) / 4
      const y = (state.mouse.y * viewport.height) / 4
      ref.current.lookAt(new Vector3(x, y, 0))
    }
  })

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Html
        transform
        distanceFactor={5}
        className="w-[200px] h-[150px] p-4 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm"
      >
        {children}
      </Html>
    </mesh>
  )
}

