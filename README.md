# js-tail-recursion-opt-plugin

[![npm version](https://badge.fury.io/js/js-tail-recursion-opt-plugin.svg)](https://www.npmjs.com/package/js-tail-recursion-opt-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern TypeScript/JavaScript compiler plugin that automatically optimizes tail-recursive functions into efficient loops at compile time.

## 🚀 Features

- ✅ **Automatic Detection**: Scans your code for tail-recursive patterns
- ✅ **Loop Transformation**: Converts tail calls to `while` loops for better performance
- ✅ **Stack Overflow Prevention**: Eliminates stack overflow issues with deep recursion
- ✅ **TypeScript Support**: Full TypeScript compatibility
- ✅ **Zero Runtime Overhead**: Optimization happens at compile time
- ✅ **Configurable**: Control which functions to optimize with annotations
- ✅ **Comprehensive Testing**: Extensive test suite ensures correctness

## 📦 Installation

```bash
npm install --save-dev js-tail-recursion-opt-plugin
# or
yarn add -D js-tail-recursion-opt-plugin
```

## 🔧 Usage

### With Babel

Add the plugin to your Babel configuration:

**.babelrc**
```json
{
  "plugins": ["js-tail-recursion-opt-plugin"]
}
```

**babel.config.js**
```javascript
module.exports = {
  plugins: ['js-tail-recursion-opt-plugin']
};
```

### With Options

```javascript
{
  "plugins": [
    ["js-tail-recursion-opt-plugin", {
      "debug": false,
      "onlyAnnotated": false,
      "annotationTag": "@tail-recursion"
    }]
  ]
}
```

## 📖 Examples

### Basic Tail Recursion

**Before:**
```javascript
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc);
}
```

**After optimization (conceptual):**
```javascript
function factorial(n, acc = 1) {
  let _n_ = n;
  let _acc_ = acc;
  
  while (true) {
    if (_n_ <= 1) return _acc_;
    
    let temp_n = _n_ - 1;
    let temp_acc = _n_ * _acc_;
    _n_ = temp_n;
    _acc_ = temp_acc;
    continue;
  }
}
```

### Arrow Functions

```javascript
// Also works with arrow functions!
const sum = (n, acc = 0) => {
  if (n === 0) return acc;
  return sum(n - 1, acc + n);
};
```

### Conditional Tail Calls

```javascript
// Ternary operators
const countdown = (n, acc = []) => 
  n === 0 ? acc : countdown(n - 1, [...acc, n]);

// Multiple conditions
function search(arr, target, index = 0) {
  if (index >= arr.length) return -1;
  if (arr[index] === target) return index;
  return search(arr, target, index + 1);
}
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `debug` | `boolean` | `false` | Enable debug logging during compilation |
| `onlyAnnotated` | `boolean` | `false` | Only optimize functions with annotation comments |
| `annotationTag` | `string` | `"@tail-recursion"` | Custom annotation tag to identify functions for optimization |

### Using Annotations

When `onlyAnnotated` is enabled, only functions with the specified annotation will be optimized:

```javascript
/** @tail-recursion */
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc);
}

// This won't be optimized
function notOptimized(n) {
  return n > 0 ? n + notOptimized(n - 1) : 0;
}
```

## 🧪 What Gets Optimized?

### ✅ Supported Patterns

- Simple tail recursion
- Tail calls in conditional expressions (ternary)
- Tail calls in `if`/`else` branches
- Tail calls in logical expressions (`&&`, `||`)
- Arrow functions with tail recursion
- Function expressions assigned to variables

### ❌ Not Optimized

- Non-tail recursive calls (e.g., `return n * factorial(n-1)`)
- Mutual recursion
- Recursion with try/catch blocks
- Functions with both tail and non-tail recursive calls

## 🎯 Performance Benefits

Tail call optimization can dramatically improve performance and prevent stack overflow errors:

```javascript
// Without optimization: Stack overflow at ~10,000 iterations
// With optimization: Can handle millions of iterations

function sum(n, acc = 0) {
  if (n === 0) return acc;
  return sum(n - 1, acc + n);
}

sum(1000000); // ✅ Works with optimization
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🧩 How It Works

1. **Detection Phase**: The plugin scans the AST for recursive function calls
2. **Validation**: Ensures all recursive calls are in tail position
3. **Transformation**: Converts the function body into a `while(true)` loop
4. **Variable Management**: Uses temporary variables to safely update parameters

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Your Name]

## 🔗 Links

- [GitHub Repository](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin)
- [Issues](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/issues)
- [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)

## 📚 Related Projects

- [babel-plugin-transform-tail-calls](https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-tail-calls) - Babel's experimental tail call plugin
- [tailcall.js](https://github.com/seangenabe/tailcall.js) - Runtime tail call optimization

---

**Made with ❤️ by the JavaScript community**
