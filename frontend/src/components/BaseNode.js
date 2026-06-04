// BaseNode.js
// The single place node "chrome" lives: container, title, handles, and fields.
// Every node type is just <BaseNode> bound to a declarative config object,
// so creating a new node never touches this file.

import { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';
import { NodeField } from './NodeField';

const POSITION = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  // Handles can be a static array, or a function of the node's data
  // (the Text node uses this to derive handles from {{ variables }}).
  const handles =
    typeof config.handles === 'function' ? config.handles(data) : config.handles || [];
  const targets = handles.filter((h) => h.type === 'target');
  const sources = handles.filter((h) => h.type === 'source');

  // ReactFlow must be notified whenever the set of handles changes, otherwise
  // edges to newly added/removed handles render in the wrong place.
  const handleSignature = handles.map((h) => `${h.type}:${h.id}`).join(',');
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, handleSignature, updateNodeInternals]);

  const renderSide = (list) =>
    list.map((handle, index) => (
      <Handle
        key={`${handle.type}-${handle.id}`}
        type={handle.type}
        position={POSITION[handle.position] ?? Position.Left}
        id={`${id}-${handle.id}`}
        title={handle.id}
        className="vs-node__handle"
        style={{ top: `${((index + 1) * 100) / (list.length + 1)}%` }}
      />
    ));

  return (
    <div className="vs-node">
      {renderSide(targets)}
      <div className="vs-node__title">{config.title}</div>
      <div className="vs-node__body">
        {config.description ? (
          <p className="vs-node__description">{config.description}</p>
        ) : null}
        {(config.fields || []).map((field) => (
          <NodeField
            key={field.name}
            id={id}
            field={field}
            value={data?.[field.name]}
            onChange={updateNodeField}
          />
        ))}
      </div>
      {renderSide(sources)}
    </div>
  );
};
