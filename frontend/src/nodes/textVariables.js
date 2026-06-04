// textVariables.js
// Extracts unique, valid JS identifiers wrapped in double curly braces, e.g.
// "{{ input }} and {{ count }}" -> ["input", "count"]. Used by the Text node to
// derive an input Handle per variable.

export const extractVariables = (text) => {
  // A fresh regex per call avoids shared `lastIndex` state between calls.
  const pattern = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
  const found = [];
  let match;
  while ((match = pattern.exec(text ?? '')) !== null) {
    if (!found.includes(match[1])) {
      found.push(match[1]);
    }
  }
  return found;
};
