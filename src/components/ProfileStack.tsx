'use client'

import React, {Suspense, useEffect, useState} from 'react'
import {AnimatePresence, motion, useAnimation, useMotionValue, useTransform} from 'framer-motion'
import {Heart, X} from 'lucide-react'
import {User} from '@/types/types'
import {Skeleton} from "@/components/ui/skeleton"
import {ProfileCard} from "@/components/ProfileCard"

interface ProfileStackProps {
    users: User[]
    onMatch: (user: User) => void
    findMatchTriggered: boolean
}

const ProfileStack = ({users, onMatch, findMatchTriggered}: ProfileStackProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState<'left' | 'right' | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const controls = useAnimation()
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-30, 30])
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
    const scale = useTransform(
        x,
        [-200, -100, 0, 100, 200],
        [0.8, 0.9, 1, 0.9, 0.8]
    )

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (findMatchTriggered) {
            handleShuffleDeck()
        }
    }, [findMatchTriggered])

    const handleShuffleDeck = async () => {
        setIsAnimating(true)
        for (let i = 0; i < 5; i++) {
            const direction = Math.random() > 0.5 ? 'right' : 'left'
            await controls.start({
                x: direction === 'right' ? 300 : -300,
                y: Math.random() * 100 - 50,
                rotate: direction === 'right' ? 30 : -30,
                transition: {duration: 0.3}
            })
            await controls.set({x: 0, y: 0, rotate: 0})
        }
        setIsAnimating(false)
        onMatch(users[Math.floor(Math.random() * users.length)])
    }

    const handleSwipe = async (swipeDirection: 'left' | 'right') => {
        if (currentIndex >= users.length || isAnimating) return

        setDirection(swipeDirection)
        setIsAnimating(true)

        await controls.start({
            x: swipeDirection === 'left' ? -300 : 300,
            rotate: swipeDirection === 'left' ? -30 : 30,
            opacity: 0,
            transition: {duration: 0.3}
        })

        if (swipeDirection === 'right') {
            onMatch(users[currentIndex])
        }

        setCurrentIndex((prev) => (prev + 1) % users.length)
        setDirection(null)
        setIsAnimating(false)
        x.set(0)
        controls.set({x: 0, rotate: 0, opacity: 1})
    }

    const handleDragEnd = (event: any, info: any) => {
        const swipe = info.offset.x
        const velocity = info.velocity.x

        if (swipe < -100 || velocity < -500) {
            handleSwipe('left')
        } else if (swipe > 100 || velocity > 500) {
            handleSwipe('right')
        } else {
            controls.start({x: 0, rotate: 0})
        }
    }

    const ProfileSkeleton :React.FC = () => (
        <div className="absolute w-full h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
            <Skeleton className="w-full h-80"/>
            <div className="p-6">
                <Skeleton className="h-8 w-3/4 mb-2"/>
                <Skeleton className="h-4 w-1/2 mb-2"/>
                <Skeleton className="h-4 w-1/3 mb-4"/>
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16"/>
                    <Skeleton className="h-6 w-16"/>
                </div>
            </div>
        </div>
    )

    return (
        <div
            className="relative h-[600px] w-[500px] max-w-sm mx-auto bg-white/5 dark:bg-gray-800/5 rounded-xl p-6 backdrop-blur-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-full w-full">
                <AnimatePresence mode="popLayout">
                    <Suspense fallback={(<ProfileSkeleton />)}>
                        {users.map((user, index) => {
                                if (index < currentIndex || index > currentIndex + 2) return null

                                const isTop = index === currentIndex
                                const secondCard = index === currentIndex + 1
                                const thirdCard = index === currentIndex + 2

                                return (
                                    <motion.div
                                        key={user.id}
                                        className={`absolute w-full h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl ${
                                            direction === 'left' ? 'border-red-500 shadow-red-500/50' :
                                                direction === 'right' ? 'border-green-500 shadow-green-500/50' : ''
                                        }`}
                                        initial={isTop ? {scale: 1, opacity: 0} : {scale: secondCard ? 0.95 : 0.9, opacity: 0}}
                                        animate={isTop ? controls : {
                                            scale: secondCard ? 0.95 : 0.9,
                                            y: secondCard ? 15 : 30,
                                            opacity: 1,
                                            zIndex: users.length - index
                                        }}
                                        exit={{x: 0, opacity: 0}}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 20
                                        }}
                                        drag={isTop && !isAnimating ? 'x' : false}
                                        dragConstraints={{left: 0, right: 0}}
                                        dragElastic={0.9}
                                        onDragEnd={handleDragEnd}
                                        style={isTop ? {
                                            x,
                                            rotate,
                                            opacity,
                                            scale,
                                            zIndex: users.length + 1
                                        } : {}}
                                        whileDrag={{cursor: 'grabbing'}}
                                    >
                                        <ProfileCard
                                            user={user}
                                            isCurrentUser={true}
                                            className="w-96 h-[500px]"
                                        />
                                    </motion.div>
                                )
                            }
                        )}
                    </Suspense>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {((isHovered && !isAnimating) || direction) && (
                    <>
                        <motion.button
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -20}}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 hidden sm:flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-red-400 text-red-400 hover:bg-red-50 transition-colors z-20"
                            whileHover={{scale: 1.1, boxShadow: "0 0 15px rgba(255,0,0,0.3)"}}
                            whileTap={{scale: 0.9}}
                            onClick={() => handleSwipe('left')}
                        >
                            <X className="w-8 h-8"/>
                        </motion.button>
                        <motion.button
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 20}}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 hidden sm:flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-green-400 text-green-400 hover:bg-green-50 transition-colors z-20"
                            whileHover={{scale: 1.1, boxShadow: "0 0 15px rgba(0,255,0,0.3)"}}
                            whileTap={{scale: 0.9}}
                            onClick={() => handleSwipe('right')}
                        >
                            <Heart className="w-8 h-8"/>
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile buttons */}
            <div className="absolute bottom-1/6 left-0 right-0 flex justify-center gap-4 sm:hidden">
                <motion.button
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-red-400 text-red-400 hover:bg-red-50 transition-colors z-20"
                    whileHover={{scale: 1.1, boxShadow: "0 0 15px rgba(255,0,0,0.3)"}}
                    whileTap={{scale: 0.9}}
                    onClick={() => handleSwipe('left')}
                >
                    <X className="w-8 h-8"/>
                </motion.button>
                <motion.button
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-green-400 text-green-400 hover:bg-green-50 transition-colors z-20"
                    whileHover={{scale: 1.1, boxShadow: "0 0 15px rgba(0,255,0,0.3)"}}
                    whileTap={{scale: 0.9}}
                    onClick={() => handleSwipe('right')}
                >
                    <Heart className="w-8 h-8"/>
                </motion.button>
            </div>
        </div>
    )
}

export default ProfileStack;