import { render, screen, fireEvent } from '@testing-library/react';
import { PipelineResultToast } from '../components/PipelineResultToast';

const noop = () => {};

describe('PipelineResultToast', () => {
  test('renders counts and a valid-DAG badge', () => {
    render(
      <PipelineResultToast
        result={{ type: 'success', num_nodes: 3, num_edges: 2, is_dag: true }}
        onClose={noop}
      />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Valid DAG/i)).toBeInTheDocument();
  });

  test('flags a cycle when not a DAG', () => {
    render(
      <PipelineResultToast
        result={{ type: 'success', num_nodes: 3, num_edges: 3, is_dag: false }}
        onClose={noop}
      />
    );
    expect(screen.getByText(/not a DAG/i)).toBeInTheDocument();
  });

  test('renders an error message', () => {
    render(<PipelineResultToast result={{ type: 'error', message: 'Boom' }} onClose={noop} />);
    expect(screen.getByText('Boom')).toBeInTheDocument();
    expect(screen.getByText(/Submission failed/i)).toBeInTheDocument();
  });

  test('calls onClose when dismissed', () => {
    const onClose = jest.fn();
    render(
      <PipelineResultToast
        result={{ type: 'success', num_nodes: 0, num_edges: 0, is_dag: true }}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
