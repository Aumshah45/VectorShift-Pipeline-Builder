import os
from collections import deque
from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Comma-separated CORS allowlist via env (e.g. "https://your-app.vercel.app").
# Defaults to "*" so a freshly deployed frontend works out of the box; set
# ALLOWED_ORIGINS in production to restrict it.
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    """Return True if the directed graph (source -> target) is acyclic.

    Uses Kahn's algorithm: repeatedly remove nodes with no incoming edges.
    If every node can be removed this way, there is no cycle.
    """
    node_ids = {node["id"] for node in nodes}
    adjacency: Dict[str, List[str]] = {nid: [] for nid in node_ids}
    indegree: Dict[str, int] = {nid: 0 for nid in node_ids}

    for edge in edges:
        src, dst = edge.get("source"), edge.get("target")
        if src in node_ids and dst in node_ids:
            adjacency[src].append(dst)
            indegree[dst] += 1

    queue = deque(nid for nid in node_ids if indegree[nid] == 0)
    visited = 0
    while queue:
        current = queue.popleft()
        visited += 1
        for neighbor in adjacency[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    return {
        "num_nodes": len(pipeline.nodes),
        "num_edges": len(pipeline.edges),
        "is_dag": is_dag(pipeline.nodes, pipeline.edges),
    }
