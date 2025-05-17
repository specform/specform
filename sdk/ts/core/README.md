# @specform/core

The core SDK for Specform — a framework for defining, testing, and managing prompts for large language models (LLMs) using markdown-based specs.

This package provides the runtime-agnostic logic for:

- Prompt loading and rendering
- Assertions and validation
- Snapshot evaluation
- Custom assertion registration

Use this package as the foundation for building your own SDKs or prompt runners.

---

## Installation

```bash
npm install @specform/core
```

---

## Usage

```ts
import { createClient } from "@specform/core";

const client = createClient({
  loadPrompt: async (name) => loadPromptFromFile(name),
  loadSnapshot: async (name) => loadSnapshotFromFile(name),
});

const prompt = await client.usePrompt("greeting");
const output = await llm.generate(prompt.render({ name: "Alice" }));
prompt.assert("equals", output, "Hello, Alice!");
```

---

## Custom Assertions

```ts
client.registerAssertion("starts-with", (expected, actual) => {
  const passed = actual.startsWith(expected);
  return {
    type: "starts-with",
    value: expected,
    passed,
    message: passed
      ? "✔ Starts with expected value"
      : "✘ Did not start with expected value",
  };
});
```

---

## See Also

- [`@specform/node`](../node) – Node.js file system adapter
- [`@specform/web`](../web) – Browser/Edge fetch adapter
