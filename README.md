> ⚠️ **SDK NOTICE:**  
> The TypeScript and Go SDKs have been moved to their own repositories:
>
> - 🟦 TypeScript: [github.com/specform/ts-sdk](https://github.com/specform/ts-sdk)
> - 🟨 Go: [github.com/specform/go-sdk](https://github.com/specform/go-sdk)
>
> This monorepo no longer maintains active SDK development. Please update your dependencies accordingly.

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

## Authoring Specs

Prompt specs are written in `.spec.md` files using frontmatter and codefenced blocks. Outside of those blocks, any valid markdown can be written for documentation purposes — it won’t be included in the compiled output.

### Frontmatter Header (Prompt Metadata)

```yaml
---
model: "gpt-4"
temperature: 0.3
scenario: "Summarize a technical document"
tags: ["summarization", "test"]
---
```

The frontmatter defines metadata about the prompt and is required at the top of every spec.

---

### `prompt` Codefence

```prompt
Please summarize the following article in a {{tone}} tone:

{{article}}
```

The prompt section defines the actual prompt template. Mustache-style `{{variable}}` placeholders are used for runtime interpolation.

---

### `inputs` Codefence

```inputs
article = """Webhooks enable real-time communication..."""
tone = "casual"
```

Inputs define the required or optional variables that will be injected into the prompt. Defaults can be supplied using assignment syntax.

---

### `assertions` Codefence

```assertions
- contains: "real time"
- matches: /HTTP requests/i
- semantic-similarity: "event-driven communication"
```

Assertions describe the expectations that will be evaluated against the model’s output. These are used in CLI or SDK-based test runs.

---

## Monorepo Structure

```txt
.
├── sdk/           # SDKs and CLI tools
│   ├── ts/        # TypeScript packages (managed by pnpm)
│   │   ├── core/  # Core logic, types, assertions, prompt interface, use for building custom clients
│   │   ├── node/  # Node.js runtime client
│   │   ├── web/   # Browser/Edge runtime client
│   ├── go/        # Go SDK and CLI
```

---

## Getting Started

### Prerequisites

- Node.js + pnpm
- Go (for CLI development)

### TypeScript SDK

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

### Core SDK (`@specform/core`)

The core TypeScript SDK provides the fundamental building blocks for working with prompts, assertions, and snapshots. Use this package to build custom clients for any js/ts runtime.

#### Install

```bash
npm add @specform/core
```

#### Usage

```ts
import { createClient } from "@specform/core";

const client = createClient({
  loadPrompt: async (name) => loadPromptFromFile(name),
  loadSnapshot: async (name) => loadSnapshotFromFile(name),
});

const prompt = await client.usePrompt("my-prompt");
const output = await llm.generate(prompt.render({ name: "Alice" }));
const results = prompt.assert("equals", output, "Hello, Alice!");
```

You can also register custom assertions by implementing the `Assertion` interface.

---

### Web SDK (`@specform/web`)

Browser and Edge-compatible runtime client. Fetches prompt specs and snapshots from a remote server using the Fetch API.

#### Install

```bash
npm install @specform/web
```

#### Usage

```ts
import { createWebClient } from "@specform/web";

const { usePrompt, fromSnapshot } = createWebClient({
  baseUrl: "https://example.com/specform",
});
```

---

### Node SDK (`@specform/node`)

Node.js runtime client with built-in filesystem support.

#### Install

```bash
npm install @specform/node
```

#### Usage

```ts
import { client } from "@specform/node";

const { usePrompt, fromSnapshot } = client;
```

### Go SDK & CLI

The Go SDK provides a CLI and Go package for working with `.spec.md` files.

#### Install (CLI)

```bash
go install github.com/specform/specform/sdk/go/cmd/specform@latest
```

#### Compile Prompt Specs

```bash
specform compile ./examples --output build
```

#### Render a Prompt

```bash
specform render --prompt build/my-prompt.prompt.json --input name=Alice
```

#### Test Output Against Assertions

```bash
specform test --prompt build/my-prompt.prompt.json --output output.txt
```

#### Save a Snapshot

```bash
specform snapshot --prompt build/my-prompt.prompt.json --output output.txt --out snapshots/
```

#### Serve Prompts & Snapshots

```bash
specform serve --dir build --port 8080
```

See the [Go SDK README](./sdk/go/README.md) for full usage.

---

## License

© 2025 Brad Walker. Licensed under the Apache License, Version 2.0, see [LICENSE](./LICENSE) for details.
