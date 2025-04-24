'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { mockLifestyleOptions } from '@/utils/mock-data'
import type { Profile } from '@/types/profile'

interface LifestyleFormProps {
  onComplete: () => void
  onBack: () => void
}

export function LifestyleForm({ onComplete, onBack }: LifestyleFormProps) {
  const [selections, setSelections] = useState<Profile['lifestyle']>({})
  const [loading, setLoading] = useState(false)
  const [openOption, setOpenOption] = useState<string | null>(null)

  const handleComplete = async () => {
    setLoading(true)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoading(false)
    onComplete()
  }

  const handleSelect = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key.toLowerCase()]: value }))
    setOpenOption(null)
  }

  return (
    <div className="space-y-2 p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2 -ml-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-bold">Lifestyle</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {mockLifestyleOptions.map((option) => (
          <motion.button
            key={option.title}
            onClick={() => setOpenOption(option.title)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl">{option.title}</span>
            <div className="flex items-center gap-2 text-gray-500">
              <span>{selections[option.title.toLowerCase() as keyof Profile['lifestyle']] || ''}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.button>
        ))}
      </motion.div>

      <Dialog open={!!openOption} onOpenChange={() => setOpenOption(null)}>
        <DialogContent className="sm:max-w-[425px] p-6">
          {openOption && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">{openOption}?</h2>
              </div>
              <div className="space-y-3">
                {mockLifestyleOptions
                  .find(opt => opt.title === openOption)
                  ?.options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleSelect(openOption, option)}
                      className="w-full h-14 text-lg rounded-2xl bg-white border-2 border-gray-200 text-black hover:bg-gray-50"
                    >
                      {option}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Button 
        onClick={handleComplete}
        disabled={loading || Object.keys(selections).length === 0}
        className="w-full h-14 text-lg rounded-2xl bg-gray-900 text-white hover:bg-gray-800 mt-8"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Confirming...
          </div>
        ) : (
          'CONFIRM'
        )}
      </Button>
    </div>
  )
}

