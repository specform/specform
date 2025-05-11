# Specform Core Typescript SDK

## Overview

`@specform/core` is the core SDK for Specform, a framework for defining, testing, and deploying prompts for large language models (LLMs) as flat markdown files. This SDK provides the core functionality for creating and managing prompt specifications, assertions, and other related features and serves as the foundation for other typescript SDKs in the Specform ecosystem.

This library is runtime-agnostic and can be used in various environments, including Node.js, the browser, and Bun. It is designed to be lightweight and efficient, making it suitable for use in both server-side and client-side applications.

Out of the box the core SDK does not include any runtime-specific functionality. Instead, it provides a set of interfaces and types that can be implemented by other SDKs to provide runtime-specific functionality.

Use this SDK to build your own custom runtime-specific SDKs or to create your own custom assertions and prompt specifications. If you are looking for a runtime-specific SDK, check out the `@specform/node`, `@specform/bun`, or `@specform/web` packages, which provide file-system and fetch adapters, respectively.

For more details around authoring prompts, see the [Specform documentation](https://github.com/specform/specform).

## Installation

To install the Specform core SDK, run the following command:

```bash
npm add @specform/core
```

## Usage

The core SDK provides a set of classes and functions for working with prompt specifications, assertions, and other related features. The main entry point is the `createClient` factory function, which creates a new instance of the Specform client.

```typescript
import { createClient } from "@specform/core";

const client = createClient({
  loadPrompt: async (promptName) => {
    // Load the prompt specification from a file or other source
    const promptSpec = await loadPromptFromFile(promptName);
    return promptSpec;
  },
  loadSnapshot: async (snapshotName) => {
    // Load the snapshot from a file or other source
    const snapshot = await loadSnapshotFromFile(snapshotName);
    return snapshot;
  },
});
```

The instantiated client can be used to load compiled prompt specifications through the `usePrompt` method which returns a `Prompt` object.

```typescript
const prompt = await client.usePrompt('my-prompt');
```

The `Prompt` object provides methods for rendering a prompt and validating the output using assertions. For example:

```typescript
prompt.render({ name: "Alice" });
```

The `render` method returns a string a string with interpolated values inserted. This fully formatted string can be passed to an LLM for evaluation.

```typescript
const output = await llm.generate(prompt.render({ name: "Alice" }));
```

The output can then be validated using assertions. The core SDK provides a set of built-in assertions, including `equals`, `regex`, and `similarity`. You can also create custom assertions by implementing the `Assertion` interface.

```typescript
import { createClient } from "@specform/core";

const client = createClient({
  loadPrompt: async (promptName) => {
    // Load the prompt specification from a file or other source
    const promptSpec = await loadPromptFromFile(promptName);
    return promptSpec;
  },
});

const prompt = await client.usePrompt("my-prompt");
const output = await llm.generate(prompt.render({ name: "Alice" }));

prompt.assert(output, {
  assertion: "equals",
  expected: "Hello, Alice!",
});
```

The `assert` method validates the output against the expected value using the specified assertion type. If the assertion fails, an error is thrown with a detailed message.

The core SDK also provides a set of built-in assertions, including `equals`, `regex`, and `similarity`. You can also create custom assertions by implementing the `Assertion` interface.

## API Reference

@TODO: Add API reference documentation
