import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SpriteSheetConfig } from '@/types/types';
import { cn } from "@/lib/utils";

interface SpriteSheetViewerProps {
    src: string;
    config: SpriteSheetConfig;
    className?: string;
    onComplete?: () => void;
    onFrame?: (frameIndex: number) => void;
}

const DEFAULT_CONFIG: Partial<SpriteSheetConfig> = {
    fps: 24,
    scale: 1,
    loop: true,
    autoplay: true,
};

export const SpriteSheetViewer: React.FC<SpriteSheetViewerProps> = ({
                                                                        src,
                                                                        config: userConfig,
                                                                        className = '',
                                                                        onComplete,
                                                                        onFrame,
                                                                    }) => {
    const config = { ...DEFAULT_CONFIG, ...userConfig } as SpriteSheetConfig;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const rafRef = useRef<number>();
    const [isPlaying, setIsPlaying] = useState(config.autoplay);
    const [currentFrame, setCurrentFrame] = useState(0);
    const lastFrameTime = useRef<number>(0);

    const drawFrame = useCallback((frameIndex: number) => {
        if (!canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', {
            alpha: true,  // Ensure alpha channel is enabled
            willReadFrequently: false // Performance optimization
        });
        if (!ctx) return;

        const frameWidth = imageRef.current.width / config.cols;
        const frameHeight = imageRef.current.height / config.rows;

        // Calculate scaled dimensions
        const scaledWidth = frameWidth * config.scale!;
        const scaledHeight = frameHeight * config.scale!;

        // Update canvas size if needed
        if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;

            // Configure context for better performance and quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Important: Reset the composite operation after size change
            ctx.globalCompositeOperation = 'source-over';
        }

        // Clear the canvas with transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate frame position
        const col = frameIndex % config.cols;
        const row = Math.floor(frameIndex / config.cols);

        // Draw frame with scaling
        ctx.drawImage(
            imageRef.current,
            col * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight,
            0,
            0,
            scaledWidth,
            scaledHeight
        );
    }, [config]);

    // Load image and setup with proper cross-origin handling
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Handle CORS if needed
        img.src = src;
        img.onload = () => {
            // @ts-ignore
            imageRef.current = img;
            drawFrame(currentFrame);
        };

        return () => {
            img.onload = null;
        };
    }, [src, drawFrame, currentFrame]);

    // Rest of the animation logic...
    useEffect(() => {
        if (isPlaying) {
            rafRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isPlaying]);

    const animate = useCallback((timestamp: number) => {
        if (!isPlaying) return;

        const frameInterval = 1000 / config.fps!;

        if (timestamp - lastFrameTime.current >= frameInterval) {
            lastFrameTime.current = timestamp;

            setCurrentFrame(prev => {
                const nextFrame = prev + 1;
                if (nextFrame >= config.frameCount) {
                    if (config.loop) {
                        return 0;
                    } else {
                        setIsPlaying(false);
                        onComplete?.();
                        return prev;
                    }
                }
                return nextFrame;
            });
        }

        rafRef.current = requestAnimationFrame(animate);
    }, [config, isPlaying, onComplete]);

    useEffect(() => {
        drawFrame(currentFrame);
        onFrame?.(currentFrame);
    }, [currentFrame, drawFrame, onFrame]);

    return (
        <div className={cn("relative w-full h-full", className)}>
            <canvas
                ref={canvasRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                }}
            />
        </div>
    );
};