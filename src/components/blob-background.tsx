'use client'

import { motion } from 'framer-motion'

export function BlobBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
                className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl"
                animate={{
                    x: [0, window.innerWidth - 600, 0],
                    y: [0, window.innerHeight - 600, 0],
                    scale: [1, 1.8, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: [0.6, 0.01, -0.05, 0.95], // Custom easing for natural movement
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-secondary/30 to-primary/30 blur-3xl"
                animate={{
                    x: [0, -(window.innerWidth - 600), 0],
                    y: [0, -(window.innerHeight - 600), 0],
                    scale: [1.2, 2, 1.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: [0.6, 0.01, -0.05, 0.95],
                    delay: 1, // Offset to create asymmetric movement
                }}
            />
            <motion.div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl"
                animate={{
                    x: [0, -(window.innerWidth - 500), 0],
                    y: [0, window.innerHeight - 500, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: [0.6, 0.01, -0.05, 0.95],
                    delay: 0.5,
                }}
            />
        </div>
    )
}