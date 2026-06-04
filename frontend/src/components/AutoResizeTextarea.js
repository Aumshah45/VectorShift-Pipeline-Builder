// AutoResizeTextarea.js
// A textarea that grows with its content (used by the Text and Note nodes).

import { useLayoutEffect, useRef } from 'react';

const MIN_WIDTH = 170;
const MAX_WIDTH = 460;
const CHAR_WIDTH = 8; // approx. px per character
const PADDING = 24;

export const AutoResizeTextarea = ({ value, placeholder, onChange }) => {
  const ref = useRef(null);
  const text = value ?? '';

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Grow width with the longest line, clamped so the node stays a sane size.
  const longestLine = Math.max(8, ...String(text).split('\n').map((line) => line.length));
  const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH + PADDING));

  return (
    <textarea
      ref={ref}
      className="vs-field__control vs-field__textarea"
      value={text}
      placeholder={placeholder}
      rows={1}
      style={{ width }}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
