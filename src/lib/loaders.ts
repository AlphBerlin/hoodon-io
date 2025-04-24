// @ts-ignore
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const loadGltf = async (url: string): Promise<GLTF> => {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  return await new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf: GLTF) => resolve(gltf),
      (progress : any) => {},
      (error : any) => reject(error)
    );
  });
};
function applyBlur(imageData:any) {
  // Simple box blur algorithm (replace with Gaussian blur for better results)
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = (data[i] + data[i + 4]) / 2;      // Red
    data[i + 1] = (data[i + 1] + data[i + 5]) / 2; // Green
    data[i + 2] = (data[i + 2] + data[i + 6]) / 2; // Blue
  }
  return imageData;
/*
  // Put the blurred face back on the canvas
  canvasCtx.putImageData(blurredFace, boundingBox.xCenter * canvasElement.width - boundingBox.width * canvasElement.width / 2,
      boundingBox.yCenter * canvasElement.height - boundingBox.height * canvasElement.height / 2);*/
}

export { loadGltf };
