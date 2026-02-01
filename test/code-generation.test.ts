import { transform } from '@babel/core';
import plugin from '../src/index';

function transformCode(code: string, options = {}) {
  const result = transform(code, {
    plugins: [[plugin, options]],
  });
  return result?.code || '';
}

describe('Code generation optimization', () => {
  test('single parameter should use direct assignment', () => {
    const input = `
      function countdown(n) {
        if (n === 0) return 'Done!';
        return countdown(n - 1);
      }
    `;
    
    const output = transformCode(input);
    
    // 应该直接赋值，不使用临时变量
    expect(output).toContain('n = n - 1');
    expect(output).toContain('continue');
  });
  
  test('no parameters should only have continue', () => {
    const input = `
      let counter = 0;
      function increment() {
        counter++;
        if (counter < 10) return increment();
        return counter;
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('continue');
    expect(output).toContain('while (true)');
  });
  
  test('multiple parameters should use indexed temp variables', () => {
    const input = `
      function sum(a, b, c) {
        if (a === 0) return b + c;
        return sum(a - 1, b + 1, c + 2);
      }
    `;
    
    const output = transformCode(input);
    
    // 应该使用 _temp0, _temp1, _temp2
    expect(output).toMatch(/_temp\d+/);
    expect(output).toContain('continue');
  });
  
  test('generated code should be clean and readable', () => {
    const input = `
      function factorial(n, acc = 1) {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      }
    `;
    
    const output = transformCode(input);
    
    // 检查代码结构
    expect(output).toContain('while (true)');
    expect(output).toContain('if (n <= 1)');
    expect(output).toContain('return acc');
    expect(output).toContain('continue');
    
    // 不应该有过多的临时变量污染
    const tempVarCount = (output.match(/_temp/g) || []).length;
    expect(tempVarCount).toBeLessThan(10); // 合理的临时变量数量
  });
  
  test('parameter swap should work correctly', () => {
    const input = `
      function swap(a, b) {
        if (a > 100) return [a, b];
        return swap(b, a);
      }
    `;
    
    const output = transformCode(input);
    
    // 参数交换需要临时变量
    expect(output).toMatch(/_temp/);
    expect(output).toContain('continue');
  });
  
  test('complex expression arguments', () => {
    const input = `
      function complex(n, acc = 0) {
        if (n === 0) return acc;
        return complex(n - 1, acc + n * 2 + Math.sqrt(n));
      }
    `;
    
    const output = transformCode(input);
    
    expect(output).toContain('while (true)');
    expect(output).toContain('Math.sqrt');
  });
});

describe('Code generation runtime correctness', () => {
  function transformAndEval(code: string, fnName: string) {
    const result = transform(code, {
      plugins: [plugin],
    });
    
    if (!result?.code) throw new Error('Transform failed');
    
    return new Function(`${result.code}; return ${fnName};`)();
  }
  
  test('single parameter optimization is correct', () => {
    const code = `
      function factorial(n, acc = 1) {
        if (n <= 1) return acc;
        return factorial(n - 1, n * acc);
      }
    `;
    
    const factorial = transformAndEval(code, 'factorial');
    expect(factorial(5)).toBe(120);
    expect(factorial(10)).toBe(3628800);
  });
  
  test('parameter swap optimization is correct', () => {
    const code = `
      function swap(a, b, count = 0) {
        if (count >= 10) return [a, b];
        return swap(b, a, count + 1);
      }
    `;
    
    const swap = transformAndEval(code, 'swap');
    expect(swap(1, 2)).toEqual([1, 2]);
    expect(swap(5, 10)).toEqual([5, 10]);
  });
  
  test('complex multi-parameter is correct', () => {
    const code = `
      function sum(a, b, c, total = 0) {
        if (a === 0 && b === 0 && c === 0) return total;
        return sum(
          Math.max(0, a - 1),
          Math.max(0, b - 1),
          Math.max(0, c - 1),
          total + a + b + c
        );
      }
    `;
    
    const sum = transformAndEval(code, 'sum');
    expect(sum(1, 1, 1)).toBe(3); // 1+1+1 = 3
  });
});
