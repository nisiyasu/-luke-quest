from __future__ import annotations

import argparse
import asyncio
import hashlib
import importlib.metadata as metadata
import json
import os
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

import httpx
from graphiti_core.driver.neo4j_driver import Neo4jDriver
from graphiti_core.nodes import EntityNode, EpisodicNode, EpisodeType
from graphiti_core.edges import EntityEdge, EpisodicEdge

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env.local"
NS = uuid.UUID("c65bc20a-5096-40de-8a1f-c508639a29c2")

SUPPORTED_GRAPHITI_CORE = "0.30.2"
SUPPORTED_NEO4J = "6.3.1"
WRAPPER_VERSION = "2.1.1"
SEED_SCHEMA = "LQ_GRAPHITI_SEED_V2"

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


def stable_id(group_id: str, kind: str, key: str) -> str:
    # group_id is intentionally part of the deterministic UUID namespace.
    return str(uuid.uuid5(NS, f"{group_id}:{kind}:{key}"))


def parse_dt(value: str | None, default: datetime | None = None) -> datetime:
    if value:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    return default or datetime.now(timezone.utc)


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if not ENV_FILE.exists():
        raise RuntimeError(f"missing env file: {ENV_FILE}")
    for line in ENV_FILE.read_text(encoding="utf-8-sig").splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


def make_driver() -> Neo4jDriver:
    env = load_env()
    return Neo4jDriver(
        env["NEO4J_URI"],
        env.get("NEO4J_USER", "neo4j"),
        env["NEO4J_PASSWORD"],
    )


def versions() -> dict[str, str]:
    return {
        "graphiti-core": metadata.version("graphiti-core"),
        "neo4j": metadata.version("neo4j"),
        "httpx": metadata.version("httpx"),
        "pydantic": metadata.version("pydantic"),
    }


