import { transform } from '@babel/core';
import plugin from '../src/index';

function transformCode(code: string, options = {}) {
  const result = transform(code, {
    plugins: [[plugin, options]],
  });
  return result?.code || '';
}

describe('Arrow function tail recursion', () => {
  test('arrow function with block', () => {
    const input = `
      const factorial = (n, acc = 1) => {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      };
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
    expect(output).not.toMatch(/factorial\s*\(/);
  });
  
  test('arrow function with expression (ternary)', () => {
    const input = `
      const sum = (n, acc = 0) => n === 0 ? acc : sum(n - 1, acc + n);
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
  
  test('arrow function with multiple parameters', () => {
    const input = `
      const gcd = (a, b) => {
        if (b === 0) return a;
        return gcd(b, a % b);
      };
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
    expect(output).not.toMatch(/gcd\s*\(/);
  });
  
  test('const function expression', () => {
    const input = `
      const power = function(base, exp, acc = 1) {
        if (exp === 0) return acc;
        return power(base, exp - 1, acc * base);
      };
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
});
