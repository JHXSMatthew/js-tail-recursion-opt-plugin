# Release Checklist

## Pre-Release

- [x] All tests passing (40/40)
- [x] Code coverage 100%
- [x] CI/CD configured (GitHub Actions)
- [x] Documentation complete
- [x] Examples added
- [x] CHANGELOG updated
- [x] Version bumped to 1.0.0
- [x] Performance benchmarks documented
- [x] Source maps enabled

## Release Steps

### 1. Final Checks

```bash
# Run all tests
npm test

# Run coverage
npm run test:coverage

# Run benchmarks
npm run benchmark

# Generate performance report
npm run benchmark:report

# Build
npm run build
```

### 2. Create Git Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0 - First stable release"
git push origin v1.0.0
```

### 3. Create GitHub Release

Go to: https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/releases/new

**Title:** v1.0.0 - First Stable Release

**Description:**
```markdown
## 🎉 First Stable Release

### Features

✅ **Automatic Tail Call Optimization**
- Converts tail-recursive functions to efficient loops
- Prevents stack overflow errors
- Zero runtime overhead

✅ **Comprehensive Support**
- Function declarations and expressions
- Arrow functions (block and expression forms)
- Conditional tail calls (ternary, if/else)
- Logical expression tail calls (&&, ||)

✅ **Developer Experience**
- TypeScript support with type definitions
- Source maps for debugging
- Configurable optimization (annotations)
- Detailed error messages

### Performance

- Handles 100,000+ iterations
- Near-loop performance
- 100% test coverage (40 tests)

### Documentation

- [README](./README.md) - Complete usage guide
- [Examples](./examples/) - Real-world examples
- [Performance Report](./PERFORMANCE.md) - Benchmark results
- [Contributing](./CONTRIBUTING.md) - Contribution guide

### Installation

\`\`\`bash
npm install --save-dev js-tail-recursion-opt-plugin
\`\`\`

### Quick Start

\`\`\`.babelrc
{
  "plugins": ["js-tail-recursion-opt-plugin"]
}
\`\`\`

See [README](./README.md) for full documentation.
```

### 4. Publish to npm

```bash
# Dry run to check package
npm publish --dry-run

# Publish
npm publish
```

### 5. Post-Release

- [ ] Verify npm package: https://www.npmjs.com/package/js-tail-recursion-opt-plugin
- [ ] Update badges in README if needed
- [ ] Announce on social media (optional)
- [ ] Update project website (if any)

## Notes

- First stable release (1.0.0)
- Production ready
- Full test coverage
- Complete documentation
- CI/CD configured
