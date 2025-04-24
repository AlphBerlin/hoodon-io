'use client'

import {motion} from 'framer-motion'
import {cn} from '@/lib/utils'
import {Avatar} from '@/utils/mock-data'
import Image from "next/image"
import {SpriteSheetViewer} from "@/components/sprite-sheet"

interface AvatarGridProps {
    avatars: Avatar[]
    selectedId: string | null
    onSelect: (avatar: Avatar | null) => void
}

const config = {
    cols: 6,
    rows: 6,
    frameCount: 30,
    fps: 18,
    scale: 2,
    loop: true,
    autoplay: true,
}

// Floating animation variants
const floatingAnimation = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

export function AvatarGrid({avatars, selectedId, onSelect}: AvatarGridProps) {
    return (
        <div className="grid grid-cols-4 gap-6 p-4">
            {/* None option */}
            <motion.button
                variants={floatingAnimation}
                animate="animate"
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                }}
                whileTap={{scale: 0.95}}
                onClick={() => onSelect(null)}
                className={cn(
                    "aspect-square rounded-full flex items-center justify-center",
                    "shadow-lg transition-all duration-300",
                    selectedId === null && "ring-4 ring-primary ring-offset-2"
                )}
            >
                <Image
                    src="/asset/no-hood.png"
                    width={400}
                    height={400}
                    alt="Hide Hood"
                    className="w-full h-full text-muted-foreground"
                />
            </motion.button>

            {/* Avatar options */}
            {avatars.map((avatar) => (
                <motion.button
                    key={avatar.id}
                    variants={floatingAnimation}
                    animate="animate"
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                    }}
                    whileTap={{scale: 0.95}}
                    onClick={() => onSelect(avatar)}
                    className={cn(
                        "relative aspect-square rounded-full overflow-hidden",
                        "bg-gradient-to-br from-primary to-secondary/30",
                        "shadow-lg transition-all duration-300",
                        selectedId === avatar.id && "ring-4 ring-primary ring-offset-2"
                    )}
                >
                    <SpriteSheetViewer
                        src={avatar.spritesheet}
                        config={config}
                    />
                </motion.button>
            ))}
        </div>
    )
}

export default AvatarGrid;