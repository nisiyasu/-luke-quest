import importlib.util
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
