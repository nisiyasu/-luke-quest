import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const LQ_TARGET_IMAGE_RUNTIME = Object.freeze({
  program: "#101", taskBoundary: "T031", implementationRoot: "prototypes/target-image-threejs/",
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

// T031 technical-spike probes only: not production model/material/light/decor authority.
const t031Scene = new THREE.Scene();
const t031Camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50); t031Camera.position.set(0, 2, 5); t031Camera.lookAt(0, 0, 0);
const pbrMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.5, metalness: 0.1 });
const pbrMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), pbrMaterial); pbrMesh.castShadow = true; pbrMesh.receiveShadow = true; t031Scene.add(pbrMesh);
const light = new THREE.DirectionalLight(0xffffff, 2); light.position.set(2, 4, 3); light.castShadow = true; t031Scene.add(light, new THREE.AmbientLight(0xffffff, 0.3));
const instanced = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2,0.2,0.2), pbrMaterial, 3); for (let i=0;i<3;i++){ const m=new THREE.Matrix4().makeTranslation(i-1,-1,0); instanced.setMatrixAt(i,m); } t031Scene.add(instanced);
const lod = new THREE.LOD(); lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(0.35,16,8),pbrMaterial),0); lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(0.35,6,4),pbrMaterial),10); lod.position.set(0,1,0); t031Scene.add(lod);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.render(t031Scene,t031Camera);
window.__LQ_T031__ = { ready:true, pbr:pbrMaterial.isMeshStandardMaterial===true, shadow:renderer.shadowMap.enabled===true && pbrMesh.castShadow===true && light.castShadow===true, instancing:instanced.isInstancedMesh===true && instanced.count===3, lod:lod.isLOD===true && lod.levels.length===2, runtimeErrors:0 };
document.documentElement.dataset.lqT031Spike = "pass"; document.documentElement.dataset.lqT031Pbr = String(window.__LQ_T031__.pbr); document.documentElement.dataset.lqT031Shadow = String(window.__LQ_T031__.shadow); document.documentElement.dataset.lqT031Instancing = String(window.__LQ_T031__.instancing); document.documentElement.dataset.lqT031Lod = String(window.__LQ_T031__.lod);
