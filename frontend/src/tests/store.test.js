import { useStore } from '../store';

const reset = () => useStore.setState({ nodes: [], edges: [], nodeIDs: {} });

describe('store', () => {
  beforeEach(reset);

  test('getNodeID increments per type and namespaces ids', () => {
    const { getNodeID } = useStore.getState();
    expect(getNodeID('customInput')).toBe('customInput-1');
    expect(getNodeID('customInput')).toBe('customInput-2');
    expect(getNodeID('llm')).toBe('llm-1');
  });

  test('addNode appends to the node list', () => {
    useStore.getState().addNode({ id: 'a', type: 'text', position: { x: 0, y: 0 }, data: {} });
    expect(useStore.getState().nodes).toHaveLength(1);
    expect(useStore.getState().nodes[0].id).toBe('a');
  });

  test('updateNodeField updates the field immutably', () => {
    const node = { id: 'a', type: 'customInput', position: { x: 0, y: 0 }, data: { inputName: 'x' } };
    useStore.setState({ nodes: [node] });

    useStore.getState().updateNodeField('a', 'inputName', 'y');

    const updated = useStore.getState().nodes[0];
    expect(updated.data.inputName).toBe('y');
    expect(updated).not.toBe(node); // new object reference
    expect(node.data.inputName).toBe('x'); // original untouched
  });

  test('updateNodeField leaves other nodes unchanged', () => {
    useStore.setState({
      nodes: [
        { id: 'a', data: { v: 1 } },
        { id: 'b', data: { v: 2 } },
      ],
    });
    useStore.getState().updateNodeField('a', 'v', 9);
    const { nodes } = useStore.getState();
    expect(nodes.find((n) => n.id === 'a').data.v).toBe(9);
    expect(nodes.find((n) => n.id === 'b').data.v).toBe(2);
  });

  test('onConnect adds an edge with the default appearance', () => {
    useStore.getState().onConnect({ source: 'a', target: 'b', sourceHandle: null, targetHandle: null });
    const { edges } = useStore.getState();
    expect(edges).toHaveLength(1);
    expect(edges[0]).toMatchObject({ source: 'a', target: 'b', type: 'smoothstep', animated: true });
  });
});
