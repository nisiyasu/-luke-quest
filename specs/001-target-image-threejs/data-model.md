# Data Model / データモデル

## ReferenceSet
- id
- version
- status: current | legacy
- images[]
- owner_approved_at

## ReferenceImage
- reference_id
- role_authority[]
- source_branch
- source_commit
- path
- blob_sha
- priority
- scene

## CanonicalState
- scene_id
- player_position
- player_orientation
- camera_state
- time_of_day
- weather
- animation_state
- ui_state
- orientation
- viewport

## Landmark
- landmark_id
- component_id
- priority: P0 | P1 | P2
- target_center_x
- target_center_y
- target_roi
- depth_intent
- occlusion_order
- silhouette_mask_ref

## GateRecord
- gate_id: G0..G7
- status: OPEN | PASS | FAIL | INVALIDATED
- target_identity
- implementation_head
- evidence_set_id
- opened_at
- decided_at
- failure_class
- causal_gate

## EvidenceSet
- evidence_id
- target_ref
- actual_ref
- overlay_ref
- diff_ref
- landmark_measurements_ref
- silhouette_metrics_ref
- human_visual_review_ref
- implementation_head
- viewport
- device_profile
- verdict
- residual_gaps

## DeviceProfile
- profile_id
- physical_device
- os
- browser_or_launch_mode
- gpu_capabilities
- renderer_path
- quality_preset

## PerformanceEvidence
- evidence_id
- device_profile
- scene
- duration
- median_fps
- p95_frame_time_ms
- long_frame_count
- reload_count
- crash_count
- gpu_error_count
- quality_state_changes

## ReuseInventory
- path_or_component
- classification: REUSE | REWRITE | DELETE | UNKNOWN
- old_visual_dependency
- verification
- rationale
