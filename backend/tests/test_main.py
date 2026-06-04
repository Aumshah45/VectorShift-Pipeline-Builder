from fastapi.testclient import TestClient

from main import app, is_dag

client = TestClient(app)


def nodes(*ids):
    return [{"id": i} for i in ids]


def edges(*pairs):
    return [{"source": s, "target": t} for s, t in pairs]


class TestIsDag:
    def test_empty_pipeline_is_a_dag(self):
        assert is_dag([], []) is True

    def test_simple_chain(self):
        assert is_dag(nodes("a", "b", "c"), edges(("a", "b"), ("b", "c"))) is True

    def test_diamond_is_a_dag(self):
        graph = (nodes("a", "b", "c", "d"), edges(("a", "b"), ("a", "c"), ("b", "d"), ("c", "d")))
        assert is_dag(*graph) is True

    def test_cycle_is_not_a_dag(self):
        assert is_dag(nodes("a", "b", "c"), edges(("a", "b"), ("b", "c"), ("c", "a"))) is False

    def test_self_loop_is_not_a_dag(self):
        assert is_dag(nodes("a"), edges(("a", "a"))) is False

    def test_disconnected_nodes_with_no_edges(self):
        assert is_dag(nodes("a", "b", "c"), []) is True

    def test_ignores_edges_referencing_unknown_nodes(self):
        assert is_dag(nodes("a", "b"), edges(("a", "b"), ("a", "ghost"))) is True


class TestParseEndpoint:
    def test_returns_counts_and_dag_flag(self):
        response = client.post(
            "/pipelines/parse",
            json={"nodes": nodes("a", "b", "c"), "edges": edges(("a", "b"), ("b", "c"))},
        )
        assert response.status_code == 200
        assert response.json() == {"num_nodes": 3, "num_edges": 2, "is_dag": True}

    def test_detects_a_cycle(self):
        response = client.post(
            "/pipelines/parse",
            json={"nodes": nodes("a", "b"), "edges": edges(("a", "b"), ("b", "a"))},
        )
        assert response.json() == {"num_nodes": 2, "num_edges": 2, "is_dag": False}

    def test_empty_pipeline(self):
        response = client.post("/pipelines/parse", json={"nodes": [], "edges": []})
        assert response.json() == {"num_nodes": 0, "num_edges": 0, "is_dag": True}
