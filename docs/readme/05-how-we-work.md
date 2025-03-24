## Architecture: Presentational/Container Pattern

We follow the Presentational/Container component pattern (also known as Smart/Dumb components) to separate concerns in our React application.

### How It Works

1. **Container Components (Smart)**

   - Manage state and data fetching
   - Handle business logic
   - Pass data to presentational components
   - Connect to external services and APIs
   - Usually do not include much styling

2. **Presentational Components (Dumb)**
   - Receive data via props
   - Focus on visual representation
   - Have minimal to no business logic
   - Can contain UI state (like hover effects)
   - Are reusable across different containers

### Benefits

- **Separation of Concerns** - Clear distinction between UI and business logic
- **Improved Testability** - Presentational components are easier to test in isolation
- **Reusability** - Pure UI components can be reused across different features
- **Maintainability** - Changes to business logic or UI can be made independently
- **Collaboration** - Designers can focus on presentational components while developers handle containers
- **Consistency** - Enforces a predictable pattern throughout the codebase

### Implementation Guidelines

- Keep presentational components in `src/components/` directory
- Place container components closer to where they're used, often in feature-specific directories
- Use custom hooks in `src/hooks/` to share stateful logic between containers
- Avoid prop drilling by using context or composition when appropriate
- Document component API with proper TypeScript types
- Follow SOLID principles, especially Single Responsibility
