// SubmitButton.js
// Sends the current pipeline to the backend and surfaces the result as a toast.

import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { parsePipeline } from '../lib/api';
import { PipelineResultToast } from './PipelineResultToast';

const TOAST_DURATION_MS = 6000;

export const SubmitButton = () => {
  const [result, setResult] = useState(null);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!result) return undefined;
    const timer = setTimeout(() => setResult(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [result]);

  const handleSubmit = async () => {
    // Read the latest graph straight from the store at click time.
    const { nodes, edges } = useStore.getState();
    try {
      const data = await parsePipeline({ nodes, edges });
      setResult({ type: 'success', ...data });
    } catch (error) {
      setResult({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="vs-footer">
      <button type="button" className="vs-submit" onClick={handleSubmit}>
        Submit Pipeline
      </button>
      {result && <PipelineResultToast result={result} onClose={() => setResult(null)} />}
    </div>
  );
};
