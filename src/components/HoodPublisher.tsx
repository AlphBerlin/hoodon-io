import React, {useEffect, useRef, useState} from "react";
import cn from "clsx";
import AvatarCanvas from "./AvatarCanvas";
import FaceLandmarkManager from "@/lib/class/FaceLandmarkManager";
import {useStream} from "@/context/stream-context";
import {useUser} from "@/context/user-context";

interface ParentProps {
    className?: string;
    onCombinedStreamReady: (stream: MediaStream) => void;
}

export function HoodPublisher({className, onCombinedStreamReady}: ParentProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [avatarCanvasEl, setAvatarCanvasEl] = useState<HTMLCanvasElement | null>(null);
    const combinedCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [combinedStream, setCombinedStream] = useState<MediaStream | null>(null);
    const lastVideoTimeRef = useRef(-1);
    const requestRef = useRef(0);
    const combineRequestRef = useRef(0);
    const [modelUrl, setModelUrl] = useState<string | null>("/asset/hoods/panda.glb");
    const {hoodUrl} = useUser()
    const [videoSize, setVideoSize] = useState<{ width: number; height: number }>();
    const {visible, muted, hoodOn, stream, setStream} = useStream();
    const streamRef = useRef<MediaStream | null>(null);
    useEffect(() => {
        setModelUrl(hoodUrl)
    }, [hoodUrl]);
    const pauseCamera = () => {
        if (streamRef.current) {
            // Instead of stopping tracks, just disable them
            streamRef.current.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.enabled = false;
                }
            });
        }

        // Cancel animation frames
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = 0;
        }
        if (combineRequestRef.current) {
            cancelAnimationFrame(combineRequestRef.current);
            combineRequestRef.current = 0;
        }
    };

    const resumeCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.enabled = true;
                }
            });
        }
        if (videoRef.current && videoRef.current.readyState >= 2) {
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    // Only use this when completely destroying the component
    const cleanup = () => {
        //console.log('cleanup');
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                streamRef.current?.removeTrack(track);
            });
            streamRef.current = null;
        }

        if (combinedStream) {
            combinedStream.getTracks().forEach(track => {
                track.stop();
                combinedStream.removeTrack(track);
            });
            setCombinedStream(null);
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.load();
        }

        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = 0;
        }
        if (combineRequestRef.current) {
            cancelAnimationFrame(combineRequestRef.current);
            combineRequestRef.current = 0;
        }
    };

    useEffect(() => {
        if (!visible) {
            pauseCamera();
        } else {
            if (!streamRef.current) {
                initializeStream();
            } else {
                resumeCamera();
            }
        }

        // Only use cleanup on component unmount
        return () => {
            cleanup();
        };
    }, [visible]);


    useEffect(() => {
        if (!stream) return;
        const track = stream.getTracks().find((track) => track.kind === 'audio');
        if (track) {
            track.enabled = !track.enabled;
        }
    }, [muted]);

    const animate = async () => {
        if (!visible) {
            cancelAnimationFrame(requestRef.current);
            return;
        }

        if (
            videoRef.current &&
            videoRef.current.currentTime !== lastVideoTimeRef.current
        ) {
            if (
                videoRef.current.readyState === 4 && // HAVE_ENOUGH_DATA
                videoRef.current.videoWidth > 0 &&
                videoRef.current.videoHeight > 0 &&
                videoRef.current.currentTime !== lastVideoTimeRef.current
            ) {
                lastVideoTimeRef.current = videoRef.current.currentTime;
                try {
                    const faceLandmarkManager = FaceLandmarkManager.getInstance();
                    await faceLandmarkManager.initializeModel()
                    // Add safety check before detection
                    if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
                    }
                } catch (e) {
                    console.error("Landmark detection error:", e);
                    // Don't stop animation on error, just continue to next frame
                }
            }
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    const drawCombinedFrame = () => {
        if (!combinedCanvasRef.current || !videoRef.current || !avatarCanvasEl || !visible) {
            combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
            return;
        }
        if (videoRef.current.readyState !== 4 || // HAVE_ENOUGH_DATA
            videoRef.current.videoWidth === 0 ||
            videoRef.current.videoHeight === 0) {
            combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
            return;
        }

        const ctx = combinedCanvasRef.current.getContext("2d");
        if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }
        if (!ctx) {
            combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
            return;
        }

        // Clear
        ctx.clearRect(0, 0, combinedCanvasRef.current.width, combinedCanvasRef.current.height);

        // Draw the video first
        ctx.drawImage(videoRef.current, 0, 0, combinedCanvasRef.current.width, combinedCanvasRef.current.height);

        // Only draw avatar if hoodOn is true
        if (hoodOn) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                avatarCanvasEl,
                -combinedCanvasRef.current.width, // Negative x to flip
                0,
                combinedCanvasRef.current.width,
                combinedCanvasRef.current.height
            );
            ctx.restore();
        }

        combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
    };

    const updateVideoSize = () => {
        if (videoRef.current) {
            const container = videoRef.current;
            const containerWidth = container.clientWidth;

            // Calculate height based on screen size
            let aspectRatio;
            aspectRatio = 4 / 3; // default for desktop


            const containerHeight = containerWidth / aspectRatio;

            setVideoSize({
                width: containerWidth,
                height: containerHeight
            });
        }
    };

    // Handle visibility changes
    useEffect(() => {
        if (!visible) {
            pauseCamera();
            setCombinedStream(null);
        } else {
            // Reinitialize camera if it was stopped
            if (!streamRef.current) {
                initializeStream();
            }
        }
    }, [visible]);

    useEffect(() => {
        if (!videoRef.current) return;

        const resizeObserver = new ResizeObserver(updateVideoSize);
        resizeObserver.observe(videoRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    const initializeStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            if (!videoRef.current) return;

            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            stream.getAudioTracks().forEach(track => {
                track.enabled = !muted;
            });

            await new Promise<void>((resolve) => {
                if (!videoRef.current) return;

                const checkReady = () => {
                    if (videoRef.current &&
                        videoRef.current.videoWidth > 0 &&
                        videoRef.current.videoHeight > 0) {
                        resolve();
                    } else {
                        requestAnimationFrame(checkReady);
                    }
                };

                videoRef.current.onloadedmetadata = () => {
                    checkReady();
                };
            });

            if (!videoRef.current) return;

            if (videoRef.current.readyState >= 2) {
                updateVideoSize();
                await videoRef.current.play();
                requestRef.current = requestAnimationFrame(animate);
            }
        } catch (e) {
            console.error("Camera initialization error:", e);
            if (e instanceof Error) {
                if (e.name === 'NotAllowedError') {
                    alert("Camera access denied. Please allow camera access and refresh the page.");
                } else if (e.name === 'NotFoundError') {
                    alert("No camera found. Please connect a camera and refresh the page.");
                } else {
                    alert("Failed to initialize camera. Please refresh and try again.");
                }
            }
        }
    };

    useEffect(() => {
        if (visible) {
            initializeStream();
        }
    }, []);

    useEffect(() => {
        if (streamRef.current) {
            streamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !muted;
            });
        }
    }, [muted]);

    useEffect(() => {
        if (videoSize && !combinedCanvasRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoSize.width;
            canvas.height = videoSize.height;
            // canvas.width = 1920; // Set width for HD
            // canvas.height = 1080;
            combinedCanvasRef.current = canvas;
        }
    }, [videoSize]);

    useEffect(() => {
        combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
        return () => {
            if (combineRequestRef.current) {
                cancelAnimationFrame(combineRequestRef.current);
            }
        };
    }, [avatarCanvasEl, videoSize, hoodOn]);

    useEffect(() => {
        if (combinedCanvasRef.current && !combinedStream && streamRef.current) {
            const canvasStream = combinedCanvasRef.current.captureStream(90);

            const newCombinedStream = new MediaStream();

            const videoTrack = canvasStream.getVideoTracks()[0];
            if (videoTrack) {
                newCombinedStream.addTrack(videoTrack);
            }

            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                newCombinedStream.addTrack(audioTrack);
            }

            setCombinedStream(newCombinedStream);
            setStream(newCombinedStream);
            onCombinedStreamReady(newCombinedStream);
        }
    }, [combinedCanvasRef.current, streamRef.current]);

    return (
        <div>
            <div className={cn("flex justify-center h-full w-full", className)}>
                {visible && (
                    <>
                        <video
                            ref={videoRef}
                            loop={true}
                            muted={true}
                            autoPlay={true}
                            playsInline={true}
                        />
                        {videoSize &&
                            <div className={'absolute'} style={{height: videoSize.height, width: videoSize.width}}>
                                {(hoodOn && modelUrl) && (
                                    <AvatarCanvas
                                        width={videoSize.width}
                                        height={videoSize.height}
                                        url={modelUrl}
                                        onCanvasReady={setAvatarCanvasEl}
                                    />
                                )}
                            </div>}
                    </>
                )}
            </div>
        </div>
    );
}