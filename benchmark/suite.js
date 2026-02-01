const { transform } = require('@babel/core');
const plugin = require('../dist/index.js').default;

// 基准测试工具
class Benchmark {
  constructor(name) {
    this.name = name;
    this.results = [];
  }
  
  run(fn, iterations = 1000) {
    const start = process.hrtime.bigint();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000; // 转换为毫秒
    return duration;
  }
  
  compare(name, unoptimized, optimized, testValue) {
    console.log(`\n📊 ${name}`);
    console.log('━'.repeat(60));
    
    // 预热
    try { unoptimized(testValue); } catch(e) { /* ignore stack overflow */ }
    try { optimized(testValue); } catch(e) {}
    
    // 运行基准测试
    let unoptTime, unoptResult;
    try {
      const start = Date.now();
      unoptResult = unoptimized(testValue);
      unoptTime = Date.now() - start;
    } catch (e) {
      unoptTime = null;
      unoptResult = `❌ ${e.message}`;
    }
    
    const optStart = Date.now();
    const optResult = optimized(testValue);
    const optTime = Date.now() - optStart;
    
    console.log(`未优化: ${unoptTime !== null ? unoptTime + 'ms' : '栈溢出'}`);
    console.log(`已优化: ${optTime}ms`);
    
    if (unoptTime !== null) {
      const speedup = (unoptTime / optTime).toFixed(2);
      console.log(`提升: ${speedup}x faster`);
    } else {
      console.log(`提升: ✅ 防止栈溢出`);
    }
    
    // 验证结果一致性
    if (unoptTime !== null && unoptResult !== optResult) {
      console.log(`⚠️  结果不一致！`);
      console.log(`  未优化: ${unoptResult}`);
      console.log(`  已优化: ${optResult}`);
    } else if (unoptTime !== null) {
      console.log(`✓ 结果一致: ${optResult}`);
    } else {
      console.log(`✓ 优化后结果: ${optResult}`);
    }
  }
}

// 编译函数
function compile(code) {
  const result = transform(code, {
    plugins: [plugin]
  });
  
  // 使用 eval 执行转换后的代码并返回函数
  return eval(result.code);
}

// ==================== 经典递归案例 ====================

console.log('\n🚀 尾递归优化性能测试\n');

const bench = new Benchmark('Tail Recursion Optimization');

// 1. 阶乘
{
  const unoptimized = function factorial(n, acc = 1) {
    if (n <= 1) return acc;
    return factorial(n - 1, n * acc);
  };
  
  const code = `const factorial = function(n, acc = 1) {
    if (n <= 1) return acc;
    return factorial(n - 1, n * acc);
  }; factorial`;
  
  const optimized = compile(code);
  
  bench.compare('阶乘 (factorial)', unoptimized, optimized, 10000);
}

// 2. 求和
{
  const unoptimized = function sum(n, acc = 0) {
    if (n === 0) return acc;
    return sum(n - 1, acc + n);
  };
  
  const code = `const sum = function(n, acc = 0) {
    if (n === 0) return acc;
    return sum(n - 1, acc + n);
  }; sum`;
  
  const optimized = compile(code);
  
  bench.compare('求和 (sum)', unoptimized, optimized, 100000);
}

// 3. 斐波那契
{
  const unoptimized = function fib(n, a = 0, b = 1) {
    if (n === 0) return a;
    return fib(n - 1, b, a + b);
  };
  
  const code = `const fib = function(n, a = 0, b = 1) {
    if (n === 0) return a;
    return fib(n - 1, b, a + b);
  })`;
  
  const optimized = compile(code);
  
  bench.compare('斐波那契 (fibonacci)', unoptimized, optimized, 10000);
}

// 4. 最大公约数 (GCD)
{
  const unoptimized = function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  };
  
  const code = `const gcd = function(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  })`;
  
  const optimized = compile(code);
  
  bench.compare('最大公约数 (GCD)', unoptimized, optimized, 1000000);
}

// 5. 数组求和
{
  const unoptimized = function arraySum(arr, index = 0, acc = 0) {
    if (index >= arr.length) return acc;
    return arraySum(arr, index + 1, acc + arr[index]);
  };
  
  const code = `const arraySum = function(arr, index = 0, acc = 0) {
    if (index >= arr.length) return acc;
    return arraySum(arr, index + 1, acc + arr[index]);
  })`;
  
  const optimized = compile(code);
  
  const testArray = Array.from({ length: 10000 }, (_, i) => i + 1);
  bench.compare('数组求和 (array sum)', unoptimized, optimized, testArray);
}

// 6. 字符串反转
{
  const unoptimized = function reverseString(str, acc = '') {
    if (str.length === 0) return acc;
    return reverseString(str.slice(1), str[0] + acc);
  };
  
  const code = `const reverseString = function(str, acc = '') {
    if (str.length === 0) return acc;
    return reverseString(str.slice(1), str[0] + acc);
  })`;
  
  const optimized = compile(code);
  
  const testString = 'a'.repeat(5000);
  bench.compare('字符串反转 (reverse string)', unoptimized, optimized, testString);
}

// 7. Collatz 猜想 (角谷猜想)
{
  const unoptimized = function collatz(n, steps = 0) {
    if (n === 1) return steps;
    if (n % 2 === 0) return collatz(n / 2, steps + 1);
    return collatz(3 * n + 1, steps + 1);
  };
  
  const code = `const collatz = function(n, steps = 0) {
    if (n === 1) return steps;
    if (n % 2 === 0) return collatz(n / 2, steps + 1);
    return collatz(3 * n + 1, steps + 1);
  })`;
  
  const optimized = compile(code);
  
  bench.compare('Collatz 猜想', unoptimized, optimized, 9999);
}

// 8. 数组过滤（保留偶数）
{
  const unoptimized = function filterEven(arr, index = 0, acc = []) {
    if (index >= arr.length) return acc;
    if (arr[index] % 2 === 0) {
      return filterEven(arr, index + 1, [...acc, arr[index]]);
    }
    return filterEven(arr, index + 1, acc);
  };
  
  const code = `const filterEven = function(arr, index = 0, acc = []) {
    if (index >= arr.length) return acc;
    if (arr[index] % 2 === 0) {
      return filterEven(arr, index + 1, [...acc, arr[index]]);
    }
    return filterEven(arr, index + 1, acc);
  })`;
  
  const optimized = compile(code);
  
  const testArray2 = Array.from({ length: 1000 }, (_, i) => i);
  bench.compare('数组过滤偶数', unoptimized, optimized, testArray2);
}

// 9. 数字转二进制字符串
{
  const unoptimized = function toBinary(n, acc = '') {
    if (n === 0) return acc || '0';
    return toBinary(Math.floor(n / 2), (n % 2) + acc);
  };
  
  const code = `const toBinary = function(n, acc = '') {
    if (n === 0) return acc || '0';
    return toBinary(Math.floor(n / 2), (n % 2) + acc);
  })`;
  
  const optimized = compile(code);
  
  bench.compare('数字转二进制', unoptimized, optimized, 1000000);
}

// 10. 求幂
{
  const unoptimized = function power(base, exp, acc = 1) {
    if (exp === 0) return acc;
    return power(base, exp - 1, acc * base);
  };
  
  const code = `const power = function(base, exp, acc = 1) {
    if (exp === 0) return acc;
    return power(base, exp - 1, acc * base);
  })`;
  
  const optimized = compile(code);
  
  bench.compare('求幂 (2^10000)', unoptimized, optimized, 10000);
}

console.log('\n' + '━'.repeat(60));
console.log('✅ 所有基准测试完成！\n');
