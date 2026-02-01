import { transform } from '@babel/core';
import plugin from '../src/index';

function transformCode(code: string, options = {}) {
  const result = transform(code, {
    plugins: [[plugin, options]],
  });
  return result?.code || '';
}

describe('Edge cases', () => {
  test('mutual recursion should not be optimized', () => {
    const input = `
      function isEven(n) {
        if (n === 0) return true;
        return isOdd(n - 1);
      }
      
      function isOdd(n) {
        if (n === 0) return false;
        return isEven(n - 1);
      }
    `;
    
    const output = transformCode(input);
    
    // 互递归不应该被优化
    expect(output).not.toContain('while (true)');
  });
  
  test('function with same name in nested scope', () => {
    const input = `
      function outer(n) {
        function inner(m) {
          if (m === 0) return 0;
          return inner(m - 1);
        }
        return inner(n);
      }
    `;
    
    const output = transformCode(input);
    
    // inner 应该被优化，outer 不应该
    expect(output).toContain('while (true)');
  });
  
  test('empty parameter list', () => {
    const input = `
      let counter = 0;
      function increment() {
        counter++;
        if (counter < 100) return increment();
        return counter;
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
  
  test('single parameter', () => {
    const input = `
      function countdown(n) {
        if (n === 0) return 'Done!';
        console.log(n);
        return countdown(n - 1);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
  
  test('many parameters', () => {
    const input = `
      function complex(a, b, c, d, e) {
        if (a === 0) return e;
        return complex(a - 1, b + 1, c * 2, d - 1, e + a);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
  
  test('string operations in tail position', () => {
    const input = `
      function reverseString(str, acc = '') {
        if (str.length === 0) return acc;
        return reverseString(str.slice(1), str[0] + acc);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
  
  test('array operations in tail position', () => {
    const input = `
      function flatten(arr, acc = []) {
        if (arr.length === 0) return acc;
        const first = arr[0];
        if (Array.isArray(first)) {
          return flatten([...first, ...arr.slice(1)], acc);
        }
        return flatten(arr.slice(1), [...acc, first]);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
  
  test('multiple base cases', () => {
    const input = `
      function collatz(n, steps = 0) {
        if (n === 1) return steps;
        if (n % 2 === 0) return collatz(n / 2, steps + 1);
        return collatz(3 * n + 1, steps + 1);
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
  });
});
