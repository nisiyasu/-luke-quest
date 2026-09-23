import importlib.util
import pathlib
import sys
import unittest

HERE = pathlib.Path(__file__).resolve().parent
TOOLS = HERE.parent / "tools" / "env_visual_gateway"
sys.path.insert(0, str(TOOLS))
MODULE = TOOLS / "request_channel_poller.py"
spec = importlib.util.spec_from_file_location("lq_env_request_poller", MODULE)
poller = importlib.util.module_from_spec(spec)
spec.loader.exec_module(poller)


class RequestPollerBudgetTests(unittest.TestCase):
    def test_terminal_requests_do_not_consume_pending_budget(self):
        items = [
            {"path": f"requests/visual-rebuild/old-{i:02d}.json", "lane_from_path": "visual-rebuild"}
            for i in range(30)
        ]
        items += [
            {"path": f"requests/visual-rebuild/new-{i:02d}.json", "lane_from_path": "visual-rebuild"}
            for i in range(5)
        ]
        terminal = {f"old-{i:02d}" for i in range(30)}

        pending = poller.pending_request_items(items, terminal)

        self.assertEqual(
            [pathlib.PurePosixPath(item["path"]).stem for item in pending],
            [f"new-{i:02d}" for i in range(5)],
        )

    def test_other_lane_pending_requests_are_preserved(self):
        items = [
            {"path": "requests/village/v-old.json", "lane_from_path": "village"},
            {"path": "requests/visual-rebuild/vr-new.json", "lane_from_path": "visual-rebuild"},
            {"path": "requests/castle/c-new.json", "lane_from_path": "castle"},
        ]
        pending = poller.pending_request_items(items, {"v-old"})
        self.assertEqual(
            [item["path"] for item in pending],
            [
                "requests/visual-rebuild/vr-new.json",
                "requests/castle/c-new.json",
            ],
        )


if __name__ == "__main__":
    unittest.main()
