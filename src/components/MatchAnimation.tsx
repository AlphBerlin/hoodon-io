'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'

interface MatchAnimationProps {
  matchedUser: string
  customText?: string
  textColor?: string
  onAnimationComplete?: () => void
}

export const MatchAnimation: React.FC<MatchAnimationProps> = ({
                                                                matchedUser,
                                                                customText = "Found a Match!",
                                                                textColor = "#4ade80",
                                                                onAnimationComplete
                                                              }) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  return (
      <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center z-50"
            onAnimationComplete={onAnimationComplete}
        >
          <div className="bg-black/30 absolute inset-0" />
          <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
          />
          <div className="relative flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: 0.3
                }}
                className="text-5xl sm:text-7xl font-black text-center tracking-tight"
                style={{
                  color: textColor,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
              {customText}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: 0.6
                }}
                className="text-2xl sm:text-3xl mt-6 font-bold"
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
            >
              {matchedUser}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
  )
}