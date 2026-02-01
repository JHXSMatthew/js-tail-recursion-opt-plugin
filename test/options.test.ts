import { transform } from '@babel/core';
import plugin from '../src/index';

function transformCode(code: string, options = {}) {
  const result = transform(code, {
    plugins: [[plugin, options]],
  });
  return result?.code || '';
}

describe('Plugin options', () => {
  test('onlyAnnotated: true - should optimize only annotated functions', () => {
    const input = `
      /** @tail-recursion */
      function factorial(n, acc = 1) {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      }
      
      function sum(n, acc = 0) {
        if (n === 0) return acc;
        return sum(n - 1, acc + n);
      }
    `;
    
    const output = transformCode(input, { onlyAnnotated: true });
    
    // factorial 应该被优化
    expect(output).toContain('while (true)');
    
    // sum 应该保持原样
    expect(output).toMatch(/sum\s*\(/);
  });
  
  test('custom annotation tag', () => {
    const input = `
      /** @optimize-tail-call */
      function factorial(n, acc = 1) {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      }
    `;
    
    const output = transformCode(input, { 
      onlyAnnotated: true,
      annotationTag: '@optimize-tail-call'
    });
    
    expect(output).toContain('while (true)');
  });
  
  test('debug mode should not affect output', () => {
    const input = `
      function factorial(n, acc = 1) {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      }
    `;
    
    const debugOutput = transformCode(input, { debug: true });
    const normalOutput = transformCode(input);
    
    // 输出代码应该相同
    expect(debugOutput).toBe(normalOutput);
  });
  
  test('without annotation should optimize by default', () => {
    const input = `
      function factorial(n, acc = 1) {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      }
    `;
    
    const output = transformCode(input, { onlyAnnotated: false });
    
    expect(output).toContain('while (true)');
  });
});
