'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import { VideoWindow } from './video-window'
import { FloatingButton } from './floating-button'
import { BrandText } from './brand-text'
import { SceneObjects } from './scene-objects'
import { Clouds } from "@/components/clouds"
import { useEffect, useState } from "react"

const assetList: Array<{ url: string, scale: number }> = [
    {url: '/asset/hoods/3d/card.glb', scale: 2},
    {url: '/asset/hoods/3d/coin.glb', scale: 3},
    {url: '/asset/hoods/3d/coin.glb', scale: 1.5},
    {url: '/asset/hoods/3d/cloud1.glb', scale: 1},
    {url: '/asset/hoods/3d/cloud1.glb', scale: 0.1},
    {url: '/asset/hoods/3d/cloud1.glb', scale: 0.5},
    {url: '/asset/hoods/3d/diamond.glb', scale: 2},
    {url: '/asset/hoods/3d/thunder.glb', scale: 1},
    {url: '/asset/hoods/3d/thunder.glb', scale: 3},
]

const useResponsive = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)
        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches)
        }
        handleChange(mediaQuery)
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [breakpoint])

    return isMobile
}

const StudioLighting = () => {
    return (
        <>
            {/* Main front key light */}
            {/*<spotLight*/}
            {/*    position={[15, 8, 15]}*/}
            {/*    angle={0.4}*/}
            {/*    penumbra={1}*/}
            {/*    intensity={0.8}*/}
            {/*    color="#ffffff"*/}
            {/*    castShadow*/}
            {/*/>*/}

            {/* Top light for color emphasis */}
            <spotLight
                position={[0, 15, 0]}
                angle={0.5}
                penumbra={1}
                intensity={0.6}
                color="#f0f0ff"
                castShadow
            />

            {/* Back rim light for separation */}
            <spotLight
                position={[-5, 5, -15]}
                angle={0.3}
                penumbra={1}
                intensity={0.4}
                color="#fff5e6"
                castShadow
            />

            {/* Fill light from left */}
            <spotLight
                position={[-15, 4, 5]}
                angle={0.6}
                penumbra={1}
                intensity={0.3}
                color="#e6f0ff"
            />

            {/* Background illumination */}
            <pointLight
                position={[0, 0, -20]}
                intensity={0.2}
                color="#ffffff"
            />

            {/* Subtle ambient light for base illumination */}
            {/*<ambientLight intensity={0.15} color="#ffffff" />*/}

            {/* Hemisphere light for natural color bleeding */}
            <hemisphereLight
                groundColor="#666666"
                intensity={0.15}
            />
        </>
    )
}

export function HeroScene() {
    const isMobile = useResponsive()

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-secondary/30">
            <Canvas
                shadows
                camera={{
                    position: isMobile ? [0, 0, 15] : [0, 0, 10],
                    fov: isMobile ? 60 : 50
                }}
            >
                <StudioLighting />

                <BrandText position={[0, 2, 0]} />

                <VideoWindow position={[-4, 0, 0]} rotation={[0, 0.2, 0]}>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-orange-200 mb-2"/>
                        <p className="text-sm font-medium">Sarah</p>
                        <div className="flex gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"/>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                            <div className="w-2 h-2 rounded-full bg-red-500"/>
                        </div>
                    </div>
                </VideoWindow>

        <VideoWindow position={[4, -1, 0]} rotation={[0, -0.2, 0]}>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-200 mb-2" />
            <p className="text-sm font-medium">Mike</p>
            <div className="flex gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-red-500" />
            </div>
          </div>
        </VideoWindow>

        <FloatingButton position={[0, -3, 0]} />
        <SceneObjects assets={assetList} spread={20} yRange={10} zRange={15} />
        <Environment preset="dawn" />
      </Canvas>
    </div>
  )
}