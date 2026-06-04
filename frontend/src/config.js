// config.js
// App-wide configuration and constants. The colors here mirror the CSS tokens
// in index.css for the few spots where ReactFlow needs them as JS props.

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Canvas
export const GRID_SIZE = 20;
export const CANVAS_DOT_COLOR = '#d9d3c5'; // --border
export const MINIMAP_NODE_COLOR = '#d9d3c5'; // --border
export const MINIMAP_MASK_COLOR = 'rgba(251, 249, 244, 0.6)'; // --paper @ 60%
