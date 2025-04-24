import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {Button} from "@/components/ui/button";

interface PhotoCarouselProps {
  photos: string[]
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
    }, 5000) // Change photo every 5 seconds

    return () => clearInterval(timer)
  }, [photos.length])

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
  }

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={photos[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-2">
        {photos.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      {/*<Button
        onClick={prevPhoto}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        onClick={nextPhoto}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
      >
        <ChevronRight size={24} />
      </Button>*/}
    </div>
  )
}

