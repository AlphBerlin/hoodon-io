import * as THREE from "three";
import {loadGltf} from "@/lib/loaders";
import {FaceLandmarkerResult} from "@mediapipe/tasks-vision";
import {decomposeMatrix} from "@/lib/decomposeMatrix";

class AvatarManager {
    private static instance: AvatarManager = new AvatarManager();
    private scene!: THREE.Scene;
    private modelTemplate: THREE.Group | null = null;
    private currentUrl: string = '';
    isModelLoaded = false;

    private constructor() {
        this.scene = new THREE.Scene();
    }

    static getInstance(): AvatarManager {
        return AvatarManager.instance;
    }

    getScene = () => {
        return this.scene;
    };

    setScene = (scene: THREE.Scene) => {
        this.scene = scene;
    }

    loadModel = async (url: string) => {
        // Skip if same model is already loaded
        if (this.currentUrl === url) return;

        this.isModelLoaded = false;
        this.currentUrl = url;

        // Clear existing scene
        this.scene.clear();
        this.modelTemplate = null;

        // Load new model
        const gltf = await loadGltf(url);
        gltf.scene.traverse((obj: { frustumCulled: boolean; }) => (obj.frustumCulled = false));

        // Store template and create initial instance
        this.modelTemplate = gltf.scene.clone();

        // Add to scene but hide initially
        if(this.modelTemplate){
            const initialModel = this.modelTemplate.clone();
            initialModel.visible = false;
            this.scene.add(initialModel);
        }

        this.isModelLoaded = true;
    };

    clearScene = () => {
        this.scene.clear();
        this.modelTemplate = null;
        this.isModelLoaded = false;
        this.currentUrl = '';
    }

    private getOrCreateModel = (index: number): THREE.Group => {
        const existingModel = this.scene.children[index];
        if (existingModel) {
            return existingModel as THREE.Group;
        }

        if (!this.modelTemplate) {
            throw new Error("Model template not loaded");
        }

        const newModel = this.modelTemplate.clone();
        newModel.visible = false;
        this.scene.add(newModel);
        return newModel;
    }

    updateFacialTransforms = (results: FaceLandmarkerResult, flipped = true) => {
        if (!results || !this.isModelLoaded || !this.modelTemplate) return;

        const numFaces = results.faceBlendshapes?.length || 0;

        // Hide all existing models first
        this.scene.children.forEach(child => {
            child.visible = false;
        });

        // If no faces detected, return early (all models are already hidden)
        if (numFaces === 0) return;

        // Update each detected face
        for (let i = 0; i < numFaces; i++) {
            const model = this.getOrCreateModel(i);
            model.visible = true;

            this.updateBlendShapes(results, i, model, flipped);
            this.updateTranslation(results, i, model, flipped);
        }
    };

    updateBlendShapes = (results: FaceLandmarkerResult, faceIndex: number, model: THREE.Group, flipped = true) => {
        if (!results.faceBlendshapes || !results.faceLandmarks) return;

        const blendShapes = results.faceBlendshapes[faceIndex]?.categories;
        const landmarks = results.faceLandmarks[faceIndex];
        if (!blendShapes || !landmarks) return;

        model.traverse((obj) => {
            if ("morphTargetDictionary" in obj && "morphTargetInfluences" in obj) {
                const morphTargetDictionary = obj.morphTargetDictionary as {
                    [key: string]: number;
                };
                const morphTargetInfluences = obj.morphTargetInfluences as Array<number>;

                for (let {score, categoryName} of blendShapes) {
                    let updatedCategoryName = categoryName;

                    if (flipped) {
                        if (categoryName.includes("Left")) {
                            updatedCategoryName = categoryName.replace("Left", "Right");
                        } else if (categoryName.includes("Right")) {
                            updatedCategoryName = categoryName.replace("Right", "Left");
                        }
                    }

                    const index = morphTargetDictionary[updatedCategoryName];
                    if (index !== undefined) {
                        if (updatedCategoryName === 'eyeBlinkRight' || updatedCategoryName === 'eyeBlinkLeft') {
                            score = score * 2 > 1 ? 1 : score * 2;
                        }
                        morphTargetInfluences[index] = score;
                    }
                }
            }
        });
    };

    updateTranslation = (results: FaceLandmarkerResult, faceIndex: number, model: THREE.Group, flipped = true) => {
        if (!results.facialTransformationMatrixes) return;

        const matrixes = results.facialTransformationMatrixes[faceIndex]?.data;
        if (!matrixes) return;

        const {translation, rotation, scale} = decomposeMatrix(matrixes);
        const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, "ZYX");
        const quaternion = new THREE.Quaternion().setFromEuler(euler);

        if (flipped) {
            quaternion.y *= -1;
            quaternion.z *= -1;
            translation.x *= -1;
        }

        // Apply offset for multiple faces
        const xSpacing = 0.5; // Adjust this value to change spacing between faces
        const centerOffset = ((results.facialTransformationMatrixes.length - 1) * xSpacing) / 2;
        translation.x += (faceIndex * xSpacing) - centerOffset;

        // Find the head object in the model
        model.traverse((object) => {
            if (object.name === "raccoon_head") {
                object.position.set(
                    translation.x,
                    translation.y,
                    translation.z
                );
                object.scale.set(scale.x * 35, scale.y * 35, scale.z * 35);
                object.rotation.setFromQuaternion(quaternion);
            }
        });
    };
}

export default AvatarManager;