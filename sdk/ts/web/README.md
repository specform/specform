# @specform/web

The Web/Edge-compatible SDK for Specform. Fetches prompt specs and snapshots from a remote server using the Fetch API.

Built on top of `@specform/core`.

---

## Installation

```bash
npm install @specform/web
```

---

## Usage

```ts
import { createWebClient } from "@specform/web";

const { usePrompt, fromSnapshot } = createWebClient({
  baseUrl: "https://example.com/specform",
});

const prompt = await usePrompt("welcome");
const output = await llm.generate(prompt.render({ user: "Alice" }));
prompt.assert("contains", output, "Welcome");
```

---

## See Also

- [`@specform/core`](../core)
- [`@specform/node`](../node)
