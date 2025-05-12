# Specform Web SDK

Web/Edge SDK for Specform. This package is designed to fetch prompts and snapshots from a remote server using the Fetch API.

## Installation

```bash
npm install @specform/web
```

## Usage

```typescript
import { createWebClient } from "@specform/node";

const { usePrompt, fromSnapshot } = createWebClient({
  baseUrl: "https://example.com/specform",
});
```
