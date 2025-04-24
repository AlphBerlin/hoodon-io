'use client'

import React, {useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {cn} from '@/lib/utils'

const benefits: Array<{
    title: string;
    description: string;
    icons: Array<React.ReactElement<any, any>>;
}> = [
    {
        title: "Unlimited free matches",
        description: "Enjoy unlimited daily matching",
        icons: []
    },
    {
        title: "Enhanced Privacy",
        description: "Advanced security features for your peace of mind",
        icons: []
    },
    {
        title: "Premium Features",
        description: "Access to exclusive premium features",
        icons: []
    },
    {
        title: "Priority Support",
        description: "24/7 dedicated customer support",
        icons: []
    }
]

export function BenefitsCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % benefits.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="w-full max-w-md mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Get HoodOn Plus
            </h2>

            <div className="relative h-48">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.5}}
                        className="absolute inset-0"
                    >
                        <div className="flex justify-center gap-4 mb-6">
                            {benefits[currentSlide].icons.map((icon, index) => (
                                <div
                                    key={index}
                                    className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center"
                                >
                                    {/*{icon}*/}
                                </div>
                            ))}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{benefits[currentSlide].title}</h3>
                        <p className="text-gray-600">{benefits[currentSlide].description}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                {benefits.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            currentSlide === index ? "bg-primary w-4" : "bg-gray-300"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}

