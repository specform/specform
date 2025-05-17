import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  createPromptClient,
  PromptLoader,
  SnapshotLoader,
} from "@specform/core";
import type { CompiledPrompt, Snapshot } from "@specform/core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function safeReadJson<T>(filePath: string) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.warn(`[specform:node] File not found: ${filePath}`);
    } else {
      console.error(`[specform:node] Failed to read JSON: ${filePath}`, err);
    }
    throw err;
  }
}

export const nodePromptLoader: PromptLoader = async (id) => {
  const filePath = path.join(rootDir, ".specform", `${id}.spec.json`);
  return safeReadJson<CompiledPrompt>(filePath);
};

export const nodeSnapshotLoader: SnapshotLoader = async (id) => {
  const filePath = path.join(rootDir, ".specform", `${id}.snap.json`);
  return safeReadJson<Snapshot>(filePath);
};

export const client = createPromptClient({
  loadPrompt: nodePromptLoader,
  loadSnapshot: nodeSnapshotLoader,
});
