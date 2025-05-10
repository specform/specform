# Specform

This is the monorepo for `Specform`, a language-agnostic prompt specification framework for testing, evaluating, and deploying LLM prompts.

## What is Specform?

Specform is a framework for defining, testing, and deploying prompts for large language models (LLMs). It allows you to create declarative prompt specifications that can be version-controlled and shared across different programming languages and runtimes.

### Features

- **Declarative Prompt Specs** – Markdown-based, version-controlled prompt definitions
- **Built-in Assertions** – Validate LLM output using regex, string matching, or semantic similarity
- **Multi-language SDKs** – Use compiled prompts across Go and TypeScript
- **Snapshot Testing** – Track prompt output changes over time
- **Prompt Documentation** – Specs double as human-readable docs for teams
- **Runtime Agnostic** – Integrates with any model or backend

---

## Monorepo Structure

```txt
.
└─ sdk/
   │
   ├── ts/         # TypeScript packages (managed by pnpm)
   │   ├── core/   # Core logic, types, assertions, prompt interface
   │   ├── node/   # Node.js file-system adapter
   │   ├── web/    # Browser/Edge fetch adapter
   │   └── bun/    # Bun runtime support
   ├── go/         # Go SDK and CLI
```

## Getting Started

### Prerequisites

- Node.js + pnpm
- Go (for CLI development)

### Typescript SDK

From the `ts` directory, run:

#### Install

```bash
pnpm install
```

#### Test

```bash
pnpm test
```

#### Build

```bash
pnpm build
```

---

License
MIT License
Copyright (c) 2025 Brad Walker
