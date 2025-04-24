import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
// @ts-ignore
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import {MeshoptDecoder} from "three/examples/jsm/libs/meshopt_decoder.module";

interface ModelProps {
    url: string;
    rotation: {
        x: number;
        y: number;
    };
}

interface FrameConfig {
    width: number;
    height: number;
    frames: number;
}

const DEFAULT_FRAME_CONFIG: FrameConfig = {
    width: 512,
    height: 512,
    frames: 36,
};

const SPRITE_SHEET_CONFIG = {
    rows: 6,
    cols: 6,
};

// Separate Model component with error boundary
const Model: React.FC<ModelProps> = ({ url, rotation }) => {
    const gltf = useGLTF(url) as GLTF;
    const modelRef = useRef<THREE.Group>();

    React.useEffect(() => {
        if (modelRef.current) {
            modelRef.current.rotation.set(rotation.x, rotation.y, 0);
        }
    }, [rotation]);

    return (
        <primitive
            ref={modelRef}
            object={gltf.scene}
            position={[0, 0, 0]}
            scale={1.5}
        />
    );
};

// Loading fallback component
const LoadingFallback = () => {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
};

const ModelRotationSprites: React.FC = () => {
    const [glbUrl, setGlbUrl] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [previewRotation, setPreviewRotation] = useState({ x: 0, y: 0 });
    const [error, setError] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    // Smooth preview rotation
    React.useEffect(() => {
        let animationFrame: number;
        const animate = () => {
            setPreviewRotation(prev => ({
                x: prev.x,
                y: prev.y + 0.005
            }));
            animationFrame = requestAnimationFrame(animate);
        };

        if (glbUrl) {
            animate();
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [glbUrl]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.name.toLowerCase().endsWith('.glb')) {
                setError('Please upload a GLB file');
                return;
            }

            // Create and validate URL
            const url = URL.createObjectURL(file);
            if (!url) {
                throw new Error('Failed to create URL for the file');
            }

            setGlbUrl(url);
            setError('');
        } catch (err) {
            setError('Failed to load the model. Please try again.');
            console.error('File upload error:', err);
        }
    };

    // Cleanup function for URLs
    React.useEffect(() => {
        return () => {
            if (glbUrl) {
                URL.revokeObjectURL(glbUrl);
            }
        };
    }, [glbUrl]);

    const setupScene = (): {
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
    } => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const camera = new THREE.PerspectiveCamera(
            35,
            DEFAULT_FRAME_CONFIG.width / DEFAULT_FRAME_CONFIG.height,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        });

        renderer.setSize(DEFAULT_FRAME_CONFIG.width, DEFAULT_FRAME_CONFIG.height);
        renderer.setPixelRatio(2);
        rendererRef.current = renderer;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, -5, -5);

        scene.add(ambientLight, directionalLight, fillLight);
        camera.position.z = 5;

        return { scene, camera, renderer };
    };

    const generateSpriteSheet = async () => {
        if (!glbUrl) {
            setError('Please upload a model first');
            return;
        }

        try {
            setIsGenerating(true);
            setProgress(0);
            setError('');

            // Load the model first
            const gltfLoader = new GLTFLoader();
            gltfLoader.setMeshoptDecoder(MeshoptDecoder);

            const gltf = await new Promise<GLTF>((resolve, reject) => {
                gltfLoader.load(glbUrl, resolve, undefined, reject);
            });

            const { scene, camera, renderer } = setupScene();

            // Setup model
            const model = gltf.scene.clone();
            model.scale.setScalar(1.5);

            // Center model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            scene.add(model);

            // Generate frames
            const frames: string[] = [];
            const totalFrames = DEFAULT_FRAME_CONFIG.frames;

            for (let i = 0; i < totalFrames; i++) {
                const angle = (i / totalFrames) * Math.PI * 2;
                model.rotation.y = angle;
                renderer.render(scene, camera);
                frames.push(renderer.domElement.toDataURL('image/png'));
                setProgress((i + 1) / totalFrames * 100);

                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            // Create sprite sheet
            const spriteSheet = document.createElement('canvas');
            const ctx = spriteSheet.getContext('2d');
            if (!ctx) throw new Error('Failed to get canvas context');

            spriteSheet.width = DEFAULT_FRAME_CONFIG.width * SPRITE_SHEET_CONFIG.cols;
            spriteSheet.height = DEFAULT_FRAME_CONFIG.height * SPRITE_SHEET_CONFIG.rows;

            // Fill background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, spriteSheet.width, spriteSheet.height);

            // Draw frames
            await Promise.all(frames.map((frameData, i) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const x = (i % SPRITE_SHEET_CONFIG.cols) * DEFAULT_FRAME_CONFIG.width;
                        const y = Math.floor(i / SPRITE_SHEET_CONFIG.cols) * DEFAULT_FRAME_CONFIG.height;
                        ctx.drawImage(img, x, y, DEFAULT_FRAME_CONFIG.width, DEFAULT_FRAME_CONFIG.height);
                        resolve();
                    };
                    img.src = frameData;
                });
            }));

            // Download
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const link = document.createElement('a');
            link.download = `model-sprites-${timestamp}.png`;
            link.href = spriteSheet.toDataURL('image/png');
            link.click();

        } catch (error) {
            console.error('Error generating sprite sheet:', error);
            setError('Failed to generate sprite sheet. Please try again.');
        } finally {
            setIsGenerating(false);
            rendererRef.current?.dispose();
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Model Rotation Sprite Sheet Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                        <input
                            type="file"
                            accept=".glb"
                            onChange={handleFileUpload}
                            className="w-full mb-4"
                        />

                        {error && (
                            <div className="text-red-500 mb-4">{error}</div>
                        )}

                        {isGenerating && (
                            <Progress value={progress} className="w-full mb-4" />
                        )}

                        <Button
                            onClick={generateSpriteSheet}
                            disabled={!glbUrl || isGenerating}
                            className="w-full"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Sprite Sheet'}
                        </Button>
                    </div>

                    <div
                        ref={containerRef}
                        className="w-full md:w-1/2 h-[400px] bg-gray-100 rounded-lg overflow-hidden"
                    >
                        {glbUrl && (
                            <Canvas
                                camera={{ position: [0, 0, 5], fov: 35 }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <ambientLight intensity={0.7} />
                                <directionalLight position={[5, 5, 5]} intensity={1} />
                                <directionalLight position={[-5, -5, -5]} intensity={0.3} />
                                <Suspense fallback={<LoadingFallback />}>
                                    <Model url={glbUrl} rotation={previewRotation} />
                                </Suspense>
                                <OrbitControls enableZoom={true} />
                            </Canvas>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ModelRotationSprites;