import * as t from '@babel/types';
import traverse from '@babel/traverse';

export interface TailCallInfo {
  callExpression: t.CallExpression;
  path: any;
}

/**
 * 检测函数中是否包含尾递归调用
 */
export function detectTailRecursion(
  functionPath: any,
  functionName: string
): TailCallInfo[] {
  const tailCalls: TailCallInfo[] = [];

  // 获取函数体
  const body = functionPath.node.body;
  if (!t.isBlockStatement(body)) {
    // 如果是箭头函数的简写形式，检查表达式是否是递归调用
    if (isRecursiveCall(body, functionName)) {
      tailCalls.push({
        callExpression: body as t.CallExpression,
        path: functionPath
      });
    }
    return tailCalls;
  }

  // 遍历函数体中的每个语句
  const statements = body.body;
  
  for (const statement of statements) {
    // 检查 return 语句
    if (t.isReturnStatement(statement) && statement.argument) {
      const returnArg = statement.argument;
      
      // 直接返回递归调用
      if (isRecursiveCall(returnArg, functionName)) {
        tailCalls.push({
          callExpression: returnArg as t.CallExpression,
          path: functionPath
        });
      }
      
      // 条件表达式中的递归调用
      if (t.isConditionalExpression(returnArg)) {
        checkConditionalExpression(returnArg, functionName, tailCalls, functionPath);
      }
      
      // 逻辑表达式中的递归调用
      if (t.isLogicalExpression(returnArg)) {
        checkLogicalExpression(returnArg, functionName, tailCalls, functionPath);
      }
    }
    
    // 检查 if 语句的所有分支
    if (t.isIfStatement(statement)) {
      checkIfStatement(statement, functionName, tailCalls, functionPath);
    }
  }

  return tailCalls;
}

function isRecursiveCall(node: t.Node, functionName: string): boolean {
  if (!t.isCallExpression(node)) return false;
  
  const callee = node.callee;
  
  // 检查直接调用函数名
  if (t.isIdentifier(callee) && callee.name === functionName) {
    return true;
  }
  
  return false;
}

function checkConditionalExpression(
  node: t.ConditionalExpression,
  functionName: string,
  tailCalls: TailCallInfo[],
  functionPath: any
) {
  if (isRecursiveCall(node.consequent, functionName)) {
    tailCalls.push({
      callExpression: node.consequent as t.CallExpression,
      path: functionPath
    });
  }
  
  if (isRecursiveCall(node.alternate, functionName)) {
    tailCalls.push({
      callExpression: node.alternate as t.CallExpression,
      path: functionPath
    });
  }
  
  // 递归检查嵌套的条件表达式
  if (t.isConditionalExpression(node.consequent)) {
    checkConditionalExpression(node.consequent, functionName, tailCalls, functionPath);
  }
  if (t.isConditionalExpression(node.alternate)) {
    checkConditionalExpression(node.alternate, functionName, tailCalls, functionPath);
  }
}

function checkLogicalExpression(
  node: t.LogicalExpression,
  functionName: string,
  tailCalls: TailCallInfo[],
  functionPath: any
) {
  // 对于 && 和 ||，右侧可能是尾调用
  if (isRecursiveCall(node.right, functionName)) {
    tailCalls.push({
      callExpression: node.right as t.CallExpression,
      path: functionPath
    });
  }
  
  // 递归检查嵌套的逻辑表达式
  if (t.isLogicalExpression(node.right)) {
    checkLogicalExpression(node.right, functionName, tailCalls, functionPath);
  }
}

function checkIfStatement(
  statement: t.IfStatement,
  functionName: string,
  tailCalls: TailCallInfo[],
  functionPath: any
) {
  // 检查 consequent 分支
  if (t.isBlockStatement(statement.consequent)) {
    const lastStmt = statement.consequent.body[statement.consequent.body.length - 1];
    if (t.isReturnStatement(lastStmt) && lastStmt.argument) {
      if (isRecursiveCall(lastStmt.argument, functionName)) {
        tailCalls.push({
          callExpression: lastStmt.argument as t.CallExpression,
          path: functionPath
        });
      }
    }
  } else if (t.isReturnStatement(statement.consequent) && statement.consequent.argument) {
    if (isRecursiveCall(statement.consequent.argument, functionName)) {
      tailCalls.push({
        callExpression: statement.consequent.argument as t.CallExpression,
        path: functionPath
      });
    }
  }
  
  // 检查 alternate 分支
  if (statement.alternate) {
    if (t.isBlockStatement(statement.alternate)) {
      const lastStmt = statement.alternate.body[statement.alternate.body.length - 1];
      if (t.isReturnStatement(lastStmt) && lastStmt.argument) {
        if (isRecursiveCall(lastStmt.argument, functionName)) {
          tailCalls.push({
            callExpression: lastStmt.argument as t.CallExpression,
            path: functionPath
          });
        }
      }
    } else if (t.isReturnStatement(statement.alternate) && statement.alternate.argument) {
      if (isRecursiveCall(statement.alternate.argument, functionName)) {
        tailCalls.push({
          callExpression: statement.alternate.argument as t.CallExpression,
          path: functionPath
        });
      }
    } else if (t.isIfStatement(statement.alternate)) {
      checkIfStatement(statement.alternate, functionName, tailCalls, functionPath);
    }
  }
}

/**
 * 检查函数是否只包含尾递归（没有其他递归调用）
 */
export function isOnlyTailRecursive(
  functionPath: any,
  functionName: string
): boolean {
  let hasNonTailRecursion = false;
  
  traverse(functionPath.node, {
    CallExpression(path: any) {
      // 跳过嵌套函数中的调用
      if (path.getFunctionParent() !== functionPath) {
        return;
      }
      
      const callee = path.node.callee;
      if (t.isIdentifier(callee) && callee.name === functionName) {
        // 检查这个调用是否在尾位置
        if (!isInTailPosition(path)) {
          hasNonTailRecursion = true;
          path.stop();
        }
      }
    }
  }, functionPath.scope, functionPath);
  
  return !hasNonTailRecursion;
}

function isInTailPosition(path: any): boolean {
  let current = path;
  
  while (current.parent) {
    const parent = current.parentPath;
    
    // 如果父节点是 return 语句的参数，则在尾位置
    if (t.isReturnStatement(parent.node) && parent.node.argument === current.node) {
      return true;
    }
    
    // 如果是条件表达式的分支，继续向上检查
    if (t.isConditionalExpression(parent.node)) {
      if (parent.node.consequent === current.node || parent.node.alternate === current.node) {
        current = parent;
        continue;
      }
      return false;
    }
    
    // 如果是逻辑表达式的右侧，继续向上检查
    if (t.isLogicalExpression(parent.node) && parent.node.right === current.node) {
      current = parent;
      continue;
    }
    
    // 如果是块语句中的最后一个语句，继续检查
    if (t.isBlockStatement(parent.node)) {
      const statements = parent.node.body;
      if (statements[statements.length - 1] === current.node) {
        current = parent;
        continue;
      }
      return false;
    }
    
    // 如果是函数体，说明到达了函数边界
    if (t.isFunction(parent.node)) {
      return false;
    }
    
    // 其他情况不在尾位置
    return false;
  }
  
  return false;
}
