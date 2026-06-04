import { nodeTypes, toolbarItems, createInitialNodeData } from '../nodes';
import { nodeConfigs } from '../nodes/nodeConfigs';

describe('node registry', () => {
  test('exposes a component for every config', () => {
    expect(Object.keys(nodeTypes).sort()).toEqual(Object.keys(nodeConfigs).sort());
    Object.values(nodeTypes).forEach((Component) => expect(typeof Component).toBe('function'));
  });

  test('toolbarItems mirror the configs', () => {
    expect(toolbarItems).toHaveLength(Object.keys(nodeConfigs).length);
    toolbarItems.forEach((item) => {
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('label');
    });
  });
});

describe('createInitialNodeData', () => {
  test('seeds defaults and resolves function defaults', () => {
    expect(createInitialNodeData('customInput-1', 'customInput')).toMatchObject({
      id: 'customInput-1',
      nodeType: 'customInput',
      inputName: 'input_1',
      inputType: 'Text',
    });
  });

  test('handles configs without fields', () => {
    expect(createInitialNodeData('llm-1', 'llm')).toEqual({ id: 'llm-1', nodeType: 'llm' });
  });

  test('uses literal defaults (Text node)', () => {
    expect(createInitialNodeData('text-1', 'text').text).toBe('{{input}}');
  });
});
