'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import * as THREE from 'three'
import Link from "next/link";
import {useAuth} from "@/context/auth-context";

interface FloatingButtonProps {
  position: [number, number, number]
}

export function FloatingButton({ position }: FloatingButtonProps) {
  const ref = useRef<THREE.Group>(null)
  const {handleAccessAppButtonClick} = useAuth();
  
  useFrame((state) => {
    if (!ref.current) return
    // Gentle floating animation
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2
    // Subtle rotation
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
  })

  return (
    <group ref={ref} position={position}>
      <Html transform>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
            <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleAccessAppButtonClick}
            >
                Get Started — It's Free
            </Button>
        </motion.div>
      </Html>
    </group>
  )
}

