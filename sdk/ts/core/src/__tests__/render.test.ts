import { describe, it, expect } from "vitest";
import { renderCompiledPrompt } from "../render";
import type { CompiledPrompt } from "../types";

const mockScenario: CompiledPrompt<{ name: string }> = {
  id: "greet-user",
  hash: "abc123",
  scenario: "Greet a user by name",
  compiledPrompt: "Hello, {{name}}!",
  inputs: ["name"],
  defaultInputs: {},
  assertions: [
    { type: "contains", value: "Hello" },
    { type: "matches", value: "name" },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("renderCompiledPrompt", () => {
  it("renders prompt with inputs", () => {
    const result = renderCompiledPrompt(mockScenario, { name: "Alice" });
    expect(result).toBe("Hello, Alice!");
  });

  it("throws in strict mode if input missing", () => {
    expect(() => {
      renderCompiledPrompt(mockScenario, {}, { strict: true });
    }).toThrow("Missing required inputs: name");
  });

  it("does not throw in non-strict mode if input missing", () => {
    const result = renderCompiledPrompt(mockScenario, {});
    expect(result).toBe("Hello, !");
  });
});
