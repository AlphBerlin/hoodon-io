import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, Play, Pause, RotateCcw } from 'lucide-react';
import FaceLandmarkManager from '@/lib/class/FaceLandmarkManager';
import AvatarCanvas from "@/components/AvatarCanvas";

interface VideoSize {
    width: number;
    height: number;
}

const VideoProcessor: React.FC = () => {
    const [sourceVideo, setSourceVideo] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const previewVideoRef = useRef<HTMLVideoElement | null>(null);
    const combinedCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [avatarCanvasEl, setAvatarCanvasEl] = useState<HTMLCanvasElement | null>(null);
    const [videoSize, setVideoSize] = useState<VideoSize>({ width: 0, height: 0 });
    const [displaySize, setDisplaySize] = useState<VideoSize>({ width: 0, height: 0 });
    const animationFrameRef = useRef<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const faceLandmarkManager = useRef<FaceLandmarkManager>(FaceLandmarkManager.getInstance());

    const calculateDisplaySize = (containerWidth: number, videoWidth: number, videoHeight: number): VideoSize => {
        const aspectRatio = videoWidth / videoHeight;
        const height = Math.min(containerWidth / aspectRatio, window.innerHeight * 0.7);
        const width = height * aspectRatio;
        return { width, height };
    };

    // Initialize combined canvas when video size is set
    useEffect(() => {
        if (videoSize.width > 0 && videoSize.height > 0 && combinedCanvasRef.current) {
            const canvas = combinedCanvasRef.current;
            canvas.width = videoSize.width;
            canvas.height = videoSize.height;

            // Initialize with a 2D context
            const ctx = canvas.getContext('2d', { alpha: false });
            if (ctx) {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, videoSize.width, videoSize.height);
            }
        }
    }, [videoSize]);
    useEffect(() => {
        const updateDisplaySize = () => {
            if (containerRef.current && videoSize.width && videoSize.height) {
                const containerWidth = containerRef.current.offsetWidth;
                const newDisplaySize = calculateDisplaySize(containerWidth, videoSize.width, videoSize.height);
                setDisplaySize(newDisplaySize);

                // Update canvas size
                if (combinedCanvasRef.current) {
                    combinedCanvasRef.current.style.width = `${newDisplaySize.width}px`;
                    combinedCanvasRef.current.style.height = `${newDisplaySize.height}px`;
                }
                if (avatarCanvasEl) {
                    avatarCanvasEl.style.width = `${newDisplaySize.width}px`;
                    avatarCanvasEl.style.height = `${newDisplaySize.height}px`;
                }
            }
        };

        window.addEventListener('resize', updateDisplaySize);
        updateDisplaySize();
        return () => window.removeEventListener('resize', updateDisplaySize);
    }, [videoSize, avatarCanvasEl]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            setSourceVideo(url);
            setProgress(0);
            setPreviewUrl(null);
            setIsVideoLoaded(false);

            if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.load();
            }

            try {
                await faceLandmarkManager.current.initializeModel();
            } catch (error) {
                console.error('Failed to initialize face landmark detection:', error);
            }
        }
    };

    const setupAudioStream = async () => {
        if (!videoRef.current) return null;

        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(videoRef.current);
        const destination = audioCtx.createMediaStreamDestination();
        source.connect(destination);
        source.connect(audioCtx.destination); // Allow audio playback during processing
        return destination.stream;
    };

    const processChunk = async (
        startTime: number,
        endTime: number,
        ctx: CanvasRenderingContext2D,
        videoEl: HTMLVideoElement
    ): Promise<void> => {
        return new Promise((resolve) => {
            videoEl.currentTime = startTime;

            const processFrame = async () => {
                if (videoEl.currentTime < endTime) {
                    ctx.save();
                    ctx.clearRect(0, 0, videoSize.width, videoSize.height);

                    // Fix horizontal flip by scaling and translating
                    ctx.scale(-1, 1);
                    ctx.translate(-videoSize.width, 0);

                    // Draw the video frame
                    ctx.drawImage(videoEl, 0, 0, videoSize.width, videoSize.height);
                    ctx.restore();

                    try {
                        await faceLandmarkManager.current.detectLandmarks(videoEl, Date.now());
                    } catch (error) {
                        console.error('Error detecting landmarks:', error);
                    }

                    if (avatarCanvasEl) {
                        // Draw the avatar canvas without flipping
                        ctx.drawImage(avatarCanvasEl, 0, 0, videoSize.width, videoSize.height);
                    }

                    // Use requestAnimationFrame for smoother playback
                    const frameRate = 1000 / 30; // 30 FPS
                    const nextFrameTime = videoEl.currentTime + (1 / 30);

                    if (nextFrameTime <= endTime) {
                        videoEl.currentTime = nextFrameTime;
                        setTimeout(() => requestAnimationFrame(processFrame), frameRate);
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            };

            videoEl.addEventListener('seeked', () => {
                requestAnimationFrame(processFrame);
            }, { once: true });
        });
    };

    const processVideo = async (): Promise<void> => {
        if (!videoRef.current || !isVideoLoaded || !combinedCanvasRef.current || !avatarCanvasEl) {
            console.log('Video or canvas not ready for processing');
            return;
        }

        try {
            setIsProcessing(true);
            setProgress(0);

            const chunks: BlobPart[] = [];
            const videoEl = videoRef.current;
            const canvas = combinedCanvasRef.current;
            const ctx = canvas.getContext('2d', { alpha: false })!;

            // Set up audio stream before starting processing
            const audioStream = await setupAudioStream();

            // Create a combined stream of canvas and audio
            const canvasStream = canvas.captureStream(30); // 30 FPS for smoother video
            const combinedStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...(audioStream?.getAudioTracks() || [])
            ]);

            const mimeType = 'video/webm;codecs=vp9,opus';
            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType,
                videoBitsPerSecond: 8000000, // 8 Mbps for better quality
                audioBitsPerSecond: 128000   // 128 kbps for audio
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e: BlobEvent) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setIsProcessing(false);
                setProgress(100);
            };

            // Process video in smaller chunks for smoother processing
            const chunkDuration = 10; // Process 2 seconds at a time for smoother output
            const totalChunks = Math.ceil(videoEl.duration / chunkDuration);

            mediaRecorder.start();
            videoEl.currentTime = 0;

            for (let i = 0; i < totalChunks; i++) {
                const startTime = i * chunkDuration;
                const endTime = Math.min(startTime + chunkDuration, videoEl.duration);

                await processChunk(startTime, endTime, ctx, videoEl);
                setProgress((endTime / videoEl.duration) * 100);
            }

            mediaRecorder.stop();

        } catch (error) {
            console.error('Error processing video:', error);
            setIsProcessing(false);
            setProgress(0);
        }
    };

    // Handle video load events
    useEffect(() => {
        if (!videoRef.current) return;

        const handleLoadedMetadata = () => {
            if (videoRef.current) {
                const newVideoSize = {
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight
                };
                setVideoSize(newVideoSize);

                // Initialize canvas with actual video dimensions
                if (combinedCanvasRef.current) {
                    combinedCanvasRef.current.width = newVideoSize.width;
                    combinedCanvasRef.current.height = newVideoSize.height;
                }
            }
        };

        const handleLoadedData = () => {
            setIsVideoLoaded(true);
        };

        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.current.addEventListener('loadeddata', handleLoadedData);

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                videoRef.current.removeEventListener('loadeddata', handleLoadedData);
            }
        };
    }, [sourceVideo]);

    const handleDownload = () => {
        if (previewUrl) {
            const a = document.createElement('a');
            a.href = previewUrl;
            a.download = 'processed-video.webm';
            a.click();
        }
    };

    const resetProcessor = () => {
        if (mediaRecorderRef.current && isProcessing) {
            mediaRecorderRef.current.stop();
        }
        setSourceVideo(null);
        setPreviewUrl(null);
        setProgress(0);
        setIsVideoLoaded(false);
        setAudioStream(null);
        if (videoRef.current) {
            videoRef.current.src = '';
        }
        if (previewVideoRef.current) {
            previewVideoRef.current.src = '';
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (sourceVideo) URL.revokeObjectURL(sourceVideo);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [sourceVideo, previewUrl, audioStream]);

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <Button
                            onClick={() => document.getElementById('videoInput')?.click()}
                            className="w-full md:w-auto"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Select Video
                        </Button>
                        <input
                            id="videoInput"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        {sourceVideo && !isProcessing && isVideoLoaded && progress < 100 && (
                            <Button
                                onClick={processVideo}
                                className="w-full md:w-auto"
                                disabled={!isVideoLoaded || !avatarCanvasEl}
                            >
                                Process Video
                            </Button>
                        )}
                    </div>

                    {sourceVideo && (
                        <div
                            ref={containerRef}
                            className="relative w-full"
                            style={{
                                height: displaySize.height,
                                maxHeight: '70vh'
                            }}
                        >
                            <video
                                ref={videoRef}
                                src={sourceVideo}
                                className="absolute top-0 left-0 w-full h-full object-contain"
                                muted
                                playsInline
                                onLoadedData={() => {
                                    setIsVideoLoaded(true);
                                    console.log('Video loaded successfully');
                                }}
                            />
                            {videoSize.width > 0 && (
                                <>
                                    <canvas
                                        ref={combinedCanvasRef}
                                        className="absolute top-0 left-0 w-full h-full"
                                        style={{ display: isProcessing ? 'block' : 'none' }}
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full">
                                        <AvatarCanvas
                                            width={videoSize.width}
                                            height={videoSize.height}
                                            url="/asset/hoods/raccoon.glb"
                                            onCanvasReady={(canvas) => {
                                                setAvatarCanvasEl(canvas);
                                                console.log('Avatar canvas ready:', !!canvas);
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {(isProcessing || progress > 0) && (
                        <Progress value={progress} className="w-full" />
                    )}

                    {previewUrl && !isProcessing && (
                        <div className="space-y-4">
                            <video
                                ref={previewVideoRef}
                                src={previewUrl}
                                className="w-full"
                                style={{
                                    height: displaySize.height,
                                    maxHeight: '70vh',
                                    objectFit: 'contain'
                                }}
                                controls
                            />

                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleDownload}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                                <Button variant="outline" onClick={resetProcessor}>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default VideoProcessor;