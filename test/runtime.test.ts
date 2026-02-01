import { transform } from '@babel/core';
import plugin from '../src/index';

function transformAndEval(code: string, options = {}) {
  const result = transform(code, {
    plugins: [[plugin, options]],
  });
  
  if (!result?.code) throw new Error('Transform failed');
  
  // 使用 Function 构造器执行代码并返回函数
  const wrappedCode = `
    ${result.code}
    return typeof factorial !== 'undefined' ? factorial :
           typeof sum !== 'undefined' ? sum :
           typeof fib !== 'undefined' ? fib :
           typeof gcd !== 'undefined' ? gcd :
           typeof countdown !== 'undefined' ? countdown :
           null;
  `;
  
  return new Function(wrappedCode)();
}

describe('Runtime correctness', () => {
  test('factorial produces correct results', () => {
    const code = `
      function factorial(n, acc = 1) {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      }
    `;
    
    const factorial = transformAndEval(code);
    
    expect(factorial(5)).toBe(120);
    expect(factorial(10)).toBe(3628800);
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
  });
  
  test('sum produces correct results', () => {
    const code = `
      function sum(n, acc = 0) {
        if (n === 0) return acc;
        return sum(n - 1, acc + n);
      }
    `;
    
    const sum = transformAndEval(code);
    
    expect(sum(5)).toBe(15); // 1+2+3+4+5
    expect(sum(10)).toBe(55); // 1+2+...+10
    expect(sum(0)).toBe(0);
    expect(sum(100)).toBe(5050);
  });
  
  test('fibonacci produces correct results', () => {
    const code = `
      function fib(n, a = 0, b = 1) {
        if (n === 0) return a;
        return fib(n - 1, b, a + b);
      }
    `;
    
    const fib = transformAndEval(code);
    
    expect(fib(0)).toBe(0);
    expect(fib(1)).toBe(1);
    expect(fib(5)).toBe(5);
    expect(fib(10)).toBe(55);
  });
  
  test('GCD produces correct results', () => {
    const code = `
      function gcd(a, b) {
        if (b === 0) return a;
        return gcd(b, a % b);
      }
    `;
    
    const gcd = transformAndEval(code);
    
    expect(gcd(48, 18)).toBe(6);
    expect(gcd(100, 50)).toBe(50);
    expect(gcd(17, 13)).toBe(1);
  });
  
  test('countdown produces correct results', () => {
    const code = `
      function countdown(n, acc = []) {
        if (n === 0) return acc;
        return countdown(n - 1, [...acc, n]);
      }
    `;
    
    const countdown = transformAndEval(code);
    
    expect(countdown(5)).toEqual([5, 4, 3, 2, 1]);
    expect(countdown(3)).toEqual([3, 2, 1]);
    expect(countdown(0)).toEqual([]);
  });
  
  test('large recursion depth should not cause stack overflow', () => {
    const code = `
      function sum(n, acc = 0) {
        if (n === 0) return acc;
        return sum(n - 1, acc + n);
      }
    `;
    
    const sum = transformAndEval(code);
    
    // 10000 次递归在未优化的情况下会爆栈
    // 优化后应该可以正常运行
    expect(() => sum(10000)).not.toThrow();
    expect(sum(10000)).toBe(50005000);
  });
});
