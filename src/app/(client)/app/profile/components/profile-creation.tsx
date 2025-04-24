'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BasicInfoForm } from './basic-info-form'
import { LifestyleForm } from './lifestyle-form'
import { PhotoUploadForm } from './photo-upload-form'
import { InterestsForm } from './interests-form'
import { Button } from "@/components/ui/button"

const steps = ['basic', 'interests', 'photo'] as const
type Step = typeof steps[number]

export function ProfileCreation() {
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [direction, setDirection] = useState(0)

  const goToNext = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setDirection(1)
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const goToPrevious = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  return (
    <div className="md:flex md:items-center md:justify-center">
      <div className="w-full mx-auto relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentStep === 'basic' && (
              <BasicInfoForm onComplete={goToNext} />
            )}
            {/*{currentStep === 'lifestyle' && (*/}
            {/*  <LifestyleForm onComplete={goToNext} onBack={goToPrevious} />*/}
            {/*)}*/}
            {currentStep === 'interests' && (
              <InterestsForm onComplete={goToNext} onBack={goToPrevious} />
            )}
            {/*{currentStep === 'photo' && (
              <PhotoUploadForm onComplete={goToNext} onBack={goToPrevious} />
            )}*/}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

