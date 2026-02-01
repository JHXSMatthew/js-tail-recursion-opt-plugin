/**
 * 字符串操作 - 尾递归示例
 */

// 1. 字符串反转
function reverse(str, acc = '') {
  if (str.length === 0) return acc;
  return reverse(str.slice(1), str[0] + acc);
}

// 2. 回文检查
function isPalindrome(str, left = 0, right = str.length - 1) {
  if (left >= right) return true;
  if (str[left] !== str[right]) return false;
  return isPalindrome(str, left + 1, right - 1);
}

// 3. 字符计数
function countChar(str, char, index = 0, count = 0) {
  if (index >= str.length) return count;
  return countChar(
    str,
    char,
    index + 1,
    count + (str[index] === char ? 1 : 0)
  );
}

// 4. 字符串重复
function repeat(str, n, acc = '') {
  if (n === 0) return acc;
  return repeat(str, n - 1, acc + str);
}

// 5. 删除所有空格
function removeSpaces(str, index = 0, acc = '') {
  if (index >= str.length) return acc;
  if (str[index] === ' ') {
    return removeSpaces(str, index + 1, acc);
  }
  return removeSpaces(str, index + 1, acc + str[index]);
}

// 6. 首字母大写
function capitalize(str, index = 0, acc = '', prevSpace = true) {
  if (index >= str.length) return acc;
  const char = str[index];
  const isSpace = char === ' ';
  const newChar = prevSpace && !isSpace ? char.toUpperCase() : char;
  return capitalize(str, index + 1, acc + newChar, isSpace);
}

// 测试
console.log('字符串操作 - 尾递归优化示例\n');

console.log('1. 反转:', reverse('hello world'));
console.log('2. 回文检查:', isPalindrome('racecar'));
console.log('3. 字符计数 (l):', countChar('hello world', 'l'));
console.log('4. 重复:', repeat('ab', 5));
console.log('5. 删除空格:', removeSpaces('h e l l o'));
console.log('6. 首字母大写:', capitalize('hello world from javascript'));

// 长字符串测试
console.log('\n长字符串测试（10万字符）:');
const longString = 'a'.repeat(100000);
const start = Date.now();
const reversed = reverse(longString);
console.log('反转完成，长度:', reversed.length);
console.log('耗时:', Date.now() - start, 'ms');
console.log('✅ 没有栈溢出！');
