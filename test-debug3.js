const { transform } = require('@babel/core');

// 修改 optimizer 中的 createAssignmentAndContinue 临时添加 console.log
const code = `
function search(arr, target, index = 0) {
  if (index >= arr.length) return -1;
  if (arr[index] === target) return index;
  return search(arr, target, index + 1);
}
`;

// 手动导入并修改
const plugin = function(api) {
  api.assertVersion(7);
  const t = require('@babel/types');
  const { detectTailRecursion, isOnlyTailRecursive } = require('./dist/detector.js');
  const { optimizeTailRecursion } = require('./dist/optimizer.js');
  
  return {
    name: 'test',
    visitor: {
      FunctionDeclaration(path) {
        const functionName = path.node.id?.name;
        if (!functionName) return;
        
        const tailCalls = detectTailRecursion(path, functionName);
        if (tailCalls.length === 0) return;
        
        if (!isOnlyTailRecursive(path, functionName)) return;
        
        // 获取参数名
        const params = path.node.params;
        const paramNames = [];
        params.forEach(param => {
          if (t.isIdentifier(param)) {
            paramNames.push(param.name);
          }
        });
        
        console.log('Function:', functionName);
        console.log('Params:', paramNames);
        console.log('Tail calls:', tailCalls.length);
        
        optimizeTailRecursion(path, functionName);
      }
    }
  };
};

const result = transform(code, {
  plugins: [plugin]
});

console.log('=== OUTPUT ===');
console.log(result.code);
