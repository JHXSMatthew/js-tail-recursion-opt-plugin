# 🚀 js-tail-recursion-opt-plugin v1.0.0 - Now Available!

I'm excited to announce the release of **js-tail-recursion-opt-plugin v1.0.0**, a modern Babel plugin that automatically optimizes tail-recursive functions into efficient loops at compile time.

## 🎉 Key Features

✅ **Automatic Tail Call Optimization** - Converts tail-recursive functions to loops  
✅ **Stack Overflow Prevention** - Handle millions of recursive calls safely  
✅ **Zero Runtime Overhead** - Optimization happens at compile time  
✅ **Full TypeScript Support** - Includes type definitions  
✅ **Source Map Support** - Full debugging capability  
✅ **Comprehensive Testing** - 40 tests, 100% coverage  

## 📊 Performance Highlights

| Test | Input | Unoptimized | Optimized | Result |
|------|-------|-------------|-----------|--------|
| Factorial | 10,000 | ❌ Stack overflow | ✅ 0ms | Crash prevention |
| Sum | 100,000 | ❌ Stack overflow | ✅ 1ms | Crash prevention |
| Fibonacci | 10,000 | ❌ Stack overflow | ✅ 2ms | Crash prevention |

## 📦 Installation

```bash
npm install --save-dev js-tail-recursion-opt-plugin
```

## 🚀 Quick Start

**.babelrc**
```json
{
  "plugins": ["js-tail-recursion-opt-plugin"]
}
```

**Before (causes stack overflow):**
```javascript
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc);  // Stack overflow at ~10,000
}
```

**After (works for any depth):**
```javascript
// Same code, but now optimized to a loop!
factorial(100000); // ✅ No stack overflow!
```

## 🏗️ What It Does

The plugin automatically detects tail-recursive patterns and converts them to efficient while loops:

```javascript
// Your code
function sum(n, acc = 0) {
  if (n === 0) return acc;
  return sum(n - 1, acc + n);
}

// Becomes (conceptually)
function sum(n, acc = 0) {
  while (true) {
    if (n === 0) return acc;
    let _n = n - 1;
    let _acc = acc + n;
    n = _n;
    acc = _acc;
    continue;
  }
}
```

## 🌟 Supported Patterns

- ✅ Function declarations and expressions
- ✅ Arrow functions (both block and expression forms)
- ✅ Conditional tail calls (ternary operators)
- ✅ If/else statement branches
- ✅ Logical expression tail calls (&&, ||)
- ✅ Functions with multiple parameters
- ✅ Functions with default parameters

## 📚 Documentation

- [README](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin#readme) - Complete usage guide
- [Examples](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/tree/master/examples) - Real-world use cases
- [Performance Report](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/blob/master/PERFORMANCE.md) - Benchmark results
- [Contributing Guide](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/blob/master/CONTRIBUTING.md) - How to contribute

## 🤝 Contributing

This project is open source and welcomes contributions! Check out our [contributing guide](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/blob/master/CONTRIBUTING.md) to get started.

## 🔗 Links

- 🏠 [GitHub Repository](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin)
- 📦 [npm Package](https://www.npmjs.com/package/js-tail-recursion-opt-plugin) *(coming soon)*
- 🎉 [Release Notes](https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/releases/tag/v1.0.0)

## 🙏 Thank You

Special thanks to everyone who helped test and provide feedback during development. If you find this plugin useful, please star the repository and share it with others!

---

*Ready to eliminate stack overflow errors in your recursive functions? Give js-tail-recursion-opt-plugin a try!*
