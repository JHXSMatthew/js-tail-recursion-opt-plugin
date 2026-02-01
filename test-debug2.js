const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = `
function search(arr, target, index = 0) {
  if (index >= arr.length) return -1;
  if (arr[index] === target) return index;
  return search(arr, target, index + 1);
}
`;

const ast = parse(code);

traverse(ast, {
  CallExpression(path) {
    if (path.node.callee.name === 'search') {
      console.log('Found search call');
      console.log('Arguments:', path.node.arguments.length);
      path.node.arguments.forEach((arg, i) => {
        console.log(`  Arg ${i}:`, arg.type, arg.name || arg.operator || '...');
      });
    }
  }
});
