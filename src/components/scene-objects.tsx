'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Asset {
  url: string
  scale?: number
}

interface SceneObjectsProps {
  assets: Asset[]
  spread: number
  yRange: number
  zRange: number
}

export function SceneObjects({ assets, spread, yRange, zRange }: SceneObjectsProps) {
  const group = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime / 4) * 0.3
  })

  return (
    <group ref={group}>
      {assets.map((asset, i) => {
        const { scene } = useGLTF(asset.url)
        const scale = asset.scale || 1
        return (
          <primitive
            key={i}
            object={scene.clone()}
            position={[
              (Math.random() - 0.5) * spread,
              (Math.random() - 0.5) * yRange,
              (Math.random() - 0.5) * zRange - zRange / 2
            ]}
            scale={[scale, scale, scale]}
          />
        )
      })}
    </group>
  )
}

