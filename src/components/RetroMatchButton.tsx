import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface RetroMatchButtonProps {
  onClick: () => void
}

export default function RetroMatchButton({ onClick }: RetroMatchButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative group w-full sm:w-auto"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-500 animate-pulse" />
      <div className="relative px-4 sm:px-8 py-3 sm:py-4 bg-black/50 rounded-lg leading-none flex items-center justify-center">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mr-2" />
        <span className="text-secondary text-base sm:text-xl font-bold">
          Find Match
        </span>
      </div>
    </motion.button>
  )
}

