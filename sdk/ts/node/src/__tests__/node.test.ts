import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs/promises";
import path from "path";
import { nodePromptLoader, nodeSnapshotLoader, client } from "../node";

const fixtureDir = path.resolve(__dirname, "../../.specform");
const fixturePromptPath = path.join(fixtureDir, "sample.spec.json");
const fixtureSnapshotPath = path.join(fixtureDir, "sample.snap.json");

const fixturePrompt = {
  id: "sample",
  hash: "hash123",
  scenario: "Sample Scenario",
  compiledPrompt: "Hi {{name}}",
  inputs: ["name"],
  defaultInputs: { name: "Brad" },
};

const fixtureSnapshot = {
  id: "sample-snap",
  hash: "hash123",
  promptId: "sample",
  promptHash: "hash123",
  output: "Hi Brad",
  inputs: { name: "Brad" },
  assertions: [],
  createdAt: new Date().toISOString(),
};

describe("Node loader (test-local)", () => {
  beforeAll(async () => {
    await fs.mkdir(fixtureDir, { recursive: true });
    await fs.writeFile(fixturePromptPath, JSON.stringify(fixturePrompt));
    await fs.writeFile(fixtureSnapshotPath, JSON.stringify(fixtureSnapshot));
  });

  afterAll(async () => {
    await fs.rm(fixtureDir, { recursive: true, force: true });
  });

  it("loads a compiled prompt from disk", async () => {
    const prompt = await nodePromptLoader("sample");
    expect(prompt.id).toBe("sample");
    expect(prompt.defaultInputs?.name).toBe("Brad");
  });

  it("loads a snapshot from disk", async () => {
    const snap = await nodeSnapshotLoader("sample");
    expect(snap.output).toBe("Hi Brad");
    expect(snap.inputs.name).toBe("Brad");
  });

  it("returns a usable Prompt instance", async () => {
    const prompt = await client.usePrompt("sample");
    expect(prompt.render({})).toBe("Hi Brad");
  });

  it("loads snapshot and prompt together", async () => {
    const result = await client.fromSnapshot("sample");
    expect(result?.snapshot.output).toBe("Hi Brad");
    expect(result?.prompt.render({ name: "Brad" })).toBe("Hi Brad");
  });
});
