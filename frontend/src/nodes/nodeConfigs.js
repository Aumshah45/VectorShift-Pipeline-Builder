// nodeConfigs.js
// The single source of truth for every node in the app. Each entry is a plain,
// declarative config; BaseNode + the field registry turn it into a working,
// styled node. Creating a new node = adding one object here.
//
// Config shape:
//   type        unique key (matches the ReactFlow node type)
//   title       header label (also used in the toolbar)
//   description optional static helper text
//   fields[]    { name, label?, type, options?, default?, placeholder? }
//               default may be a value or a fn (id) => value
//   handles     array of { type, position, id }  -- or a fn (data) => handles[]

import { extractVariables } from './textVariables';

export const nodeConfigs = {
  // ---- Original four nodes, now fully declarative -------------------------
  customInput: {
    type: 'customInput',
    title: 'Input',
    fields: [
      { name: 'inputName', label: 'Name', type: 'text', default: (id) => id.replace('customInput-', 'input_') },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], default: 'Text' },
    ],
    handles: [{ type: 'source', position: 'right', id: 'value' }],
  },

  llm: {
    type: 'llm',
    title: 'LLM',
    description: 'This is a LLM.',
    handles: [
      { type: 'target', position: 'left', id: 'system' },
      { type: 'target', position: 'left', id: 'prompt' },
      { type: 'source', position: 'right', id: 'response' },
    ],
  },

  customOutput: {
    type: 'customOutput',
    title: 'Output',
    fields: [
      { name: 'outputName', label: 'Name', type: 'text', default: (id) => id.replace('customOutput-', 'output_') },
      { name: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image'], default: 'Text' },
    ],
    handles: [{ type: 'target', position: 'left', id: 'value' }],
  },

  text: {
    type: 'text',
    title: 'Text',
    fields: [{ name: 'text', label: 'Text', type: 'autoTextarea', default: '{{input}}' }],
    // Dynamic: one input handle per {{ variable }}, plus the output handle.
    handles: (data) => [
      ...extractVariables(data?.text || '').map((name) => ({
        type: 'target',
        position: 'left',
        id: name,
      })),
      { type: 'source', position: 'right', id: 'output' },
    ],
  },

  // ---- Five new nodes demonstrating the abstraction's flexibility ---------
  math: {
    type: 'math',
    title: 'Math',
    fields: [{ name: 'operator', label: 'Operator', type: 'select', options: ['+', '-', '×', '÷'], default: '+' }],
    handles: [
      { type: 'target', position: 'left', id: 'a' },
      { type: 'target', position: 'left', id: 'b' },
      { type: 'source', position: 'right', id: 'result' },
    ],
  },

  filter: {
    type: 'filter',
    title: 'Filter',
    fields: [{ name: 'condition', label: 'Keep when', type: 'select', options: ['Truthy', 'Falsy', 'Non-empty', '> 0'], default: 'Truthy' }],
    handles: [
      { type: 'target', position: 'left', id: 'in' },
      { type: 'source', position: 'right', id: 'out' },
    ],
  },

  api: {
    type: 'api',
    title: 'API Request',
    fields: [
      { name: 'url', label: 'URL', type: 'text', default: 'https://' },
      { name: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'body' },
      { type: 'source', position: 'right', id: 'response' },
    ],
  },

  note: {
    type: 'note',
    title: 'Note',
    // No handles at all -- proves the abstraction handles "chrome-less" nodes.
    fields: [{ name: 'note', type: 'autoTextarea', default: 'Write a note…' }],
    handles: [],
  },

  delay: {
    type: 'delay',
    title: 'Delay',
    fields: [{ name: 'seconds', label: 'Seconds', type: 'number', default: 1 }],
    handles: [
      { type: 'target', position: 'left', id: 'in' },
      { type: 'source', position: 'right', id: 'out' },
    ],
  },
};
