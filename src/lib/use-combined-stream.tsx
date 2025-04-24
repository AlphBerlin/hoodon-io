'use client';
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import AvatarManager from "@/lib/class/AvatarManager";
import FaceLandmarkManager from "@/lib/class/FaceLandmarkManager";
import { Float, Text3D } from "@react-three/drei";
import * as THREE from "three";

interface AvatarCanvasProps {
    width?: number;
    height?: number;
    url: string;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function useCombinedMediaStream({ width, height, url }: AvatarCanvasProps): { combinedStream: MediaStream | null, avatarCanvas: JSX.Element | null } {
    const avatarManagerRef = useRef<AvatarManager>(AvatarManager.getInstance());
    const requestRef = useRef<number>(0);
    const combineRequestRef = useRef<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(document.createElement("video"));
    const combinedCanvasRef = useRef<HTMLCanvasElement | null>(document.createElement("canvas"));
    const [scene, setScene] = useState<THREE.Scene | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [combinedStream, setCombinedStream] = useState<MediaStream | null>(null);
    const [onCanvasReady, setOnCanvasReady] = useState<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            //console.log("Initializing video element");
            videoRef.current.autoplay = true;
            videoRef.current.playsInline = true;
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                videoRef.current!.srcObject = stream;
                videoRef.current!.play();
            });
        }

        if (combinedCanvasRef.current) {
            //console.log("Initializing combined canvas");
            combinedCanvasRef.current.width = width || 640;
            combinedCanvasRef.current.height = height || 480;
        }
    }, [width, height]);

    const animate = () => {
        //console.log("Starting animation loop");
        const results = FaceLandmarkManager.getInstance().getResults();
        avatarManagerRef.current.updateFacialTransforms(results, true);
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        //console.log("Setting up animation loop");
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            //console.log("Cleaning up animation loop");
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    useEffect(() => {
        //console.log("Loading avatar model from URL:", url);
        setIsLoading(true);
        const avatarManager = AvatarManager.getInstance();
        avatarManager
            .loadModel(url)
            .then(() => {
                //console.log("Avatar model loaded successfully");
                setScene(avatarManager.getScene());
                setIsLoading(false);
            })
            .catch((e) => {
                console.error("Error loading model:", e);
            });
        return () => {
            //console.log("Clearing avatar scene");
            avatarManager.clearScene();
        };
    }, [url]);

    const drawCombinedFrame = () => {
        if (!combinedCanvasRef.current || !videoRef.current || !onCanvasReady) {
            //console.log("Missing required elements for drawing frame");
            //console.log("combinedCanvasRef.current:", combinedCanvasRef.current);
            //console.log("videoRef.current:", videoRef.current);
            //console.log("onCanvasReady:", onCanvasReady);
            combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
            return;
        }

        const ctx = combinedCanvasRef.current.getContext("2d");
        if (!ctx) {
            //console.log("Unable to get 2D context from combined canvas");
            combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
            return;
        }

        //console.log("Drawing video frame and avatar canvas");
        ctx.clearRect(0, 0, combinedCanvasRef.current.width, combinedCanvasRef.current.height);

        ctx.drawImage(videoRef.current, 0, 0, combinedCanvasRef.current.width, combinedCanvasRef.current.height);

        ctx.save();
        ctx.scale(-1, 1);

        ctx.drawImage(
            onCanvasReady,
            -combinedCanvasRef.current.width,
            0,
            combinedCanvasRef.current.width,
            combinedCanvasRef.current.height
        );
        ctx.restore();

        combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
    };

    useEffect(() => {
        //console.log("Setting up combined frame drawing loop");
        combineRequestRef.current = requestAnimationFrame(drawCombinedFrame);
        return () => {
            //console.log("Cleaning up combined frame drawing loop");
            if (combineRequestRef.current) cancelAnimationFrame(combineRequestRef.current);
        };
    }, [onCanvasReady, width, height]);

    useEffect(() => {
        if (combinedCanvasRef.current && !combinedStream) {
            //console.log("Creating MediaStream from combined canvas");
            const stream = combinedCanvasRef.current.captureStream(30);
            setCombinedStream(stream);
        }
    }, [combinedCanvasRef.current, combinedStream]);

    const avatarCanvas = (
        <div className="absolute" style={{ width: width, height: height }}>
            <Canvas
                camera={{ position: [0, 0, 3], near: 0.1, far: 1000 }}
                onCreated={(state) => {
                    //console.log("Avatar canvas created");
                    setOnCanvasReady(state.gl.domElement);
                }}
            >
                <ambientLight />
                <directionalLight position={[0, 0, 3]} intensity={0.5} />
                {scene && <primitive object={scene} />}
                {isLoading && (
                    <Float floatIntensity={1} speed={1}>
                        <Text3D
                            font="/assets/fonts/Open_Sans_Condensed_Bold.json"
                            scale={0.05}
                            position={[-0.1, 0.6, 0]}
                            bevelEnabled
                            bevelSize={0.05}
                        >
                            Loading...
                            <meshNormalMaterial />
                        </Text3D>
                    </Float>
                )}
            </Canvas>
        </div>
    );

    return { combinedStream, avatarCanvas };
}
