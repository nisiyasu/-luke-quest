import * as THREE from "three";

export const LQ_TARGET_IMAGE_RUNTIME = Object.freeze({
  program: "#101", taskBoundary: "T025", implementationRoot: "prototypes/target-image-threejs/",
  legacySceneImports: false, legacyMapsAuthority: false, legacyAldiaVisualPatches: false,
  phase: "TECHNICAL_SPIKE", threeRevision: THREE.REVISION
});

const root = document.getElementById("lq-target-image-root");
if (!root) throw new Error("LUKE target-image clean-room root missing");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 3);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
root.replaceChildren(renderer.domElement);
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
scene.add(mesh);
renderer.render(scene, camera);
root.dataset.runtime = "target-image-threejs-v1";
root.dataset.threeRevision = THREE.REVISION;
document.documentElement.dataset.lqTargetImageRuntime = "three-minimal-scene-ready";
window.__LQ_T025__ = { ready: true, threeRevision: THREE.REVISION, renderer: renderer.constructor.name, objectCount: scene.children.length };
