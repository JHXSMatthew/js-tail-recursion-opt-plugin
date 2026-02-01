const { transform } = require('@babel/core');
const plugin = require('./dist/index.js').default;

const code = `
function search(arr, target, index = 0) {
  if (index >= arr.length) return -1;
  if (arr[index] === target) return index;
  return search(arr, target, index + 1);
}
`;

const result = transform(code, {
  plugins: [[plugin, { debug: true }]]
});

console.log('=== OUTPUT ===');
console.log(result.code);
