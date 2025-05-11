import { describe, it, expect, vi } from "vitest";
import { createPromptClient, PromptLoader, SnapshotLoader } from "../client";
import { Prompt } from "../prompt";
import type { CompiledPrompt, Snapshot } from "../types";

const MOCK_PROMPT: CompiledPrompt = {
  id: "test-id",
  hash: "abc123",
  scenario: "Test Prompt",
  compiledPrompt: "Hi {{name}}",
  inputs: ["name"],
};

const MOCK_SNAPSHOT: Snapshot = {
  id: "test-id-snap",
  hash: "abc123",
  promptId: "test-id",
  promptHash: "abc123",
  output: "Hi Joe Strummer",
  inputs: { name: "Joe Strummer" },
  assertions: [],
  createdAt: new Date().toISOString(),
  passed: true,
};

describe("PromptClient", () => {
  const loadPrompt = vi.fn(() => MOCK_PROMPT) as unknown as PromptLoader;
  const loadSnapshot = vi.fn(() => MOCK_SNAPSHOT) as unknown as SnapshotLoader;

  it("should create a prompt client", () => {
    const client = createPromptClient({
      loadPrompt,
      loadSnapshot,
    });

    expect(client).toBeDefined();
  });

  it("should expose the usePrompt method", async () => {
    const client = createPromptClient({
      loadPrompt,
      loadSnapshot,
    });

    const prompt = await client.usePrompt(MOCK_PROMPT.id);
    expect(prompt.meta.id).toBe(MOCK_PROMPT.id);
  });

  it("should throw an error if prompt not found", async () => {
    const client = createPromptClient({
      loadPrompt: vi.fn(() => null) as unknown as PromptLoader,
      loadSnapshot,
    });

    await expect(client.usePrompt("non-existent-id")).rejects.toThrow(
      "Prompt with id non-existent-id not found"
    );
  });

  it("should throw an error if snapshot not found", async () => {
    const client = createPromptClient({
      loadPrompt,
      loadSnapshot: vi.fn(() => null) as unknown as SnapshotLoader,
    });

    await expect(client.fromSnapshot("non-existent-id")).rejects.toThrow(
      "Snapshot with id non-existent-id not found"
    );
  });

  it("should load a snapshot", async () => {
    const client = createPromptClient({
      loadPrompt,
      loadSnapshot,
    });

    const { prompt, snapshot } = await client.fromSnapshot(MOCK_SNAPSHOT.id);
    expect(prompt.meta.id).toBe(MOCK_PROMPT.id);
    expect(snapshot.id).toBe(MOCK_SNAPSHOT.id);
    expect(snapshot.inputs).toEqual(MOCK_SNAPSHOT.inputs);
    expect(snapshot.output).toBe(MOCK_SNAPSHOT.output);
    expect(snapshot.assertions).toEqual(MOCK_SNAPSHOT.assertions);
    expect(snapshot.passed).toBe(MOCK_SNAPSHOT.passed);
  });

  it("should skip cache when specified", async () => {
    const client = createPromptClient({
      loadPrompt,
      loadSnapshot,
    });

    const prompt = await client.usePrompt(MOCK_PROMPT.id, true);
    await client.fromSnapshot(MOCK_SNAPSHOT.id, true);

    expect(prompt.meta.id).toBe(MOCK_PROMPT.id);
    expect(loadPrompt).toHaveBeenCalledWith(MOCK_PROMPT.id);
    expect(loadSnapshot).toHaveBeenCalledWith(MOCK_SNAPSHOT.id);

    // Call again, this time it shouldn't hit the cache
    const prompt2 = await client.usePrompt(MOCK_PROMPT.id, true);
    await client.fromSnapshot(MOCK_SNAPSHOT.id, true);

    expect(prompt2.meta.id).toBe(MOCK_PROMPT.id);
    expect(loadPrompt).toHaveBeenCalled();
    expect(loadSnapshot).toHaveBeenCalledWith(MOCK_SNAPSHOT.id);
    expect(loadSnapshot).toHaveBeenCalled();
  });
});
