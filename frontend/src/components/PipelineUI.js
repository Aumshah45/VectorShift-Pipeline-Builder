// PipelineUI.js
// The drag-and-drop pipeline canvas (ReactFlow).

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, BackgroundVariant, MiniMap } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { nodeTypes, createInitialNodeData } from '../nodes';
import { GRID_SIZE, CANVAS_DOT_COLOR, MINIMAP_NODE_COLOR, MINIMAP_MASK_COLOR } from '../config';

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const raw = event.dataTransfer?.getData('application/reactflow');
      if (!raw) return;

      let nodeType;
      try {
        nodeType = JSON.parse(raw)?.nodeType;
      } catch {
        return; // ignore drops carrying a malformed payload
      }
      if (!nodeType) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const id = getNodeID(nodeType);
      addNode({ id, type: nodeType, position, data: createInitialNodeData(id, nodeType) });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="vs-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        connectionLineType="smoothstep"
      >
        <Background variant={BackgroundVariant.Dots} color={CANVAS_DOT_COLOR} gap={GRID_SIZE} size={1.5} />
        <Controls />
        <MiniMap nodeColor={MINIMAP_NODE_COLOR} maskColor={MINIMAP_MASK_COLOR} />
      </ReactFlow>
    </div>
  );
};
