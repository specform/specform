// packages/web/__tests__/web.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPromptLoader, fetchSnapshotLoader } from "../web";
import { createPromptClient } from "@promptspec/core";

const prompt = {
  id: "sample",
  hash: "abc123",
  scenario: "Sample",
  compiledPrompt: "Hi {{name}}",
  inputs: ["name"],
  defaultInputs: { name: "Web" },
};

const snapshot = {
  id: "sample-snap",
  hash: "abc123",
  promptId: "sample",
  promptHash: "abc123",
  output: "Hi Web",
  inputs: { name: "Web" },
  assertions: [],
  createdAt: new Date().toISOString(),
};

const mockFetch = vi.fn();

globalThis.fetch = mockFetch as typeof fetch;

describe("fetch loaders", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("loads prompt via fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => prompt,
    });

    const loader = fetchPromptLoader("https://example.com/prompts");
    const result = await loader("sample");
    expect(result.id).toBe("sample");
  });

  it("loads snapshot via fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => snapshot,
    });

    const loader = fetchSnapshotLoader("https://example.com/snaps");
    const result = await loader("sample-snap");
    expect(result.output).toBe("Hi Web");
  });

  it("client integration with usePrompt", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => prompt,
    });

    const client = createPromptClient({
      loadPrompt: fetchPromptLoader("https://example.com/prompts"),
      loadSnapshot: fetchSnapshotLoader("https://example.com/snaps"),
    });

    const p = await client.usePrompt("sample");

    expect(p.render({})).toBe("Hi Web");
  });
});
