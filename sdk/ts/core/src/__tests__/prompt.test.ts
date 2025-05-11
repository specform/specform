import { describe, vi, it, expect } from "vitest";
import { PromptLoader, SnapshotLoader, createPromptClient } from "../client";
import { Prompt } from "../prompt";
import { CompiledPrompt, Snapshot } from "../types";
import { AssertionRegistry } from "../assert";

const MOCK_PROMPT: CompiledPrompt<{ name: string }> = {
  id: "test-id",
  hash: "abc123",
  scenario: "Test Prompt",
  compiledPrompt: "Hi {{name}}",
  inputs: ["name" as const],
};

const MOCK_SNAPSHOT: Snapshot = {
  id: "test-id-snap",
  hash: "abc123",
  promptId: "test-id",
  promptHash: "abc123",
  output: "Hi Brad",
  inputs: { name: "Brad" },
  assertions: [],
  createdAt: new Date().toISOString(),
  passed: true,
};

const assertionRegistry = {
  register: vi.fn(),
  get: vi.fn(),
  run: vi.fn(),
  runAll: vi.fn().mockReturnValue([]),
} as unknown as AssertionRegistry;

describe("Prompt", () => {
  it("should create a prompt instance", () => {
    const prompt = new Prompt(MOCK_PROMPT, assertionRegistry);
    expect(prompt).toBeInstanceOf(Prompt);
  });

  it("should render the prompt with inputs", () => {
    const prompt = new Prompt(MOCK_PROMPT, assertionRegistry);
    const output = prompt.render({ name: "Brad" });
    expect(output).toBe("Hi Brad");
  });

  it("should render the prompt with default inputs", () => {
    const prompt = new Prompt(
      { ...MOCK_PROMPT, defaultInputs: { name: "Default" } },
      assertionRegistry
    );
    const output = prompt.render({});
    expect(output).toBe("Hi Default");
  });

  it("should assert all assertions when assertAll is called", () => {
    const prompt = new Prompt(MOCK_PROMPT, assertionRegistry);
    prompt.assertAll("Hi Brad");
    expect(assertionRegistry.runAll).toHaveBeenCalledWith(
      "Hi Brad",
      [],
      undefined
    );
  });

  it("should create a snapshot of the prompt", () => {
    const prompt = new Prompt(MOCK_PROMPT, assertionRegistry);

    const snapshot = prompt.snapshot({
      output: "Hi Brad",
      inputs: { name: "Brad" },
      similarity: { test: 0.9 },
      save: true,
    });

    expect(snapshot.id).toBe("test-id-snap");
    expect(snapshot.hash).toBe("abc123");
    expect(snapshot.promptId).toBe("test-id");
    expect(snapshot.promptHash).toBe("abc123");
    expect(snapshot.output).toBe("Hi Brad");
    expect(snapshot.inputs).toEqual({ name: "Brad" });
    expect(snapshot.assertions).toEqual([]);
    expect(snapshot.createdAt).toBeDefined();
    expect(snapshot.similarity).toEqual({ test: 0.9 });
    expect(snapshot.passed).toBe(true);
  });

  it("should save the snapshot if save is true", () => {
    const saveSnapshot = vi.fn();
    const prompt = new Prompt(MOCK_PROMPT, assertionRegistry, saveSnapshot);

    prompt.snapshot({
      output: "Hi Brad",
      inputs: { name: "Brad" },
      similarity: { test: 0.9 },
      save: true,
    });

    expect(saveSnapshot).toHaveBeenCalled();
  });
});
