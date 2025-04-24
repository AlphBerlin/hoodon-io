// components/CalmingLoading.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// An array of friendly, humorous messages to display while loading.
const messages = [
    "Hold on, we’re brewing your content!",
    "Almost there – take a deep breath...",
    "Your content is on its way!",
    "Hang tight, magic is in the works!",
    "Good things come to those who wait!"
];

const CalmingLoading: React.FC = () => {
    const [currentMessage, setCurrentMessage] = useState<string>(messages[0]);

    // Change the message every 3 seconds to keep the loading experience lively.
    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * messages.length);
            setCurrentMessage(messages[randomIndex]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4">
            {/* Breathing Circle using Framer Motion */}
            <motion.div
                className="w-48 h-48 rounded-full bg-primary/50"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Rotating Friendly Message */}
            <AnimatePresence mode={'wait'}>
                <motion.div
                    key={currentMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6 text-xl text-primary font-semibold text-center"
                >
                    {currentMessage}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CalmingLoading;
