// PipelineResultToast.js
// In-theme replacement for the required alert: reports node/edge counts and
// whether the submitted pipeline is a DAG.

import { API_URL } from '../config';

export const PipelineResultToast = ({ result, onClose }) => {
  const closeButton = (
    <button className="vs-toast__close" onClick={onClose} aria-label="Dismiss">×</button>
  );

  if (result.type === 'error') {
    return (
      <div className="vs-toast" role="alert">
        {closeButton}
        <span className="vs-toast__eyebrow">Submission failed</span>
        <p className="vs-toast__msg">{result.message}</p>
        <p className="vs-toast__hint">Is the backend running at {API_URL}?</p>
      </div>
    );
  }

  const { num_nodes, num_edges, is_dag } = result;
  return (
    <div className="vs-toast" role="status">
      {closeButton}
      <span className="vs-toast__eyebrow">Pipeline parsed</span>
      <div className="vs-toast__stats">
        <div className="vs-toast__stat">
          <span className="vs-toast__num">{num_nodes}</span>
          <span className="vs-toast__lab">Nodes</span>
        </div>
        <div className="vs-toast__stat">
          <span className="vs-toast__num">{num_edges}</span>
          <span className="vs-toast__lab">Edges</span>
        </div>
      </div>
      <span className={`vs-toast__badge ${is_dag ? 'is-ok' : 'is-warn'}`}>
        {is_dag ? '✓ Valid DAG' : '⚠ Cycle detected — not a DAG'}
      </span>
    </div>
  );
};
