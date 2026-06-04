import { parsePipeline } from '../lib/api';

describe('parsePipeline', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    delete global.fetch;
  });

  test('POSTs the graph as JSON and returns the parsed response', async () => {
    const payload = { num_nodes: 2, num_edges: 1, is_dag: true };
    global.fetch.mockResolvedValue({ ok: true, json: async () => payload });

    const result = await parsePipeline({ nodes: [{ id: 'a' }], edges: [] });

    expect(result).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/pipelines\/parse$/);
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual({ nodes: [{ id: 'a' }], edges: [] });
  });

  test('throws when the server responds with an error status', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(parsePipeline({ nodes: [], edges: [] })).rejects.toThrow('500');
  });
});
