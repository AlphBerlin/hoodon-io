"use client";

import {useEffect, useRef} from "react";
import FaceLandmarkManager from "@/lib/class/FaceLandmarkManager";
import AvatarCanvas from "@/components/AvatarCanvas";
import {cn} from "@/lib/utils";

interface ThreeDAvatarProps {
    className?: string
    modelUrl?: string
}

const ThreeDAvatar = ({className, modelUrl = '/asset/raccoon-ex.glb'}: ThreeDAvatarProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastVideoTimeRef = useRef(-1);
    const requestRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);


    const animate = async () => {
        if (
            videoRef.current &&
            videoRef.current.currentTime !== lastVideoTimeRef.current
        ) {
            lastVideoTimeRef.current = videoRef.current.currentTime;
            try {
                const faceLandmarkManager = FaceLandmarkManager.getInstance();
                await faceLandmarkManager.initializeModel()
                faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
            } catch (e) {
                console.error(e);
            }
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const getUserCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current!.play();

                        // Start animation once video is loaded
                        requestRef.current = requestAnimationFrame(animate);
                    };
                }
            } catch (e) {
                console.error(e);
                alert("Failed to load webcam!");
            }
        };
        getUserCamera();

        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className={cn("relative flex justify-center h-full w-full", className)} ref={containerRef}>
            <video
                ref={videoRef}
                loop={true}
                muted={true}
                autoPlay={true}
                playsInline={true}
                className="w-full h-full rounded"
            ></video>

            <AvatarCanvas
                url={modelUrl}
            />
        </div>
    );
};

export default ThreeDAvatar;
