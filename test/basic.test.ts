import { transform } from '@babel/core';
import plugin from '../src/index';

function transformCode(code: string, options = {}) {
  const result = transform(code, {
    plugins: [[plugin, options]],
  });
  return result?.code || '';
}

describe('Basic tail recursion optimization', () => {
  test('simple factorial function', () => {
    const input = `
      function factorial(n, acc = 1) {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      }
    `;
    
    const output = transformCode(input);
    
    // 应该包含 while(true) 循环
    expect(output).toContain('while (true)');
    // 不应该再包含递归调用（return factorial(...)）
    expect(output).not.toMatch(/return\s+factorial\s*\(/);
    // 应该包含 continue 语句
    expect(output).toContain('continue');
  });
  
  test('simple sum function', () => {
    const input = `
      function sum(n, acc = 0) {
        if (n === 0) return acc;
        return sum(n - 1, acc + n);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
    expect(output).not.toMatch(/return\s+sum\s*\(/);
    expect(output).toContain('continue');
  });
  
  test('fibonacci with accumulator', () => {
    const input = `
      function fib(n, a = 0, b = 1) {
        if (n === 0) return a;
        return fib(n - 1, b, a + b);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
    expect(output).not.toMatch(/return\s+fib\s*\(/);
  });
  
  test('should not optimize non-tail recursion', () => {
    const input = `
      function factorial(n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
      }
    `;
    
    const output = transformCode(input);
    
    // 应该保持原样，不优化
    expect(output).toMatch(/factorial\s*\(/);
    expect(output).not.toContain('while (true)');
  });
  
  test('should not optimize function without recursion', () => {
    const input = `
      function add(a, b) {
        return a + b;
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).not.toContain('while (true)');
  });
});
