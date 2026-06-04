import { render, screen, fireEvent } from '@testing-library/react';
import { NodeField } from '../components/NodeField';

describe('NodeField', () => {
  test('renders a text input and reports changes as (id, name, value)', () => {
    const onChange = jest.fn();
    render(
      <NodeField id="n1" field={{ name: 'title', label: 'Title', type: 'text' }} value="hi" onChange={onChange} />
    );

    fireEvent.change(screen.getByDisplayValue('hi'), { target: { value: 'bye' } });
    expect(onChange).toHaveBeenCalledWith('n1', 'title', 'bye');
  });

  test('renders a select with its options and reports selection', () => {
    const onChange = jest.fn();
    render(
      <NodeField
        id="n1"
        field={{ name: 'mode', label: 'Mode', type: 'select', options: ['A', 'B'] }}
        value="A"
        onChange={onChange}
      />
    );

    expect(screen.getByRole('option', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'B' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'B' } });
    expect(onChange).toHaveBeenCalledWith('n1', 'mode', 'B');
  });

  test('renders the field label', () => {
    render(<NodeField id="n1" field={{ name: 'x', label: 'My Label', type: 'text' }} value="" onChange={() => {}} />);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });
});
