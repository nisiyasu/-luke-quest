import importlib.util
import inspect
import pathlib
import unittest

HERE = pathlib.Path(__file__).resolve().parent
MODULE = HERE.parent / "tools" / "env_visual_gateway" / "fenced_gateway.py"
spec = importlib.util.spec_from_file_location("lq_env_gateway", MODULE)
gw = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gw)


class BombGitHub:
    def __getattr__(self, name):
        raise AssertionError(f"GitHub must not be touched in disabled mode: {name}")


class JournalGitHub:
    def __init__(self):
        self.head = "control-head-1"
        self.files = {
            "lease-state.json": {
                "OWNER_RUN_ID": "run-1",
                "LEASE_EPOCH": 7,
                "LEASE_STATUS": gw.ACTIVE,
                "LEASE_UNTIL": "2099-01-01T00:00:00Z",
                "ACTIVE_OPERATION_ID": None,
            }
        }

    def ref(self, branch):
        return self.head

    def json_file(self, branch, path):
        if path not in self.files:
            raise gw.ApiError(404, "not found")
        return dict(self.files[path])

    def cas_write_files(self, branch, files, message, expected_head=None, retries=8):
        if expected_head is not None and expected_head != self.head:
            raise gw.CasConflict("head mismatch")
        import json
        for path, content in files.items():
            self.files[path] = json.loads(content.decode("utf-8"))
        self.head = "control-head-2"
        return self.head


class GatewayStaticTests(unittest.TestCase):
    def test_production_disabled_blocks_before_any_github_access(self):
        gateway = gw.Gateway(BombGitHub(), production_enabled=False)
        with self.assertRaisesRegex(gw.RequestRejected, "production mutation disabled"):
            gateway.apply({})

    def test_lane_boundaries(self):
        self.assertEqual(gw.ALLOWED_LANES["village"]["parent"], 51)
        self.assertEqual(gw.ALLOWED_LANES["castle"]["parent"], 52)
        self.assertEqual(gw.ALLOWED_LANES["dungeon"]["parent"], 53)
        self.assertNotIn(12, gw.ALLOWED_LANES["village"]["children"])
        self.assertEqual(gw.EVIDENCE_BRANCH, "evidence/visual-verification")

    def test_fixed_target_authorities(self):
        expected = {
            "village": "e6536371eddcc7fb5cf5803568216f008011a5f1",
            "castle": "573c13225471820d063043a37e3ee26fad389d63",
            "dungeon": "198d0f5f3da115b70218ae8180d5f8363d744959",
        }
        for lane, blob in expected.items():
            self.assertEqual(gw.ALLOWED_LANES[lane]["target_blob_sha"], blob)
            self.assertEqual(
                gw.ALLOWED_LANES[lane]["target_source_commit_sha"],
                "0d225f77944eb54eed648b76f00869879f4284ff",
            )
        self.assertEqual(gw.CANONICAL_VIEWPORT, [941, 1672])

    def test_request_channel_source_is_persisted_in_operation_journal(self):
        fake = JournalGitHub()
        source = {
            "repository": "nisiyasu/luke-env-gateway-requests",
            "ref": "main",
            "commit_sha": "abc123",
            "path": "requests/village/r1.json",
            "blob_sha": "blob123",
        }
        gateway = gw.Gateway(fake, production_enabled=True, request_source=source)
        req = {
            "lane_id": "village",
            "owner_run_id": "run-1",
            "lease_epoch": 7,
            "operation_id": "op-1",
            "request_id": "r1",
            "request_sha256": "hash-1",
        }
        _, op, _ = gateway._start_operation(
            req,
            "ISSUE_COMMENT",
            "issue-54",
            "RESULT_CONFIRMATION_REQUIRED",
        )
        self.assertEqual(op["REQUEST_CHANNEL_SOURCE"], source)

    def test_artifact_publish_operation_is_allowlisted(self):
        source = inspect.getsource(gw.Gateway.apply)
        self.assertIn("DURABLE_EVIDENCE_PUBLISH_FROM_ARTIFACT", source)
        self.assertTrue(
            hasattr(gw.Gateway, "durable_evidence_publish_from_artifact")
        )

    def test_artifact_provenance_is_retry_deterministic(self):
        source = inspect.getsource(
            gw.Gateway.durable_evidence_publish_from_artifact
        )
        self.assertNotIn('"imported_at"', source)
        self.assertIn('"artifact_created_at"', source)
        self.assertIn('"artifact_updated_at"', source)

    def test_request_hash_is_self_excluding(self):
        req = {
            "schema": "LUKE_QUEST_ENV_GATEWAY_REQUEST:v1",
            "request_id": "R1",
            "lane_id": "village",
            "owner_run_id": "run-1",
            "lease_epoch": 0,
            "operation_id": "op-1",
            "operation_type": "LEASE_ACQUIRE",
            "expected_target_identity": {},
            "payload": {},
            "request_sha256": "",
        }
        expected = gw.sha256_text(gw.canonical(req))
        req["request_sha256"] = expected
        normalized = dict(req)
        normalized["request_sha256"] = ""
        self.assertEqual(gw.sha256_text(gw.canonical(normalized)), expected)


if __name__ == "__main__":
    unittest.main()
