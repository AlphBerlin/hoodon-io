import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import AvatarManager from "@/lib/class/AvatarManager";
import FaceLandmarkManager from "@/lib/class/FaceLandmarkManager";
import { Float, Text3D } from "@react-three/drei";
import * as THREE from "three";

interface AvatarCanvasProps {
    width?: number;
    height?: number;
    url: string;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
    flip?: boolean;
}

const AvatarCanvas = ({ width, height, url, onCanvasReady,flip=true }: AvatarCanvasProps) => {
    const avatarManagerRef = useRef<AvatarManager>(AvatarManager.getInstance());
    const requestRef = useRef(0);
    const [scene, setScene] = React.useState<THREE.Scene | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const animate = () => {
        const results = FaceLandmarkManager.getInstance().getResults();
        avatarManagerRef.current.updateFacialTransforms(results, flip);
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]);

    useEffect(() => {
        setIsLoading(true);
        const avatarManager = AvatarManager.getInstance();
        avatarManager
            .loadModel(url)
            .then(() => {
                setScene(avatarManager.getScene());
                setIsLoading(false);
            })
            .catch((e) => {
                console.error("Failed to load model:", e);
                alert(e);
            });
        return () => {
            avatarManager.clearScene();
        };
    }, [url]);

    return (
        <div className={'absolute w-full h-full'}>
            <Canvas
                camera={{
                    position: [0, 0,0],
                    near: 0.1,
                    far: 1000,
                    fov: 50,  // Adjusted field of view for better perspective
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    // Remove clipping planes to allow free movement
                    logarithmicDepthBuffer: true
                }}
                onCreated={(state) => {
                    // Update camera settings
                    state.camera.updateProjectionMatrix();

                    if (onCanvasReady) {
                        onCanvasReady(state.gl.domElement);
                    }
                }}
            >
                <ambientLight intensity={0.5}/>
                <directionalLight position={[0, 0, 3]} intensity={0.5}/>
                <ambientLight intensity={0.2}/>

                {/* Main key light (front) */}
                <directionalLight
                    position={[0, 0, 2]}
                    intensity={0.5}
                    color="#ffffff"
                />

                {/* Fill light (left side) */}
                <pointLight
                    position={[-2, 0, 1]}
                    intensity={0.3}
                    color="#e1e1ff" // Slightly blue tint
                />

                {/* Fill light (right side) */}
                <pointLight
                    position={[2, 0, 1]}
                    intensity={0.3}
                    color="#ffe1e1" // Slightly warm tint
                />

                {/* Rim light (back left) */}
                <spotLight
                    position={[-1, 0, -2]}
                    intensity={0.4}
                    angle={0.5}
                    penumbra={1}
                    color="#ffffff"
                />

                {/* Rim light (back right) */}
                <spotLight
                    position={[1, 0, -2]}
                    intensity={0.4}
                    angle={0.5}
                    penumbra={1}
                    color="#ffffff"
                />

                {/* Top light */}
                <pointLight
                    position={[0, 2, 0]}
                    intensity={0.2}
                    color="#ffffff"
                />

                {/* Bottom fill light */}
                <pointLight
                    position={[0, -2, 0]}
                    intensity={0.1}
                    color="#ffffff"
                />
                {scene && <primitive object={scene}/>}

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
                            <meshNormalMaterial/>
                        </Text3D>
                    </Float>
                )}
            </Canvas>
        </div>
    );
};

export default React.memo(AvatarCanvas);