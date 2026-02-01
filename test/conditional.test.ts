import { transform } from '@babel/core';
import plugin from '../src/index';

function transformCode(code: string, options = {}) {
  const result = transform(code, {
    plugins: [[plugin, options]],
  });
  return result?.code || '';
}

describe('Conditional tail recursion', () => {
  test('ternary operator with tail call', () => {
    const input = `
      function countDown(n, acc = []) {
        return n === 0 ? acc : countDown(n - 1, [...acc, n]);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
    expect(output).toContain('if');
  });
  
  test('multiple conditions with tail calls', () => {
    const input = `
      function search(arr, target, index = 0) {
        if (index >= arr.length) return -1;
        if (arr[index] === target) return index;
        return search(arr, target, index + 1);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
    expect(output).not.toMatch(/return\s+search\s*\(/);
  });
  
  test('nested ternary with tail calls', () => {
    const input = `
      function classify(n) {
        return n === 0 ? 'zero' : 
               n > 0 ? classify(n - 1) : 
               classify(n + 1);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
  
  test('logical AND with tail call', () => {
    const input = `
      function findPositive(arr, index = 0) {
        return index < arr.length && (arr[index] > 0 ? index : findPositive(arr, index + 1));
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
});
