/**
 * Function to calculate the cosine similarity between two vectors.
 * See: https://en.wikipedia.org/wiki/Cosine_similarity
 *
 * @param a - The first vector
 * @param b - The second vector
 *
 * @returns The cosine similarity between the two vectors
 * @throws Error if the vectors are not the same length
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must be the same length");
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] ** 2;
    magB += b[i] ** 2;
  }

  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}
