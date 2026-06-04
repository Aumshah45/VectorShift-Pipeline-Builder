import { extractVariables } from '../nodes/textVariables';

describe('extractVariables', () => {
  test('returns [] for empty or nullish input', () => {
    expect(extractVariables('')).toEqual([]);
    expect(extractVariables(null)).toEqual([]);
    expect(extractVariables(undefined)).toEqual([]);
  });

  test('extracts a single variable', () => {
    expect(extractVariables('Hello {{ name }}')).toEqual(['name']);
  });

  test('extracts multiple variables in order', () => {
    expect(extractVariables('{{ a }} then {{ b }}')).toEqual(['a', 'b']);
  });

  test('dedupes repeated variables, keeping first occurrence', () => {
    expect(extractVariables('{{x}} {{y}} {{x}}')).toEqual(['x', 'y']);
  });

  test('tolerates surrounding whitespace', () => {
    expect(extractVariables('{{   spaced   }}')).toEqual(['spaced']);
  });

  test('ignores invalid identifiers', () => {
    expect(extractVariables('{{ 1bad }} {{ a-b }} {{ good_1 }}')).toEqual(['good_1']);
  });

  test('supports $ and _ as identifier starts', () => {
    expect(extractVariables('{{ _x }} {{ $y }}')).toEqual(['_x', '$y']);
  });

  test('ignores text without braces', () => {
    expect(extractVariables('no variables here')).toEqual([]);
  });

  test('is stable across repeated calls (no shared regex state)', () => {
    expect(extractVariables('{{ a }}')).toEqual(['a']);
    expect(extractVariables('{{ a }}')).toEqual(['a']);
  });
});
