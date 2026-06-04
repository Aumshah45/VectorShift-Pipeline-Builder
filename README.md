# VectorShift Pipeline Builder

A visual, node-based pipeline builder — submission for the VectorShift frontend technical assessment.

Drag typed nodes onto a canvas, wire them together, and submit the graph to a FastAPI backend that reports the node/edge counts and whether the pipeline forms a **DAG** (directed acyclic graph).

---

## What's implemented

The assessment has four parts; here's how each is addressed.

| Part | Summary |
|------|---------|
| **1 — Node abstraction** | A config-driven registry: every node is a declarative object in `nodes/nodeConfigs.js`, and a single `BaseNode` + field registry render its chrome, handles, and fields. **Adding a node = adding one config object.** Ships the 4 original nodes (Input, Output, LLM, Text) **+ 5 new** (Math, Filter, API Request, Note, Delay). |
| **2 — Styling** | An "Editorial Blueprint" theme modeled on the live vectorshift.ai brand: warm-paper canvas, bronze accent, **Inter Tight** titles, **Newsreader** serif numerals, **JetBrains Mono** labels, square corners, hairline rules. All design tokens are centralized as CSS variables in `index.css`. |
| **3 — Text node logic** | The Text node auto-resizes (width + height) with its content, and any valid `{{ variable }}` reference dynamically spawns a labeled input handle on the left (deduped, valid-identifier-only). |
| **4 — Backend integration** | Submit POSTs the graph to `/pipelines/parse`. The backend returns `{ num_nodes, num_edges, is_dag }` (DAG check via Kahn's algorithm); the result is surfaced in an in-theme toast. |

## Tech stack

- **Frontend:** React 18 (Create React App), [ReactFlow](https://reactflow.dev/) 11, [Zustand](https://github.com/pmndrs/zustand)
- **Backend:** FastAPI, Pydantic, Uvicorn
- **Tests:** Jest + React Testing Library (frontend), pytest (backend)

## Project structure

```
frontend/
  public/                 # index.html (web fonts), icons, manifest
  src/
    components/           # BaseNode, NodeField, AutoResizeTextarea, DraggableNode,
                          # PipelineToolbar, PipelineUI, SubmitButton, PipelineResultToast
    nodes/                # nodeConfigs (declarative), index (registry), textVariables
    lib/api.js            # backend data-access layer
    config.js             # constants (API URL, canvas)
    store.js              # Zustand store (nodes, edges, ids)
    tests/                # Jest + RTL suites
    App.js  index.js  index.css  setupTests.js
backend/
  main.py                 # FastAPI app + is_dag (Kahn's algorithm)
  requirements.txt        # runtime deps
  pytest.ini              # test config (pythonpath, testpaths)
  tests/                  # pytest suite + requirements-dev.txt
```

---

## Getting started

**Prerequisites:** Node 18+ and Python 3.9+.

### 1. Backend (`http://localhost:8000`)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend (`http://localhost:3000`)

```bash
cd frontend
npm install
npm start
```

The frontend talks to the backend at `http://localhost:8000` by default. To point elsewhere, set `REACT_APP_API_URL` before starting (e.g. `REACT_APP_API_URL=http://localhost:9000 npm start`).

---

## Testing

**Frontend** — 28 tests across 6 suites (variable parsing, node registry, store, API layer, and components):

```bash
cd frontend
CI=true npm test
```

**Backend** — 10 tests covering the DAG algorithm and the `/pipelines/parse` endpoint:

```bash
cd backend
pip install -r tests/requirements-dev.txt
pytest
```

---

## Architecture notes

- **Config-driven nodes.** New node types are pure data (`nodeConfigs.js`); `BaseNode` and the field registry handle rendering. The node registry (`nodes/index.js`) derives ReactFlow's `nodeTypes`, the toolbar list, and initial node data from those configs.
- **Single source of truth.** Field edits flow into the Zustand store, so the submitted pipeline always reflects the live graph.
- **Separation of concerns.** UI in `components/`, node domain logic in `nodes/`, network access in `lib/api.js`, constants in `config.js`, state in `store.js`.
- **Centralized theme.** Every color/font/spacing token lives in `index.css` `:root`, so the whole UI can be re-themed from one place.

## Security

The application code follows safe-by-default practices: React's automatic escaping (no `dangerouslySetInnerHTML`/`eval`), a guarded `JSON.parse` on drop, a self-contained variable regex, and no secrets in the client. `npm audit` findings are entirely transitive dev/build dependencies of the (deprecated) `react-scripts` toolchain — they are not part of the shipped runtime.
