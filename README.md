# Types Duplicate Finder

A TypeScript CLI tool that detects duplicate interfaces across your codebase by analyzing their structure rather than just their names. This helps identify interfaces that have identical properties but different names, which could be candidates for consolidation.

## Features

- 🔍 **Smart Detection**: Finds interfaces with identical property structures, regardless of their names
- 📁 **Recursive Scanning**: Analyzes single files or entire directories recursively
- 🎯 **Property-Based Comparison**: Compares interfaces by their actual properties and types, not just names
- 💡 **Merge Suggestions**: Provides suggested interface definitions for consolidation
- ⚡ **Fast Analysis**: Built with `ts-morph` for efficient TypeScript AST parsing

## Installation

### From JSR

```bash
# Deno
deno add @razmans/types-duplicate-finder

# Node.js
npx jsr add @razmans/types-duplicate-finder

# Bun
bunx jsr add @razmans/types-duplicate-finder
```

## Usage

### Command Line Interface

```bash
# Using JSR
npx jsr @razmans/types-duplicate-finder ./src/types.ts
deno run -A jsr:@razmans/types-duplicate-finder ./src/types.ts

# Analyze a single file
npx @razmans/types-duplicate-finder ./src/types.ts

# Analyze an entire directory
npx @razmans/types-duplicate-finder ./src
```

### Example Output

When duplicates are found:

```
Duplicate interfaces found:
- User (./test/detected/file1.ts)
- Customer (./test/detected/file2.ts)

Suggested merge:
interface User {
  id: string;
  name: string;
  email: string;
}
```

When no duplicates are found:

```
No duplicate interfaces found.
```

## How It Works

The tool analyzes TypeScript interfaces by:

1. **Parsing**: Uses `ts-morph` to parse TypeScript files and extract interface declarations
2. **Serialization**: Converts each interface's properties into a normalized format for comparison
3. **Comparison**: Groups interfaces with identical property structures
4. **Reporting**: Shows which interfaces are duplicates and suggests merged definitions

## Example

Consider these two files:

**file1.ts**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}
```

**file2.ts**
```typescript
export interface Customer {
  id: string;
  name: string;
  email: string;
}
```

The tool will detect that `User` and `Customer` have identical structures and suggest they could be consolidated.

## Development

### Project Structure

```
├── index.ts              # CLI entry point
├── functions/
│   ├── helper.ts         # Core logic for finding duplicates
│   └── interface.ts      # Type definitions
├── test/
│   ├── detected/         # Test cases with duplicates
│   └── not-detected/     # Test cases without duplicates
└── package.json
```


### Testing

The project includes test cases in the `test/` directory:

- `test/detected/`: Contains interfaces that should be flagged as duplicates
- `test/not-detected/`: Contains interfaces that should not be flagged

## Dependencies

- `ts-morph`: TypeScript AST manipulation
- `commander`: CLI framework
- `typescript`: TypeScript compiler

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Use Cases

- **Code Cleanup**: Identify redundant interface definitions before refactoring
- **Code Review**: Catch duplicate interfaces during development
- **Legacy Codebase Analysis**: Find consolidation opportunities in large codebases
- **CI/CD Integration**: Automate duplicate detection in your build pipeline

## Limitations

- Only analyzes TypeScript interface declarations
- Does not handle complex generic types or conditional types
- Property order is normalized, so interfaces with the same properties in different orders are considered duplicates
