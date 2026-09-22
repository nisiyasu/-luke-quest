export const LQ_TARGET_IMAGE_RUNTIME = Object.freeze({
  program: "#101",
  taskBoundary: "T011",
  implementationRoot: "prototypes/target-image-threejs/",
  legacySceneImports: false,
  legacyMapsAuthority: false,
  legacyAldiaVisualPatches: false,
  phase: "SAFE_RESET"
});

const root = document.getElementById("lq-target-image-root");
if (!root) {
  throw new Error("LUKE target-image clean-room root missing");
}

root.dataset.runtime = "target-image-clean-room-v1";
root.dataset.legacySceneImports = "false";
document.documentElement.dataset.lqTargetImageRuntime = "ready";