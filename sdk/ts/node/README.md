# @specform/node

The Node.js adapter for the Specform prompt framework. Provides file system-based loading for prompt specs and snapshots.

Built on top of `@specform/core`.

---

## Installation

```bash
npm install @specform/node
```

---

## Usage

```ts
import { client } from "@specform/node";

const prompt = await client.usePrompt("greeting");
const output = await llm.generate(prompt.render({ name: "Alice" }));
prompt.assert("equals", output, "Hello, Alice!");
```

---

## See Also

- [`@specform/core`](../core) – Core prompt runtime and assertion engine
- [`@specform/web`](../web) – Browser/Edge-compatible fetch client
