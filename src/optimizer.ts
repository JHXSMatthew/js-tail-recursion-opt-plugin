import * as t from '@babel/types';
import template from '@babel/template';

/**
 * 将尾递归函数转换为循环实现
 */
export function optimizeTailRecursion(
  functionPath: any,
  functionName: string
): void {
  const func = functionPath.node;
  const params = func.params;
  
  // 收集参数名称
  const paramNames: string[] = [];
  
  params.forEach((param: t.Identifier | t.Pattern) => {
    if (t.isIdentifier(param)) {
      paramNames.push(param.name);
    } else if (t.isAssignmentPattern(param) && t.isIdentifier(param.left)) {
      // 处理带默认值的参数，如 index = 0
      paramNames.push(param.left.name);
    }
  });
  
  // 转换函数体
  const newBody = transformFunctionBody(
    func.body,
    functionName,
    paramNames
  );
  
  // 构建新的函数体 - 直接用 while(true) 包裹转换后的body
  const loopBody = t.blockStatement([
    t.whileStatement(
      t.booleanLiteral(true),
      newBody
    )
  ]);
  
  // 替换函数体
  if (t.isFunctionDeclaration(func)) {
    func.body = loopBody;
  } else if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
    func.body = loopBody;
  }
}

function transformFunctionBody(
  body: t.BlockStatement | t.Expression,
  functionName: string,
  paramNames: string[]
): t.BlockStatement {
  if (!t.isBlockStatement(body)) {
    // 箭头函数的简写形式
    if (t.isCallExpression(body) && isRecursiveCall(body, functionName)) {
      return t.blockStatement([
        createAssignmentAndContinue(body, paramNames)
      ]);
    } else if (t.isConditionalExpression(body)) {
      return t.blockStatement([
        transformConditionalReturn(body, functionName, paramNames)
      ]);
    } else if (t.isLogicalExpression(body)) {
      return t.blockStatement([
        transformLogicalReturn(body, functionName, paramNames)
      ]);
    }
    return t.blockStatement([t.returnStatement(body)]);
  }
  
  const statements = body.body;
  const newStatements: t.Statement[] = [];
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    
    if (t.isReturnStatement(stmt) && stmt.argument) {
      const returnArg = stmt.argument;
      
      // 如果是递归调用，替换为赋值和 continue
      if (isRecursiveCall(returnArg, functionName) && t.isCallExpression(returnArg)) {
        newStatements.push(createAssignmentAndContinue(returnArg, paramNames));
      } 
      // 如果是条件表达式
      else if (t.isConditionalExpression(returnArg)) {
        newStatements.push(
          transformConditionalReturn(returnArg, functionName, paramNames)
        );
      }
      // 如果是逻辑表达式
      else if (t.isLogicalExpression(returnArg)) {
        newStatements.push(
          transformLogicalReturn(returnArg, functionName, paramNames)
        );
      }
      // 其他情况直接返回
      else {
        newStatements.push(stmt);
      }
    } 
    // 处理 if 语句
    else if (t.isIfStatement(stmt)) {
      newStatements.push(
        transformIfStatement(stmt, functionName, paramNames)
      );
    }
    // 其他语句保持不变
    else {
      newStatements.push(stmt);
    }
  }
  
  return t.blockStatement(newStatements);
}

function createAssignmentAndContinue(
  callExpr: t.CallExpression,
  paramNames: string[]
): t.BlockStatement {
  const tempVarDeclarators: t.VariableDeclarator[] = [];
  const assignments: t.Statement[] = [];
  
  // 第一步：为所有参数创建临时变量
  // 需要处理：arguments 可能比 params 少（有默认值）
  paramNames.forEach((paramName, index) => {
    const tempName = `_${paramName}_`;
    const arg = index < callExpr.arguments.length 
      ? callExpr.arguments[index]
      : t.identifier('undefined');
    
    tempVarDeclarators.push(
      t.variableDeclarator(
        t.identifier(tempName),
        arg as t.Expression
      )
    );
  });
  
  // 添加临时变量声明
  if (tempVarDeclarators.length > 0) {
    assignments.push(t.variableDeclaration('let', tempVarDeclarators));
  }
  
  // 第二步：将临时变量赋值回参数
  paramNames.forEach(paramName => {
    const tempName = `_${paramName}_`;
    assignments.push(
      t.expressionStatement(
        t.assignmentExpression(
          '=',
          t.identifier(paramName),
          t.identifier(tempName)
        )
      )
    );
  });
  
  // 第三步：添加 continue 语句
  assignments.push(t.continueStatement());
  
  return t.blockStatement(assignments);
}

