'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import {toast} from 'sonner';

export default function SharingTabs() {
    const [activeTab, setActiveTab] = useState('private')

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast("Link copied!",{
                description: "The current page URL has been copied to your clipboard.",
            })
        } catch (err) {
            console.error('Failed to copy: ', err)
            toast( "Copy failed",{
                description: "Unable to copy the link. Please try again."
            })
        }
    }

    const shareContent = () => {
        const shareText = `Join me with HoodOn! url:${window.location.href}`
        if (navigator.share) {
            navigator.share({
                title: 'Join HoodOn',
                text: shareText,
                url: window.location.href
            }).then(() => {
                //console.log('Thanks for sharing!');
            })
                .catch(console.error);
        } else {
            copyToClipboard()
        }
    }

    return (
        <div className="relative w-full max-w-md mx-auto pt-3">
            {/* Container for the badge and main content */}
            <div className="relative">
                {/* Animated Coming Soon Badge */}
                <motion.div
                    className="absolute -top-3 -right-2 z-10  rotate-45"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                >

                        <div className="h-full flex items-center justify-center bg-primary rounded-full p-1">
                            <span className="text-xs font-medium text-white">Coming Soon</span>
                        </div>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                            animate={{
                                x: ['-100%', '100%'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                </motion.div>

                {/* Main content */}
                <div className="rounded-2xl bg-white shadow-lg">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 p-1 rounded-t-2xl bg-muted">
                            <TabsTrigger
                                value="private"
                                className={cn(
                                    "rounded-xl transition-all duration-300",
                                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                                    "data-[state=active]:scale-100 data-[state=inactive]:scale-95",
                                    "hover:bg-background/50"
                                )}
                            >
                                Private
                            </TabsTrigger>
                            <TabsTrigger
                                value="public"
                                disabled
                                className={cn(
                                    "rounded-xl transition-all duration-300",
                                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                                    "data-[state=active]:scale-100 data-[state=inactive]:scale-95",
                                    "hover:bg-background/50"
                                )}
                            >
                                Match Maker
                            </TabsTrigger>
                        </TabsList>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut"
                                }}
                            >
                                <TabsContent value="private" className="mt-4 p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                readOnly
                                                value={typeof window !== 'undefined' ? window.location.href : ''}
                                                className="flex-grow"
                                            />
                                            <Button
                                                onClick={copyToClipboard}
                                                size="icon"
                                                variant="outline"
                                                className="hover:scale-105 transition-transform"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={shareContent}
                                            className="w-full hover:scale-[1.02] transition-transform"
                                            variant="default"
                                        >
                                            <Share2 className="mr-2 h-4 w-4" /> Share
                                        </Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="public" className="mt-4 p-4">
                                    <p className="text-center text-muted-foreground">
                                        Public sharing coming soon!
                                    </p>
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}