import type { PluginObj } from '@babel/core';
import * as t from '@babel/types';
import { detectTailRecursion, isOnlyTailRecursive } from './detector';
import { optimizeTailRecursion } from './optimizer';

export interface PluginOptions {
  /** 是否启用调试日志 */
  debug?: boolean;
  /** 只优化标记了特定注释的函数 */
  onlyAnnotated?: boolean;
  /** 注释标记，默认为 @tail-recursion */
  annotationTag?: string;
}

export default function(api: any, options: PluginOptions): PluginObj {
  api.assertVersion(7);
  
  const {
    debug = false,
    onlyAnnotated = false,
    annotationTag = '@tail-recursion'
  } = options;
  
  function log(...args: any[]) {
    if (debug) {
      console.log('[tail-recursion-opt]', ...args);
    }
  }
  
  function hasAnnotation(path: any): boolean {
    const leadingComments = path.node.leadingComments;
    if (!leadingComments) return false;
    
    return leadingComments.some((comment: any) => 
      comment.value.includes(annotationTag)
    );
  }
  
  return {
    name: 'tail-recursion-optimization',
    
    visitor: {
      // 处理函数声明
      FunctionDeclaration(path: any) {
        const functionName = path.node.id?.name;
        if (!functionName) return;
        
        // 如果设置了只优化标记的函数，检查注释
        if (onlyAnnotated && !hasAnnotation(path)) {
          return;
        }
        
        log(`Analyzing function: ${functionName}`);
        
        // 检测尾递归
        const tailCalls = detectTailRecursion(path, functionName);
        
        if (tailCalls.length === 0) {
          log(`  No tail recursion found in ${functionName}`);
          return;
        }
        
        // 检查是否只有尾递归（没有非尾递归调用）
        if (!isOnlyTailRecursive(path, functionName)) {
          log(`  Function ${functionName} has non-tail recursive calls, skipping optimization`);
          return;
        }
        
        log(`  Optimizing ${functionName} (found ${tailCalls.length} tail calls)`);
        
        // 执行优化
        optimizeTailRecursion(path, functionName);
        
        log(`  ✓ Successfully optimized ${functionName}`);
      },
      
      // 处理函数表达式（包括赋值给变量的函数）
      VariableDeclarator(path: any) {
        const id = path.node.id;
        const init = path.node.init;
        
        // 检查是否是函数表达式或箭头函数赋值
        if (!t.isIdentifier(id) || !init) return;
        if (!t.isFunctionExpression(init) && !t.isArrowFunctionExpression(init)) return;
        
        const functionName = id.name;
        
        // 如果设置了只优化标记的函数，检查注释
        if (onlyAnnotated && !hasAnnotation(path)) {
          return;
        }
        
        log(`Analyzing function expression: ${functionName}`);
        
        // 获取函数路径
        const functionPath = path.get('init');
        
        // 检测尾递归
        const tailCalls = detectTailRecursion(functionPath, functionName);
        
        if (tailCalls.length === 0) {
          log(`  No tail recursion found in ${functionName}`);
          return;
        }
        
        // 检查是否只有尾递归
        if (!isOnlyTailRecursive(functionPath, functionName)) {
          log(`  Function ${functionName} has non-tail recursive calls, skipping optimization`);
          return;
        }
        
        log(`  Optimizing ${functionName} (found ${tailCalls.length} tail calls)`);
        
        // 执行优化
        optimizeTailRecursion(functionPath, functionName);
        
        // 如果是箭头函数，需要确保转换为块语句
        if (t.isArrowFunctionExpression(init) && !t.isBlockStatement(init.body)) {
          init.body = t.blockStatement([t.returnStatement(init.body as t.Expression)]);
        }
        
        log(`  ✓ Successfully optimized ${functionName}`);
      }
    }
  };
}
