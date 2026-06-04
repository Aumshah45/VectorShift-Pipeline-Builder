// NodeField.js
// Field registry: renders the right control for a field config and reports
// changes upward. Adding a new field type == adding one case here.

import { AutoResizeTextarea } from './AutoResizeTextarea';

export const NodeField = ({ id, field, value, onChange }) => {
  const handleChange = (val) => onChange(id, field.name, val);
  const current = value ?? '';

  let control;
  switch (field.type) {
    case 'select':
      control = (
        <select className="vs-field__control" value={current} onChange={(e) => handleChange(e.target.value)}>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
      break;
    case 'number':
      control = (
        <input
          className="vs-field__control"
          type="number"
          value={current}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
      break;
    case 'textarea':
    case 'autoTextarea':
      control = (
        <AutoResizeTextarea value={current} placeholder={field.placeholder} onChange={handleChange} />
      );
      break;
    default: // 'text'
      control = (
        <input
          className="vs-field__control"
          type="text"
          value={current}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
  }

  return (
    <label className="vs-field">
      {field.label ? <span className="vs-field__label">{field.label}</span> : null}
      {control}
    </label>
  );
};
