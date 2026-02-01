# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-02

### 🎉 First Stable Release

#### Added
- **Code generation optimization** - Improved generated code readability
  - Single parameter: direct assignment without temp variables
  - Multi-parameter: indexed temp variables (_temp0, _temp1)
  - Zero parameter: minimal code generation
- **Source Map support** - Full debugging support with source maps
- **Performance visualization** - Automated benchmark report generation
- **npm publish preparation** - .npmignore, package metadata
- **Additional tests** - Code generation tests (40 total tests)
- GitHub Actions CI/CD workflow
- Code coverage reporting with Codecov
- Comprehensive examples folder with real-world use cases
- Contributing guidelines (CONTRIBUTING.md)
- Performance report (PERFORMANCE.md)
- Multiple badges in README (build status, coverage, npm version)

#### Changed
- Enhanced README with more examples and best practices
- Improved documentation structure
- Optimized temp variable naming scheme
- Better code generation for edge cases

#### Performance
- 100% test coverage (40/40 tests passing)
- Handles 100,000+ iterations without stack overflow
- Near-zero overhead compared to manual loops

## [0.1.0] - 2026-02-02 (Internal)

### Added
- Initial release
- Core tail recursion detection and optimization
- Support for function declarations and expressions
- Support for arrow functions (both block and expression forms)
- Conditional tail calls (ternary operators, if/else)
- Logical expression tail calls (&&, ||)
- Plugin configuration options (debug, onlyAnnotated, annotationTag)
- Comprehensive test suite (31 tests, 100% coverage)
- Performance benchmark suite
- Full TypeScript support

### Features
- ✅ Automatic tail call detection
- ✅ Loop transformation (while loops)
- ✅ Stack overflow prevention
- ✅ Zero runtime overhead
- ✅ Configurable optimization

### Performance
- Handles 10,000+ recursion depth
- Prevents stack overflow errors
- Near-loop performance

### Documentation
- README with examples
- API documentation
- Benchmark results
- Test coverage

## Previous Versions

### Development Phases

#### Phase 1: Foundation (2026-02-02 00:00-04:00)
- Project setup and structure
- Basic tail recursion detection
- Initial test suite (23 tests)
- Core optimization logic

#### Phase 2: Optimization Round 1 (2026-02-02 04:00-04:52)
- Bug fixes for arrow functions and logical expressions
- Test expansion (23 → 31 tests)
- Benchmark suite creation
- 100% test pass rate achieved

#### Phase 3: Optimization Round 2 (2026-02-02 04:52-05:03)
- CI/CD pipeline setup
- Documentation enhancement
- Examples folder creation
- Code coverage integration

---

[Unreleased]: https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/JHXSMatthew/js-tail-recursion-opt-plugin/releases/tag/v0.1.0
