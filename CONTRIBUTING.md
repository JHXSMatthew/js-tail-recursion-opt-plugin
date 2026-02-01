# Contributing to js-tail-recursion-opt-plugin

Thank you for your interest in contributing! 🎉

## Development Setup

```bash
# Clone the repository
git clone https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin.git
cd js-tail-recursion-opt-plugin

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run benchmarks
npm run benchmark
```

## Project Structure

```
js-tail-recursion-opt-plugin/
├── src/
│   ├── index.ts          # Main plugin entry point
│   ├── detector.ts       # Tail call detection logic
│   └── optimizer.ts      # Tail call to loop transformation
├── test/
│   ├── basic.test.ts     # Basic functionality tests
│   ├── conditional.test.ts
│   ├── arrow-function.test.ts
│   ├── options.test.ts
│   ├── runtime.test.ts   # Runtime correctness tests
│   └── edge-cases.test.ts
├── benchmark/
│   ├── simple.js         # Quick performance tests
│   └── suite.js          # Full benchmark suite
└── dist/                 # Compiled output
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- basic.test.ts

# Watch mode
npm run test:watch
```

## Adding New Features

1. **Write tests first** - Add test cases in `test/`
2. **Implement the feature** - Modify `src/detector.ts` or `src/optimizer.ts`
3. **Verify** - Ensure all tests pass
4. **Benchmark** - Add performance tests if applicable
5. **Document** - Update README.md with examples

## Test Coverage Requirements

- All new code must have test coverage
- Aim for 100% coverage
- Include edge cases

## Code Style

- TypeScript strict mode enabled
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns

## Commit Messages

Use conventional commits:

```
feat: Add support for mutual recursion
fix: Correct tail position detection for arrow functions
test: Add edge cases for nested conditionals
docs: Update README with more examples
perf: Optimize parameter assignment generation
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Reporting Bugs

When filing an issue, please include:

1. **Description** - What went wrong?
2. **Code sample** - Minimal reproduction case
3. **Expected behavior** - What should happen?
4. **Actual behavior** - What actually happened?
5. **Environment** - Node version, OS, etc.

Example:

```markdown
### Bug Description
Tail recursion not optimized for arrow functions with ternary operators

### Code Sample
\`\`\`javascript
const sum = (n, acc = 0) => n === 0 ? acc : sum(n - 1, acc + n);
\`\`\`

### Expected
Should be optimized to a loop

### Actual
Not optimized, causes stack overflow

### Environment
- Node.js: v20.11.0
- Plugin version: 0.1.0
```

## Feature Requests

We love new ideas! Please open an issue with:

1. **Use case** - Why is this needed?
2. **Proposed solution** - How should it work?
3. **Examples** - Code samples showing the feature

## Questions?

- Open a GitHub issue with the `question` label
- Check existing issues first
- Be specific and provide context

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🚀
