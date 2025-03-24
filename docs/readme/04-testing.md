# Testing

## Testing Framework

We use [Jest](https://jestjs.io/) as our primary testing framework along with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) for testing React components.

## Running Tests

To run all tests once:

```bash
npm test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

## Git Hooks with Husky

We use [Husky](https://typicode.github.io/husky/) to enforce code quality and testing at critical points in the development workflow:

### Pre-commit Hook

Before each commit, the pre-commit hook runs:

- Linting on staged files
- Formatting with Prettier

This ensures that all committed code meets our style and quality standards.

### Pre-push Hook

Before pushing to the remote repository, the pre-push hook runs:

- Full linting check across the entire codebase
- All tests

This prevents pushing code that could break the build or introduce regressions.
