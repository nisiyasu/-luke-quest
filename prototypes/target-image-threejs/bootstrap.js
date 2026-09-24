import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const LQ_TARGET_IMAGE_RUNTIME = Object.freeze({
  program: "#101", taskBoundary: "T028", implementationRoot: "prototypes/target-image-threejs/",
  legacySceneImports: false, legacyMapsAuthority: false, legacyAldiaVisualPatches: false,
  phase: "TECHNICAL_SPIKE", threeRevision: THREE.REVISION
});

const root = document.getElementById("lq-target-image-root");
if (!root) throw new Error("LUKE target-image clean-room root missing");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 3);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio); renderer.setSize(innerWidth, innerHeight); root.replaceChildren(renderer.domElement);
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial()); scene.add(mesh);
renderer.render(scene, camera);
root.dataset.runtime = "target-image-threejs-v1"; root.dataset.threeRevision = THREE.REVISION;
document.documentElement.dataset.lqTargetImageRuntime = "three-minimal-scene-ready";
window.__LQ_T025__ = { ready: true, threeRevision: THREE.REVISION, renderer: renderer.constructor.name, objectCount: scene.children.length };

const T028_GLB_DATA_URI = "data:model/gltf-binary;base64,Z2xURgIAAACkAAAAkAAAAEpTT057ImFzc2V0Ijp7InZlcnNpb24iOiIyLjAiLCJnZW5lcmF0b3IiOiJMVUtFIFQwMjggZGV0ZXJtaW5pc3RpYyBmaXh0dXJlIn0sInNjZW5lIjowLCJzY2VuZXMiOlt7Im5vZGVzIjpbMF19XSwibm9kZXMiOlt7Im5hbWUiOiJUMDI4X0dMQl9ST09UIn1dfSA=";
window.__LQ_T028__ = { ready: false, fixture: "embedded-deterministic-glb" };
new GLTFLoader().load(T028_GLB_DATA_URI, (gltf) => {
  scene.add(gltf.scene); renderer.render(scene, camera);
  const rootNode = gltf.scene.getObjectByName("T028_GLB_ROOT");
  window.__LQ_T028__ = { ready: true, format: "GLB", loader: "GLTFLoader", fixture: "embedded-deterministic-glb", rootNode: rootNode?.name ?? null, sceneChildren: gltf.scene.children.length };
  document.documentElement.dataset.lqT028Glb = "loaded";
}, undefined, (error) => {
  window.__LQ_T028__ = { ready: false, format: "GLB", error: String(error) };
  document.documentElement.dataset.lqT028Glb = "failed";
});
