import { describe, it, expect } from "vitest";
import { cosineSimilarity } from "../similarity";

export function createMockSimilarity(scores: Record<string, number>) {
  return {
    similarity: scores,
  };
}

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    const a = [1, 2, 3];
    const b = [1, 2, 3];
    expect(cosineSimilarity(a, b)).toBeCloseTo(1);
  });

  it("returns 0 for orthogonal vectors", () => {
    const a = [1, 0];
    const b = [0, 1];
    expect(cosineSimilarity(a, b)).toBeCloseTo(0);
  });

  it("returns -1 for opposite vectors", () => {
    const a = [1, 2];
    const b = [-1, -2];
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1);
  });

  it("throws for unequal lengths", () => {
    expect(() => cosineSimilarity([1, 2], [1])).toThrow();
  });
});
