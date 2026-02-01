/**
 * 斐波那契数列 - 尾递归版本
 * 
 * 使用累加器模式实现，避免重复计算
 */

// 尾递归实现（会被优化为循环）
function fibonacci(n, a = 0n, b = 1n) {
  if (n === 0) return a;
  return fibonacci(n - 1, b, a + b);
}

// 测试
console.log('斐波那契数列（尾递归优化）:');
console.log('fib(10):', fibonacci(10).toString());
console.log('fib(100):', fibonacci(100).toString());
console.log('fib(1000):', fibonacci(1000).toString().substring(0, 50) + '...');

// 性能对比
console.log('\n性能测试:');

// 未优化版本（会栈溢出）
function fibNonTail(n) {
  if (n <= 1) return n;
  return fibNonTail(n - 1) + fibNonTail(n - 2);
}

// 测试未优化版本
try {
  const start1 = Date.now();
  fibNonTail(30);
  console.log('未优化版本 fib(30):', Date.now() - start1, 'ms');
} catch (e) {
  console.log('未优化版本: 栈溢出');
}

// 测试优化版本
const start2 = Date.now();
fibonacci(10000);
console.log('优化版本 fib(10000):', Date.now() - start2, 'ms');

console.log('\n✅ 尾递归优化使得大数计算成为可能！');
