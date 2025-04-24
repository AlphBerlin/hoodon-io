'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, Plus, X } from 'lucide-react'
import { cn } from "@/lib/utils"

interface PhotoUploadFormProps {
  onComplete: () => void
  onBack: () => void
}

export function PhotoUploadForm({ onComplete, onBack }: PhotoUploadFormProps) {
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // const newPhotos = Array.from(files).slice(0, 9 - photos.length).map(file => URL.createObjectURL(file))
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const watermarkedImage = await addWatermark(file)
        setPhotos(prev => [...prev, watermarkedImage])
      }    }
  }

  const addWatermark = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)
        ctx.font = '30px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fillText('Dating App', 30, 50)

        resolve(canvas.toDataURL('image/jpeg'))
      }
      img.src = URL.createObjectURL(file)
    })
  }
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleComplete = async () => {
    if (photos.length === 0) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoading(false)
    onComplete()
  }

  return (
    <div className="p-6 space-y-6">
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
          <h1 className="text-3xl font-bold">Upload Photos and Videos</h1>
          <p className="text-muted-foreground mt-2">
            Make sure your first photo includes a facial photo of you.
            Users with at least 6 real photos and videos receive up to 248% more matches.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, index) => {
          const hasPhoto = photos[index]
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "aspect-square relative rounded-3xl overflow-hidden",
                "shadow-sm",
                !hasPhoto && "border-2 border-dashed border-gray-200"
              )}
            >
              {hasPhoto ? (
                <>
                  <img
                    src={photos[index]}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  <div className="rounded-full p-3 bg-secondary/40 group-hover:bg-secondary/60 transition-colors">
                    <Plus className="w-6 h-6 text-secondary" />
                  </div>
                </label>
              )}
            </motion.div>
          )
        })}
      </div>

      <Button 
        onClick={handleComplete}
        disabled={loading || photos.length === 0}
        className="w-full h-14 text-lg rounded-2xl mt-8"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading...
          </div>
        ) : (
          'Upload'
        )}
      </Button>
    </div>
  )
}

