// index.js
// Turns the declarative configs into ReactFlow's nodeTypes map and the toolbar
// list, and builds a node's initial data. All stay in sync as configs are added.

import { BaseNode } from '../components/BaseNode';
import { nodeConfigs } from './nodeConfigs';

const makeNodeComponent = (config) => {
  const NodeComponent = (props) => <BaseNode {...props} config={config} />;
  NodeComponent.displayName = `${config.title}Node`;
  return NodeComponent;
};

export const nodeTypes = Object.fromEntries(
  Object.values(nodeConfigs).map((config) => [config.type, makeNodeComponent(config)])
);

export const toolbarItems = Object.values(nodeConfigs).map((config) => ({
  type: config.type,
  label: config.title,
}));

// Builds a node's initial data, seeded with its config field defaults, so the
// store is the single source of truth from the moment a node is created.
export const createInitialNodeData = (id, type) => {
  const config = nodeConfigs[type];
  const data = { id, nodeType: type };
  (config?.fields ?? []).forEach((field) => {
    data[field.name] = typeof field.default === 'function' ? field.default(id) : field.default ?? '';
  });
  return data;
};
