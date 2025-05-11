import { describe, test, expect, beforeEach, afterEach, it } from "vitest";
import { AssertionRegistry, createRegistry } from "../assert";
import type { Assertion } from "../types";

const output = "Webhooks allow real-time HTTP communication between systems.";

const cases: {
  name: string;
  assertions: Assertion[];
  expected: boolean[];
}[] = [
  {
    name: "contains (pass)",
    assertions: [{ type: "contains", value: "real-time" }],
    expected: [true],
  },
  {
    name: "contains (fail)",
    assertions: [{ type: "contains", value: "WebSocket" }],
    expected: [false],
  },
  {
    name: "equals (pass)",
    assertions: [{ type: "equals", value: output }],
    expected: [true],
  },
  {
    name: "equals (fail)",
    assertions: [{ type: "equals", value: "something else" }],
    expected: [false],
  },
  {
    name: "matches (pass)",
    assertions: [{ type: "matches", value: "HTTP" }],
    expected: [true],
  },
  {
    name: "matches (fail)",
    assertions: [{ type: "matches", value: "WebSocket" }],
    expected: [false],
  },
  {
    name: "matches (invalid regex)",
    assertions: [{ type: "matches", value: "[[invalid" }],
    expected: [false],
  },
  {
    name: "semantic similarity (no context)",
    assertions: [{ type: "semantic-similarity", value: "event-driven" }],
    expected: [false],
  },
  {
    name: "unknown type",
    assertions: [{ type: "invalid" as any, value: "whatever" }],
    expected: [false],
  },
];

describe("assertions", () => {
  it("should create a registry", () => {
    const registry = createRegistry();

    expect(registry).toBeDefined();
    expect(registry.run).toBeDefined();
    expect(registry.runAll).toBeDefined();
    expect(registry.register).toBeDefined();
  });

  test("it should run all assertions when runAll is called", () => {
    const registry = createRegistry();

    const results = registry.runAll(output, cases[0].assertions);
    expect(results).toHaveLength(cases[0].expected.length);
    expect(results[0].passed).toBe(cases[0].expected[0]);
  });

  it("should run a single assertion when run is called", () => {
    const registry = createRegistry();

    const result = registry.run(
      cases[0].assertions[0].type,
      cases[0].assertions[0].value,
      output
    );
    expect(result).toBeDefined();
    expect(result.passed).toBe(cases[0].expected[0]);
  });

  it("it should register a new assertion", () => {
    const registry = createRegistry();

    const customAssertion = (value: string, output: string) => ({
      type: "custom",
      value,
      passed: output.includes(value),
      message: `Custom assertion passed`,
    });

    registry.register("custom", customAssertion);

    const result = registry.run("custom", "real-time", output);
    expect(result).toBeDefined();
    expect(result.passed).toBe(true);
  });
});
