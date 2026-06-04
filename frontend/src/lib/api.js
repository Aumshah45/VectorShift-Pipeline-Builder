// api.js
// Data-access layer for the pipeline backend.

import { API_URL } from '../config';

/**
 * Sends the pipeline graph to the backend for analysis.
 * @param {{ nodes: object[], edges: object[] }} pipeline
 * @returns {Promise<{ num_nodes: number, num_edges: number, is_dag: boolean }>}
 */
export async function parsePipeline({ nodes, edges }) {
  const response = await fetch(`${API_URL}/pipelines/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges }),
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }

  return response.json();
}
