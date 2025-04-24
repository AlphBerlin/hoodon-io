'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SpriteSheetViewer = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [config, setConfig] = useState({
        rows: 6,
        cols: 6,
        fps: 24
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [autoDetected, setAutoDetected] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationRef = useRef<number>();
    const lastFrameTimeRef = useRef<number>(0);

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setIsPlaying(false);
            setCurrentFrame(0);
            loadImage(url);
        }
    };

    // Load and analyze image
    const loadImage = (url: string) => {
        const img = new Image();
        img.onload = () => {
            setImageSize({ width: img.width, height: img.height });
            imageRef.current = img;

            // Try to auto-detect grid
            const aspectRatio = img.width / img.height;
            if (Math.abs(aspectRatio - 1) < 0.1) {
                const possibleDivisions = [2, 3, 4, 5, 6, 8];
                for (const div of possibleDivisions) {
                    if (img.width % div === 0 && img.height % div === 0) {
                        setConfig(prev => ({
                            ...prev,
                            rows: div,
                            cols: div
                        }));
                        setAutoDetected(true);
                        break;
                    }
                }
            }
            drawFrame(0);
        };
        img.src = url;
    };

    // Draw individual frame
    const drawFrame = (frameIndex: number) => {
        if (!canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const frameWidth = imageRef.current.width / config.cols;
        const frameHeight = imageRef.current.height / config.rows;

        // Set canvas size to frame size
        canvas.width = frameWidth;
        canvas.height = frameHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate frame position
        const col = frameIndex % config.cols;
        const row = Math.floor(frameIndex / config.cols);

        // Draw frame
        ctx.drawImage(
            imageRef.current,
            col * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth,
            frameHeight
        );
    };

    // Animation loop with FPS control
    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!lastFrameTimeRef.current) {
                lastFrameTimeRef.current = timestamp;
            }

            const frameInterval = 1000 / config.fps; // Calculate time per frame based on FPS
            const elapsed = timestamp - lastFrameTimeRef.current;

            if (elapsed >= frameInterval) {
                setCurrentFrame(prev => {
                    const totalFrames = config.rows * config.cols;
                    const next = (prev + 1) % totalFrames;
                    drawFrame(next);
                    return next;
                });
                lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        if (isPlaying) {
            lastFrameTimeRef.current = 0;
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, config.rows, config.cols, config.fps]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Sprite Sheet Viewer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="mb-4"
                        />
                    </div>

                    {imageUrl && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Rows: {config.rows}</Label>
                                    <Slider
                                        value={[config.rows]}
                                        min={1}
                                        max={12}
                                        step={1}
                                        onValueChange={(value) => setConfig(prev => ({ ...prev, rows: value[0] }))}
                                        className="mb-4"
                                    />
                                </div>
                                <div>
                                    <Label>Columns: {config.cols}</Label>
                                    <Slider
                                        value={[config.cols]}
                                        min={1}
                                        max={12}
                                        step={1}
                                        onValueChange={(value) => setConfig(prev => ({ ...prev, cols: value[0] }))}
                                        className="mb-4"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>FPS: {config.fps}</Label>
                                <Slider
                                    value={[config.fps]}
                                    min={1}
                                    max={60}
                                    step={1}
                                    onValueChange={(value) => setConfig(prev => ({ ...prev, fps: value[0] }))}
                                    className="mb-4"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="flex-1"
                                >
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setCurrentFrame(0);
                                        drawFrame(0);
                                    }}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Reset
                                </Button>
                            </div>

                            <div className="relative aspect-square w-full max-w-xl mx-auto bg-gray-100 rounded-lg overflow-hidden">
                                <canvas
                                    ref={canvasRef}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>

                            {autoDetected && (
                                <div className="text-sm text-green-600">
                                    Grid size auto-detected: {config.rows}x{config.cols}
                                </div>
                            )}

                            <div className="text-sm text-gray-500">
                                Image size: {imageSize.width}x{imageSize.height}px
                                <br />
                                Frame size: {Math.floor(imageSize.width / config.cols)}x{Math.floor(imageSize.height / config.rows)}px
                                <br />
                                Total frames: {config.rows * config.cols}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default SpriteSheetViewer;