def assert_supported_versions() -> None:
    v = versions()
    if v["graphiti-core"] != SUPPORTED_GRAPHITI_CORE:
        raise RuntimeError(
            f"graphiti-core version mismatch: expected {SUPPORTED_GRAPHITI_CORE}, got {v['graphiti-core']}"
        )
    if v["neo4j"] != SUPPORTED_NEO4J:
        raise RuntimeError(
            f"neo4j version mismatch: expected {SUPPORTED_NEO4J}, got {v['neo4j']}"
        )


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def atomic_write_json(path: Path, obj: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    os.replace(tmp, path)


def emit(obj: object, out_path: str | None) -> None:
    if out_path:
        atomic_write_json(Path(out_path), obj)
    else:
        print(json.dumps(obj, ensure_ascii=False, indent=2, default=str))


def validate_seed(data: dict) -> None:
    if data.get("schema_version") != SEED_SCHEMA:
        raise RuntimeError(
            f"seed schema mismatch: expected {SEED_SCHEMA}, got {data.get('schema_version')!r}"
        )
    group_id = data.get("group_id")
    if not group_id or not isinstance(group_id, str):
        raise RuntimeError("seed group_id is required")

    entities = data.get("entities") or []
    episodes = data.get("episodes") or []
    facts = data.get("facts") or []

    def unique_keys(items: list[dict], label: str) -> set[str]:
        keys = [x.get("key") for x in items]
        if any(not k for k in keys):
            raise RuntimeError(f"{label} contains missing key")
        if len(set(keys)) != len(keys):
            raise RuntimeError(f"{label} contains duplicate key")
        return set(keys)

    entity_keys = unique_keys(entities, "entities")
    episode_keys = unique_keys(episodes, "episodes")
    unique_keys(facts, "facts")

    for f in facts:
        if f.get("source") not in entity_keys or f.get("target") not in entity_keys:
            raise RuntimeError(f"fact {f.get('key')} references unknown entity")
        for ep in f.get("episodes", []):
            if ep not in episode_keys:
                raise RuntimeError(f"fact {f.get('key')} references unknown episode {ep}")

    for f in facts:
        valid_at = parse_dt(f.get("valid_at"))
        invalid_at = parse_dt(f["invalid_at"]) if f.get("invalid_at") else None
        if invalid_at is not None and invalid_at < valid_at:
            raise RuntimeError(f"fact {f.get('key')} invalid_at precedes valid_at")


async def embed(client: httpx.AsyncClient, text: str) -> list[float]:
    response = await client.post(
        "http://127.0.0.1:11434/v1/embeddings",
        json={"model": "nomic-embed-text", "input": text},
    )
    response.raise_for_status()
    return response.json()["data"][0]["embedding"]


async def group_counts(driver: Neo4jDriver, group_id: str) -> dict[str, int]:
    q = """
    MATCH (n {group_id: $group_id})
    WITH count(n) AS nodes
    OPTIONAL MATCH ()-[r]->()
    WHERE r.group_id = $group_id
    RETURN nodes, count(r) AS relationships
    """
    result = await driver.execute_query(q, group_id=group_id)
    row = result.records[0].data() if result.records else {"nodes": 0, "relationships": 0}

    eq = """
    MATCH (e:Episodic {group_id: $group_id})
    RETURN count(e) AS episodes
    """
    er = await driver.execute_query(eq, group_id=group_id)
    episodes = er.records[0]["episodes"] if er.records else 0

    nq = """
    MATCH (e:Entity {group_id: $group_id})
    RETURN count(e) AS entities
    """
    nr = await driver.execute_query(nq, group_id=group_id)
    entities = nr.records[0]["entities"] if nr.records else 0

    fq = """
    MATCH (:Entity {group_id: $group_id})-[r]->(:Entity {group_id: $group_id})
    WHERE r.group_id = $group_id AND r.fact IS NOT NULL
    RETURN count(r) AS facts
    """
    fr = await driver.execute_query(fq, group_id=group_id)
    facts = fr.records[0]["facts"] if fr.records else 0

    return {
        "nodes_total": int(row.get("nodes", 0)),
        "relationships_total": int(row.get("relationships", 0)),
        "entities": int(entities),
        "episodes": int(episodes),
        "facts": int(facts),
    }


async def ingest(seed_path: Path, out_path: str | None) -> None:
    assert_supported_versions()
    raw = seed_path.read_text(encoding="utf-8")
    data = json.loads(raw)
    validate_seed(data)

    group_id = data["group_id"]
    seed_generated_at = parse_dt(
        data.get("generated_at"),
        datetime(2026, 9, 22, 13, 30, tzinfo=timezone.utc),
    )
    driver = make_driver()
    embedding_client = httpx.AsyncClient(timeout=60.0)

    entity_ids = {
        e["key"]: stable_id(group_id, "entity", e["key"]) for e in data["entities"]
    }
    episode_ids = {
        e["key"]: stable_id(group_id, "episode", e["key"]) for e in data["episodes"]
    }

    try:
        for e in data["entities"]:
            node = EntityNode(
                uuid=entity_ids[e["key"]],
                name=e["name"],
                group_id=group_id,
                labels=e.get("labels", ["OwnerMemory"]),
                created_at=seed_generated_at,
                name_embedding=await embed(
                    embedding_client, e["name"] + " " + e.get("summary", "")
                ),
                summary=e.get("summary", ""),
                attributes={
                    **e.get("attributes", {}),
                    "seed_key": e["key"],
                    "seed_schema": SEED_SCHEMA,
                    "seed_version": data.get("seed_version"),
                },
            )
            await node.save(driver)

        for ep in data["episodes"]:
            ep_created_at = parse_dt(ep.get("created_at"), seed_generated_at)
            node = EpisodicNode(
                uuid=episode_ids[ep["key"]],
                name=ep["name"],
                group_id=group_id,
                labels=["OwnerMemoryEpisode"],
                created_at=ep_created_at,
                source=EpisodeType.text,
                source_description=ep["source_description"],
                content=ep["content"],
                valid_at=parse_dt(ep.get("valid_at"), ep_created_at),
                entity_edges=[],
                episode_metadata={
                    **(ep.get("metadata") or {}),
                    "seed_key": ep["key"],
                    "seed_schema": SEED_SCHEMA,
                    "seed_version": data.get("seed_version"),
                },
            )
            await node.save(driver)

        linked: set[tuple[str, str]] = set()
        for f in data["facts"]:
            edge_id = stable_id(group_id, "fact", f["key"])
            episode_refs = [episode_ids[x] for x in f.get("episodes", [])]
            edge = EntityEdge(
                uuid=edge_id,
                group_id=group_id,
                source_node_uuid=entity_ids[f["source"]],
                target_node_uuid=entity_ids[f["target"]],
                created_at=seed_generated_at,
                name=f["name"],
                fact=f["fact"],
                fact_embedding=await embed(embedding_client, f["fact"]),
                episodes=episode_refs,
                valid_at=parse_dt(f.get("valid_at"), seed_generated_at),
                invalid_at=parse_dt(f["invalid_at"]) if f.get("invalid_at") else None,
                reference_time=parse_dt(
                    f.get("reference_time") or f.get("valid_at"), seed_generated_at
                ),
                attributes={
                    **f.get("attributes", {}),
                    "seed_key": f["key"],
                    "seed_schema": SEED_SCHEMA,
                    "seed_version": data.get("seed_version"),
                },
            )
            await edge.save(driver)

            for ep_key in f.get("episodes", []):
                for ent_key in (f["source"], f["target"]):
                    pair = (ep_key, ent_key)
                    if pair in linked:
                        continue
                    linked.add(pair)
                    rel = EpisodicEdge(
                        uuid=stable_id(
                            group_id, "episode_entity", ep_key + ":" + ent_key
                        ),
                        group_id=group_id,
                        source_node_uuid=episode_ids[ep_key],
                        target_node_uuid=entity_ids[ent_key],
                        created_at=seed_generated_at,
                    )
                    await rel.save(driver)

        counts = await group_counts(driver, group_id)
        result = {
            "status": "INGEST_OK",
            "wrapper_version": WRAPPER_VERSION,
            "group_id": group_id,
            "seed_path": str(seed_path),
            "seed_sha256": hashlib.sha256(raw.encode("utf-8")).hexdigest(),
            "versions": versions(),
            "expected": {
                "entities": len(data["entities"]),
                "episodes": len(data["episodes"]),
                "facts": len(data["facts"]),
            },
            "counts": counts,
        }
        emit(result, out_path)
    finally:
        await embedding_client.aclose()
        await driver.close()


async def query(term: str, group_id: str, out_path: str | None) -> None:
    assert_supported_versions()
    driver = make_driver()
    q = """
    MATCH (n:Entity {group_id: $group_id})
    OPTIONAL MATCH (n)-[out]->(m:Entity {group_id: $group_id})
    OPTIONAL MATCH (p:Entity {group_id: $group_id})-[inc]->(n)
    WHERE toLower(n.name) CONTAINS toLower($term)
       OR toLower(coalesce(n.summary,'')) CONTAINS toLower($term)
       OR toLower(coalesce(out.fact,'')) CONTAINS toLower($term)
       OR toLower(coalesce(inc.fact,'')) CONTAINS toLower($term)
    RETURN n.uuid AS uuid, n.name AS name, n.summary AS summary,
           n.sequence AS sequence,
           collect(DISTINCT {
             direction:'OUT', relation:out.name, fact:out.fact, other:m.name,
             episodes:out.episodes,
             valid_at:toString(out.valid_at), invalid_at:toString(out.invalid_at)
           }) AS outgoing,
           collect(DISTINCT {
             direction:'IN', relation:inc.name, fact:inc.fact, other:p.name,
             episodes:inc.episodes,
             valid_at:toString(inc.valid_at), invalid_at:toString(inc.invalid_at)
           }) AS incoming
    ORDER BY n.sequence
    """
    try:
        result = await driver.execute_query(q, group_id=group_id, term=term)
        rows = [r.data() for r in result.records]
        emit(
            {
                "status": "QUERY_OK",
                "wrapper_version": WRAPPER_VERSION,
                "group_id": group_id,
                "term": term,
                "rows": rows,
            },
            out_path,
        )
    finally:
        await driver.close()


async def chain(group_id: str, out_path: str | None) -> None:
    assert_supported_versions()
    driver = make_driver()
    q = """
    MATCH (a:Entity {group_id:$group_id})-[r]->(b:Entity {group_id:$group_id})
    WHERE r.name IN ['LEADS_TO','CURRENT_IS','ACTIVE_INSERT','RETURN_POINT','AUTHORITY_IS','ROLE_IS']
    RETURN a.name AS source, r.name AS relation, r.fact AS fact,
           b.name AS target, a.sequence AS source_sequence,
           b.sequence AS target_sequence,
           r.episodes AS episode_uuids,
           toString(r.valid_at) AS valid_at,
           toString(r.invalid_at) AS invalid_at
    ORDER BY coalesce(a.sequence,999), coalesce(b.sequence,999)
    """
    eq = """
    MATCH (e:Episodic {group_id:$group_id})
    RETURN e.uuid AS uuid, e.name AS name, e.source_description AS source_description,
           e.content AS content, toString(e.valid_at) AS valid_at
    ORDER BY e.valid_at
    """
    try:
        result = await driver.execute_query(q, group_id=group_id)
        episodes_result = await driver.execute_query(eq, group_id=group_id)
        episodes = {r["uuid"]: r.data() for r in episodes_result.records}
        rows = []
        for record in result.records:
            row = record.data()
            row["episode_provenance"] = [
                episodes[x] for x in (row.get("episode_uuids") or []) if x in episodes
            ]
            rows.append(row)
        emit(
            {
                "status": "CHAIN_OK",
                "wrapper_version": WRAPPER_VERSION,
                "group_id": group_id,
                "rows": rows,
            },
            out_path,
        )
    finally:
        await driver.close()


async def health(group_id: str, out_path: str | None) -> None:
    assert_supported_versions()
    driver = make_driver()
    try:
        counts = await group_counts(driver, group_id)
        emit(
            {
                "status": "HEALTH_OK",
                "wrapper_version": WRAPPER_VERSION,
                "group_id": group_id,
                "versions": versions(),
                "counts": counts,
            },
            out_path,
        )
    finally:
        await driver.close()


async def reset_group(group_id: str, confirm: str, out_path: str | None) -> None:
    assert_supported_versions()
    if confirm != group_id:
        raise RuntimeError("reset-group requires --confirm exactly equal to group_id")
    driver = make_driver()
    try:
        before = await group_counts(driver, group_id)
        await driver.execute_query(
            """
            MATCH ()-[r]->()
            WHERE r.group_id = $group_id
            DELETE r
            """,
            group_id=group_id,
        )
        await driver.execute_query(
            """
            MATCH (n)
            WHERE n.group_id = $group_id
            DETACH DELETE n
            """,
            group_id=group_id,
        )
        after = await group_counts(driver, group_id)
        emit(
            {
                "status": "RESET_OK",
                "wrapper_version": WRAPPER_VERSION,
                "group_id": group_id,
                "before": before,
                "after": after,
            },
            out_path,
        )
    finally:
        await driver.close()



async def sync_event(event_path: Path, out_path: str | None) -> None:
    assert_supported_versions()
    raw = event_path.read_text(encoding="utf-8")
    event = json.loads(raw)
    if event.get("schema") != "LQ_GRAPHITI_SYNC_EVENT_V1":
        raise RuntimeError("unsupported sync event schema")
    required = [
        "event_id","group_id","event_kind","source_repository","source_ref",
        "source_locator","observed_at","valid_at","content","content_sha256"
    ]
    missing = [k for k in required if not event.get(k)]
    if missing:
        raise RuntimeError(f"sync event missing fields: {missing}")
    if sha256_text(event["content"]) != event["content_sha256"]:
        raise RuntimeError("sync event content_sha256 mismatch")

    group_id = event["group_id"]
    driver = make_driver()
    try:
        episode_uuid = stable_id(group_id, "sync_event", event["event_id"])
        created_at = parse_dt(event["observed_at"])
        node = EpisodicNode(
            uuid=episode_uuid,
            name=f"{event['event_kind']}:{event['event_id']}",
            group_id=group_id,
            labels=["OwnerMemoryEpisode","DurableSyncEvent"],
            created_at=created_at,
            source=EpisodeType.text,
            source_description=event["source_locator"],
            content=event["content"],
            valid_at=parse_dt(event["valid_at"]),
            entity_edges=[],
            episode_metadata={
                "event_id": event["event_id"],
                "event_kind": event["event_kind"],
                "source_repository": event["source_repository"],
                "source_ref": event["source_ref"],
                "content_sha256": event["content_sha256"],
                "observed_at": event["observed_at"],
            },
        )
        await node.save(driver)

        q = """
        MATCH (e:Episodic {group_id:$group_id, uuid:$uuid})
        RETURN e.uuid AS uuid, e.name AS name, e.content AS content,
               e.source_description AS source_description,
               toString(e.valid_at) AS valid_at
        """
        rb = await driver.execute_query(q, group_id=group_id, uuid=episode_uuid)
        if not rb.records:
            raise RuntimeError("sync event readback failed")
        row = rb.records[0].data()
        if row.get("content") != event["content"]:
            raise RuntimeError("sync event readback content mismatch")

        emit({
            "schema":"LQ_GRAPHITI_SYNC_RECEIPT_V1",
            "status":"SYNC_OK",
            "event_id":event["event_id"],
            "group_id":group_id,
            "episode_uuid":episode_uuid,
            "synced_at":datetime.now(timezone.utc).isoformat(),
            "wrapper_version":WRAPPER_VERSION,
            "graphiti_core_version":versions()["graphiti-core"],
            "graphiti_readback_status":"PASS",
        }, out_path)
    finally:
        await driver.close()


async def events(group_id: str, limit: int, out_path: str | None) -> None:
    assert_supported_versions()
    driver = make_driver()
    q = """
    MATCH (e:Episodic {group_id:$group_id})
    RETURN e.uuid AS uuid, e.name AS name, e.content AS content,
           e.source_description AS source_description,
           toString(e.created_at) AS created_at,
           toString(e.valid_at) AS valid_at
    ORDER BY e.valid_at DESC, e.created_at DESC
    LIMIT $limit
    """
    try:
        result = await driver.execute_query(q, group_id=group_id, limit=limit)
        rows = [r.data() for r in result.records]
        emit({
            "status":"EVENTS_OK",
            "wrapper_version":WRAPPER_VERSION,
            "group_id":group_id,
            "rows":rows,
        }, out_path)
    finally:
        await driver.close()


async def main() -> None:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="command", required=True)

    p_ingest = sub.add_parser("ingest")
    p_ingest.add_argument("seed")
    p_ingest.add_argument("--out")

    p_query = sub.add_parser("query")
    p_query.add_argument("term")
    p_query.add_argument("group_id")
    p_query.add_argument("--out")

    p_chain = sub.add_parser("chain")
    p_chain.add_argument("group_id")
    p_chain.add_argument("--out")

    p_health = sub.add_parser("health")
    p_health.add_argument("group_id")
    p_health.add_argument("--out")

    p_reset = sub.add_parser("reset-group")
    p_reset.add_argument("group_id")
    p_reset.add_argument("--confirm", required=True)
    p_reset.add_argument("--out")

    p_sync = sub.add_parser("sync-event")
    p_sync.add_argument("event")
    p_sync.add_argument("--out")

    p_events = sub.add_parser("events")
    p_events.add_argument("group_id")
    p_events.add_argument("--limit", type=int, default=20)
    p_events.add_argument("--out")

    args = ap.parse_args()

    if args.command == "ingest":
        await ingest(Path(args.seed), args.out)
    elif args.command == "query":
        await query(args.term, args.group_id, args.out)
    elif args.command == "chain":
        await chain(args.group_id, args.out)
    elif args.command == "health":
        await health(args.group_id, args.out)
    elif args.command == "reset-group":
        await reset_group(args.group_id, args.confirm, args.out)
    elif args.command == "sync-event":
        await sync_event(Path(args.event), args.out)
    elif args.command == "events":
        await events(args.group_id, args.limit, args.out)


if __name__ == "__main__":
    asyncio.run(main())
