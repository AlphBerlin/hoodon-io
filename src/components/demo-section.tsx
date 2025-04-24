'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Camera, Phone, MicOff, VideoOff, Video } from 'lucide-react'
import ThreeDAvatar from "@/components/meet-ui/3dAvatarVideo";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {HoodsPopover} from "@/components/hoods-popover";

export default function DemoSection() {
  const [cameraEnabled, setCameraEnabled] = useState(false)
    const [selectedHood, setSelectedHood] = useState<string>('/asset/hoods/man.glb');


    return (
    <section className="py-12"  id='demo'>
      <h2 className="text-3xl font-bold text-center text-foreground mb-12">See HoodOn in Action</h2>
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="bg-muted rounded-lg shadow-lg p-4 aspect-video relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {cameraEnabled ? (
           /* <video
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded"
              ref={videoRef}
            >
            </video>*/
              <ThreeDAvatar modelUrl={selectedHood}/>
          ) : (
            <div className="w-full h-full bg-background rounded flex items-center justify-center text-muted-foreground">
              Camera Off
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <Button 
              variant="secondary" 
              size="icon"
              onClick={() => {
                setCameraEnabled(!cameraEnabled);
              }}
            >
              {cameraEnabled ? (
                <VideoOff className="h-4 w-4"/>
              ) : (
                <Video className="h-4 w-4" />
              )}
            </Button>
              <Select onValueChange={(value) => setSelectedHood(value)}>
                  <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Hood" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectGroup>
                          <SelectLabel>Hoods</SelectLabel>
                          <SelectItem value="/asset/hoods/panda.glb">Panda</SelectItem>
                          <SelectItem value="/asset/hoods/raccoon.glb">Raccoon</SelectItem>
                          <SelectItem value="/asset/hoods/man.glb">Man</SelectItem>
                          <SelectItem value="/asset/hoods/blackpanther.glb">BlackPanther</SelectItem>
                      </SelectGroup>
                  </SelectContent>
              </Select>
          </div>
        </motion.div>
          <motion.p
              className="text-center mt-4 text-muted-foreground"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
          >
              Experience secure and anonymous video calls with HoodOn. Click the camera button to enable your device's camera and see a live demo.
        </motion.p>
      </div>
    </section>
  )
}

