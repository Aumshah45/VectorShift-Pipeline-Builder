// PipelineToolbar.js
// The palette of draggable node types, generated from the node registry.

import { DraggableNode } from './DraggableNode';
import { toolbarItems } from '../nodes';

export const PipelineToolbar = () => (
  <div className="vs-toolbar">
    <span className="vs-toolbar__eyebrow">Nodes — drag onto the canvas</span>
    <div className="vs-toolbar__chips">
      {toolbarItems.map((item) => (
        <DraggableNode key={item.type} type={item.type} label={item.label} />
      ))}
    </div>
  </div>
);
