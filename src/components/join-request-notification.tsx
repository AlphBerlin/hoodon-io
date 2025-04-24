import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JoinRequest } from "@/types/types";

// Custom hook for handling notification sound
const useNotificationSound = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element
        audioRef.current = new Audio("/sounds/ringtone.mp3");
        if (audioRef.current) {
            audioRef.current.loop = true;
        }

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            // Using catch to handle autoplay restrictions gracefully
            audioRef.current.play().catch(error => {
                console.log("Audio playback failed:", error);
            });
        }
    };

    const stopSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return { playSound, stopSound };
};

interface JoinRequestNotificationProps {
    request: JoinRequest;
    onAction: (approved: boolean) => void;
    duration?: number;
    onExpire?: () => void;
}

const JoinRequestNotification: React.FC<JoinRequestNotificationProps> = ({
                                                                             request,
                                                                             onAction,
                                                                             duration = 5000,
                                                                             onExpire
                                                                         }) => {
    const { playSound, stopSound } = useNotificationSound();

    useEffect(() => {
        // Start playing sound when component mounts
        playSound();

        const timer = setTimeout(() => {
            stopSound();
            onExpire?.();
        }, duration);

        return () => {
            clearTimeout(timer);
            stopSound();
        };
    }, [duration, onExpire]);

    const handleAction = (approved: boolean) => {
        stopSound();
        onAction(approved);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 z-50 max-w-md w-full mx-4"
        >
            <motion.div
                className="bg-gradient-to-r from-primary/30 to-primary/40 rounded-lg shadow-lg backdrop-blur-md p-6 border border-white/10"
                animate={{
                    scale: [1, 1.02, 1],
                    borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Ripple Effect Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-full h-full rounded-lg border-2 border-white/20 absolute"
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Content Container */}
                <div className="relative">
                    {/* Avatar and Name Section */}
                    <div className="flex items-center gap-4 mb-4">
                        <motion.div
                            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
              <span className="text-xl">
                {(request.user?.display_name || 'A')[0].toUpperCase()}
              </span>
                        </motion.div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {request.user?.display_name || 'Anonymous'}
                            </h3>
                            <p className="text-sm">
                                Requesting to join
                            </p>
                        </div>
                    </div>

                    {/* Timer Bar */}
                    <motion.div
                        className="h-1 bg-white/20 rounded-full mb-4"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{
                            duration: duration / 1000,
                            ease: "linear"
                        }}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction(true)}
                            className="flex-1 py-3 rounded-lg bg-green-500/20 hover:bg-green-500/40
                       border border-green-500/30 text-white font-medium transition-colors
                       focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        >
                            Accept
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction(false)}
                            className="flex-1 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/40
                       border border-red-500/30 text-white font-medium transition-colors
                       focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        >
                            Reject
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default JoinRequestNotification;