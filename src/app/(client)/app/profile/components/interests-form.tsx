'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {addOrDeleteInterests, getInterests} from "@/lib/user-api-handler"
import {Interest} from "@/types/database";
import {useUser} from "@/context/user-context";

interface InterestsFormProps {
  onComplete: () => void
  onBack: () => void
}

export function InterestsForm({ onComplete, onBack }: InterestsFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [categorizedInterests, setCategorizedInterests] = useState<Record<string, Interest[]>>({})
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const {user:userProfile , refreshUser} = useUser()

  useEffect(() => {
    let existingInterests: Record<string, string> = {}
    userProfile?.interests.map(i=>{
      existingInterests[i.id]=i.name
    })
    setSelectedInterests(existingInterests)
  }, [userProfile]);

  // Fetch interests on component mount
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setIsLoading(true)
        const interests = await getInterests()
        setCategorizedInterests(interests)
        // Set initial active category
        if (Object.keys(interests).length > 0) {
          setActiveCategory(Object.keys(interests)[0])
        }
      } catch (error) {
        console.error('Failed to fetch interests:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInterests()
  }, [])

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests(prev => {
      const newSelected = { ...prev }
      if (interest.id in newSelected) {
        delete newSelected[interest.id]
      } else {
        newSelected[interest.id] = interest.name
      }
      return newSelected
    })
  }

  const removeInterest = (interestName: string) => {
    setSelectedInterests(prev => {
      const newSelected = { ...prev }
      // Find the ID by matching the name
      const idToRemove = Object.entries(prev).find(([_, name]) => name === interestName)?.[0]
      if (idToRemove) {
        delete newSelected[idToRemove]
      }
      return newSelected
    })
  }

  const handleComplete = async () => {
    if (Object.values(selectedInterests).length < 5) return
    setLoading(true)
    await addOrDeleteInterests(Object.keys(selectedInterests))
    await refreshUser()
    setLoading(false)
    onComplete()
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    )
  }

  return (
      <div className="flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center mb-6">
            <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="mr-2 -ml-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Interests</h1>
              <p className="text-xl text-secondary/40 font-medium mt-1">
                {Object.keys(selectedInterests).length}/5+
              </p>
            </div>
          </div>

          <p className="mb-4">
            Add at least 5 interests to your profile. You'll be able to discuss, engage, and meet like-minded souls in these communities.
          </p>

          {/* Selected Interests */}
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {Object.values(selectedInterests).map(interest => (
                  <motion.button
                      key={interest}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-secondary/30 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-secondary/10 transition-colors"
                      onClick={() => removeInterest(interest)}
                  >
                    #{interest}
                    <X className="w-4 h-4" />
                  </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Categories */}
          <ScrollArea className="w-48 border-r p-4">
            {Object.keys(categorizedInterests).map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                        "w-full text-left py-2 px-3 rounded-lg transition-colors",
                        activeCategory === category
                            ? "bg-gray-100 font-medium"
                            : "hover:bg-gray-50"
                    )}
                >
                  {category}
                </button>
            ))}
          </ScrollArea>

          {/* Interests */}
          <ScrollArea className="flex-1 p-6">
            <div className="flex flex-wrap gap-3">
              {categorizedInterests[activeCategory]?.map(interest => (
                  <motion.button
                      key={interest.id}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                          "px-4 py-2 rounded-full border-2 transition-all",
                          Object.keys(selectedInterests).includes(interest.id)
                              ? "border-secondary bg-secondary/40"
                              : "border-gray-200 hover:border-gray-300"
                      )}
                      whileTap={{ scale: 0.95 }}
                  >
                    #{interest.name}
                  </motion.button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="p-6 border-t">
          <Button
              onClick={handleComplete}
              disabled={loading || Object.keys(selectedInterests).length < 5}
              className="w-full h-14 text-lg rounded-2xl"
          >
            {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Confirming...
                </div>
            ) : (
                'UPDATE'
            )}
          </Button>
        </div>
      </div>
  )
}