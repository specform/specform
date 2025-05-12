import {
  createPromptClient,
  PromptLoader,
  SnapshotLoader,
} from "@promptspec/core";
import type { CompiledPrompt, Snapshot } from "@promptspec/core";

interface FetchOptions {
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export function fetchPromptLoader<TInputs extends Record<string, unknown>>(
  baseUrl: string,
  options?: FetchOptions
): PromptLoader<TInputs> {
  return async (id: string) => {
    const url = `${baseUrl}/${id}.json`;
    const res = await fetch(url, {
      signal: options?.signal,
      headers: options?.headers,
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(
        `Failed to fetch prompt '${id}': ${res.status} ${res.statusText}\n${err}`
      );
    }

    return (await res.json()) as CompiledPrompt<TInputs>;
  };
}

export function fetchSnapshotLoader<TInputs extends Record<string, unknown>>(
  baseUrl: string,
  options?: FetchOptions
): SnapshotLoader<TInputs> {
  return async (id: string) => {
    const url = `${baseUrl}/${id}.json`;
    const res = await fetch(url, {
      signal: options?.signal,
      headers: options?.headers,
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(
        `Failed to fetch snapshot '${id}': ${res.status} ${res.statusText}\n${err}`
      );
    }

    return (await res.json()) as Snapshot<TInputs>;
  };
}

export function createWebClient(baseUrl: string) {
  return createPromptClient({
    loadPrompt: fetchPromptLoader(baseUrl),
    loadSnapshot: fetchSnapshotLoader(baseUrl),
  });
}
