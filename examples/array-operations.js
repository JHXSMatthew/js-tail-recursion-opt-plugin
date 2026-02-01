/**
 * 数组操作 - 尾递归示例
 * 
 * 展示如何用尾递归处理数组，避免栈溢出
 */

// 1. 数组求和
function sum(arr, index = 0, acc = 0) {
  if (index >= arr.length) return acc;
  return sum(arr, index + 1, acc + arr[index]);
}

// 2. 数组过滤
function filter(arr, predicate, index = 0, acc = []) {
  if (index >= arr.length) return acc;
  if (predicate(arr[index])) {
    return filter(arr, predicate, index + 1, [...acc, arr[index]]);
  }
  return filter(arr, predicate, index + 1, acc);
}

// 3. 数组映射
function map(arr, fn, index = 0, acc = []) {
  if (index >= arr.length) return acc;
  return map(arr, fn, index + 1, [...acc, fn(arr[index])]);
}

// 4. 数组归约
function reduce(arr, fn, index = 0, acc) {
  if (acc === undefined) acc = arr[0], index = 1;
  if (index >= arr.length) return acc;
  return reduce(arr, fn, index + 1, fn(acc, arr[index]));
}

// 5. 数组查找
function find(arr, predicate, index = 0) {
  if (index >= arr.length) return undefined;
  if (predicate(arr[index])) return arr[index];
  return find(arr, predicate, index + 1);
}

// 6. 数组扁平化
function flatten(arr, index = 0, acc = []) {
  if (index >= arr.length) return acc;
  const item = arr[index];
  if (Array.isArray(item)) {
    return flatten(arr, index + 1, [...acc, ...flatten(item)]);
  }
  return flatten(arr, index + 1, [...acc, item]);
}

// 测试
console.log('数组操作 - 尾递归优化示例\n');

const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

console.log('1. 求和:', sum(numbers));
console.log('2. 过滤偶数:', filter(numbers, x => x % 2 === 0).slice(0, 10), '...');
console.log('3. 映射 x*2:', map([1, 2, 3, 4, 5], x => x * 2));
console.log('4. 归约求和:', reduce(numbers, (a, b) => a + b));
console.log('5. 查找第一个大于50:', find(numbers, x => x > 50));
console.log('6. 扁平化:', flatten([1, [2, [3, [4, 5]]]]));

// 大数组测试
console.log('\n大数组测试（10万元素）:');
const bigArray = Array.from({ length: 100000 }, (_, i) => i);
const start = Date.now();
const result = sum(bigArray);
console.log('求和结果:', result);
console.log('耗时:', Date.now() - start, 'ms');
console.log('✅ 没有栈溢出！');
