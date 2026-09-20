import importlib.util
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
MOD = ROOT / "tools" / "canonical_field_gateway" / "canonical_gateway.py"
spec = importlib.util.spec_from_file_location("canonical_field_gateway", MOD)
cg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cg)


class CanonicalFieldGatewayStaticTests(unittest.TestCase):
    def test_fixed_authority(self):
        self.assertEqual(cg.PARENT_ISSUE, 12)
        self.assertEqual(cg.ROUTER_COMMENT_ID, 5646492352)
        self.assertEqual(cg.IMPLEMENTATION_BRANCH, "prototype/modern-3d")
        self.assertEqual(cg.CONTROL_BRANCH, "control/lease-canonical-field")
        self.assertEqual(
            cg.TARGET_BLOB_SHA,
            "b7281e6580689a7a22cfa3b67d500950e4af7285",
        )

    def test_router_parser_accepts_valid_router(self):
        body = """<!-- WORK_PACKET_ROUTER:v1 -->
PROGRAM_ID: LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2
PARENT_ISSUE: #12
CURRENT_STAGE: M02
CURRENT_PACKET_ID: M02-P01
CURRENT_PACKET_ISSUE: #28
NEXT_PACKET_ID: M03-P01
STATUS: ACTIVE
ROUTER_VERSION: v1
LAST_TRANSITION: test
"""
        parsed = cg.parse_router(body)
        self.assertEqual(parsed["_CURRENT_PACKET_NUMBER"], 28)
        self.assertEqual(parsed["CURRENT_PACKET_ID"], "M02-P01")

    def test_router_parser_rejects_outside_packet_range(self):
        body = """<!-- WORK_PACKET_ROUTER:v1 -->
PROGRAM_ID: LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2
PARENT_ISSUE: #12
CURRENT_PACKET_ID: BAD
CURRENT_PACKET_ISSUE: #51
ROUTER_VERSION: v1
"""
        with self.assertRaises(cg.base.RequestRejected):
            cg.parse_router(body)

    def test_packet_id_parser(self):
        self.assertEqual(
            cg.packet_id_from_issue_body("x\nPACKET_ID: M02-P01\ny"),
            "M02-P01",
        )


if __name__ == "__main__":
    unittest.main()
