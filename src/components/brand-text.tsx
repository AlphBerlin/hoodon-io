'use client'

import { useRef, useEffect } from 'react'
import {useFrame, useLoader, useThree} from '@react-three/fiber'
import * as THREE from 'three'
import {useGLTF} from "@react-three/drei";
import {Vector3} from "three";

export function BrandText({ position }: { position: number[] }) {
  const ref = useRef<THREE.Group>(null)
  const gltf = useGLTF('/asset/hoods/3d/hoodon.io.glb')
  const { viewport, size } = useThree()

  useEffect(() => {
    if (ref.current) {
      // Center the object using its bounding box
      const box = new THREE.Box3().setFromObject(ref.current)
      const center = box.getCenter(new THREE.Vector3())
      ref.current.position.sub(center)
      ref.current.position.add(new THREE.Vector3(...position))

      // Scale based on viewport width (Responsive scaling)
      const scaleFactor = Math.min(viewport.width / 4, 1.5)
      ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor)
    }
  }, [gltf, viewport])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      ref.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
      <group ref={ref}>
        <primitive object={gltf.scene} />
      </group>
  )
}