function transformConditionalReturn(
  node: t.ConditionalExpression,
  functionName: string,
  paramNames: string[]
): t.IfStatement {
  const consequent = node.consequent;
  const alternate = node.alternate;
  
  let consequentBlock: t.BlockStatement;
  if (isRecursiveCall(consequent, functionName) && t.isCallExpression(consequent)) {
    consequentBlock = createAssignmentAndContinue(consequent, paramNames);
  } else if (t.isConditionalExpression(consequent)) {
    consequentBlock = t.blockStatement([
      transformConditionalReturn(consequent, functionName, paramNames)
    ]);
  } else {
    consequentBlock = t.blockStatement([t.returnStatement(consequent)]);
  }
  
  let alternateBlock: t.BlockStatement | t.IfStatement;
  if (isRecursiveCall(alternate, functionName) && t.isCallExpression(alternate)) {
    alternateBlock = createAssignmentAndContinue(alternate, paramNames);
  } else if (t.isConditionalExpression(alternate)) {
    alternateBlock = transformConditionalReturn(alternate, functionName, paramNames);
  } else {
    alternateBlock = t.blockStatement([t.returnStatement(alternate)]);
  }
  
  return t.ifStatement(node.test, consequentBlock, alternateBlock);
}

function transformLogicalReturn(
  node: t.LogicalExpression,
  functionName: string,
  paramNames: string[]
): t.IfStatement {
  const left = node.left;
  const right = node.right;
  
  if (node.operator === '&&') {
    // a && b => if (a) { return b; } else { return a; }
    let rightBlock: t.BlockStatement;
    if (isRecursiveCall(right, functionName) && t.isCallExpression(right)) {
      rightBlock = createAssignmentAndContinue(right, paramNames);
    } else if (t.isConditionalExpression(right)) {
      rightBlock = t.blockStatement([
        transformConditionalReturn(right, functionName, paramNames)
      ]);
    } else if (t.isLogicalExpression(right)) {
      rightBlock = t.blockStatement([
        transformLogicalReturn(right, functionName, paramNames)
      ]);
    } else {
      rightBlock = t.blockStatement([t.returnStatement(right)]);
    }
    
    return t.ifStatement(
      left,
      rightBlock,
      t.blockStatement([t.returnStatement(left)])
    );
  } else if (node.operator === '||') {
    // a || b => if (a) { return a; } else { return b; }
    let rightBlock: t.BlockStatement;
    if (isRecursiveCall(right, functionName) && t.isCallExpression(right)) {
      rightBlock = createAssignmentAndContinue(right, paramNames);
    } else if (t.isConditionalExpression(right)) {
      rightBlock = t.blockStatement([
        transformConditionalReturn(right, functionName, paramNames)
      ]);
    } else if (t.isLogicalExpression(right)) {
      rightBlock = t.blockStatement([
        transformLogicalReturn(right, functionName, paramNames)
      ]);
    } else {
      rightBlock = t.blockStatement([t.returnStatement(right)]);
    }
    
    return t.ifStatement(
      left,
      t.blockStatement([t.returnStatement(left)]),
      rightBlock
    );
  }
  
  // 默认情况直接返回
  return t.ifStatement(
    t.booleanLiteral(true),
    t.blockStatement([t.returnStatement(node)])
  );
}

function transformIfStatement(
  stmt: t.IfStatement,
  functionName: string,
  paramNames: string[]
): t.IfStatement {
  const consequent = transformBranch(stmt.consequent, functionName, paramNames);
  const alternate = stmt.alternate 
    ? transformBranch(stmt.alternate, functionName, paramNames)
    : null;
  
  return t.ifStatement(stmt.test, consequent, alternate);
}

function transformBranch(
  branch: t.Statement,
  functionName: string,
  paramNames: string[]
): t.BlockStatement | t.IfStatement {
  if (t.isBlockStatement(branch)) {
    return transformFunctionBody(branch, functionName, paramNames);
  } else if (t.isReturnStatement(branch) && branch.argument) {
    if (isRecursiveCall(branch.argument, functionName) && t.isCallExpression(branch.argument)) {
      return createAssignmentAndContinue(branch.argument, paramNames);
    }
    return t.blockStatement([branch]);
  } else if (t.isIfStatement(branch)) {
    return transformIfStatement(branch, functionName, paramNames);
  }
  
  return t.blockStatement([branch]);
}

function isRecursiveCall(node: t.Node, functionName: string): boolean {
  if (!t.isCallExpression(node)) return false;
  const callee = node.callee;
  return t.isIdentifier(callee) && callee.name === functionName;
}
