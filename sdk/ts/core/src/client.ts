import { CompiledPrompt, Snapshot } from "./types";
import { Prompt } from "./prompt";
import { AssertionFn, createRegistry } from "./assert";

/**
 * Type defines a prompt loader function. This function is used by the PromptClient to load
 * prompts by ID either from the local file system or from a remote server. If you are creating a
 * custom prompt client, you will need to implement this function.
 */
export type PromptLoader<
  TInputs extends Record<string, unknown> = Record<string, unknown>
> = (id: string) => Promise<CompiledPrompt<TInputs>>;

/**
 * Type defines a snapshot loader function. This function is used by the PromptClient to load
 * snapshots by ID either from the local file system or from a remote server. If you are creating a
 * custom prompt client, you will need to implement this function.
 */
export type SnapshotLoader<
  TInputs extends Record<string, unknown> = Record<string, unknown>
> = (id: string) => Promise<Snapshot<TInputs>>;

/**
 * Type defines a function that saves a snapshot. This function is used by the PromptClient to
 * save snapshots either to the local file system or to a remote server. If you are creating a
 * custom prompt client, you will need to implement this function.
 */
export type SaveSnapshot<
  TInputs extends Record<string, unknown> = Record<string, unknown>
> = (snapshot: Snapshot<TInputs>) => Promise<Snapshot<TInputs>>;

/**
 *  The PromptClient defines the SDK's main entry point. Use this interface to
 * define a custom client for interfacing with Specform prompts and snapshots.
 */
export type PromptClient<
  TInputs extends Record<string, unknown> = Record<string, unknown>
> = {
  /**
   * Method to load a prompt by ID. returns a Prompt instance.
   *
   * @param id - The id of the prompt to load
   * @param skipCache - If true, will not use the cache
   *
   * @returns A Promise that resolves the Prompt instance
   */
  usePrompt: (id: string, skipCache?: boolean) => Promise<Prompt<TInputs>>;

  /**
   * Method to load a snapshot by ID. returns a Prompt instance and a Snapshot instance.
   *
   * @param id - The id of the snapshot to load
   * @param skipCache - If true, will not use the cache
   *
   * @returns A Promise that resolves both aPrompt and a Snapshot instance
   */
  fromSnapshot: (
    id: string,
    skipCache?: boolean
  ) => Promise<{ prompt: Prompt<TInputs>; snapshot: Snapshot<TInputs> }>;

  /**
   * Method to register a new assertion type and function by name.
   * Useful for adding custom assertions to prompts
   *
   * @param name - The name of the assertion function
   * @param fn - The assertion function
   */
  registerAssertion: (name: string, fn: AssertionFn) => void;

  /**
   * Method clears the prompt and snapshot caches.
   */
  clearCaches: () => void;
};

/**
 *
 * Factory function to create a new prompt client.
 *
 * @param loadPrompt - Function directs the client where to load prompts
 * @param loadSnapshot - Function directs the client where to load prompt snapshots
 * @param SaveSnapshot - Optional function directs the snapshot can be saved
 * @param options - Options for the client
 * @param options.noCache - If true, will not cache prompts
 *
 * @returns A new PromptClient instance
 */
export function createPromptClient<TInputs extends Record<string, unknown>>({
  loadPrompt,
  loadSnapshot,
  saveSnapshot,
  options = {
    noCache: false,
  },
}: {
  loadPrompt: PromptLoader<TInputs>;
  loadSnapshot: SnapshotLoader<TInputs>;
  saveSnapshot?: SaveSnapshot<TInputs>;
  options?: {
    noCache?: boolean; // if true, will not cache prompts
  };
}): PromptClient<TInputs> {
  const assertionRegistry = createRegistry();

  // @todo - refactor these to use an LRU cache once we have a better idea of sizing
  // and eviction policy
  const promptCache = options.noCache
    ? null
    : new Map<string, Prompt<TInputs>>();

  const snapshotCache = options.noCache
    ? null
    : new Map<string, Snapshot<TInputs>>();

  // Helper function to load a prompt and cache it
  async function cachedPromptLoader(id: string, skipCache = false) {
    if (!loadPrompt) {
      throw new Error("loadPrompt is not configured");
    }

    if (promptCache && promptCache.has(id) && !skipCache) {
      const hit = promptCache.get(id);

      if (!hit) throw new Error(`Prompt with id ${id} not found`);

      return hit;
    }

    const compiledPrompt = await loadPrompt(id);

    if (!compiledPrompt) {
      throw new Error(`Prompt with id ${id} not found`);
    }

    const prompt = new Prompt<TInputs>(
      compiledPrompt,
      assertionRegistry,
      saveSnapshot
    );
    if (promptCache) promptCache.set(id, prompt);

    return prompt;
  }

  // Helper function to load a snapshot and cache it
  async function cachedSnapshotLoader(id: string, skipCache = false) {
    if (!loadSnapshot) {
      throw new Error("loadSnapshot is not configured");
    }

    const compiledPrompt = await cachedPromptLoader(id);

    if (!compiledPrompt) {
      throw new Error(`Prompt with id ${id} not found`);
    }

    if (snapshotCache && snapshotCache.has(id) && !skipCache) {
      const hit = snapshotCache.get(id);

      if (!hit) throw new Error(`Snapshot with id ${id} not found`);

      return {
        prompt: compiledPrompt,
        snapshot: hit,
      };
    }

    const snapshot = await loadSnapshot(id);
    return {
      prompt: compiledPrompt,
      snapshot,
    };
  }

  function clearCaches() {
    if (promptCache) promptCache.clear();
    if (snapshotCache) snapshotCache.clear();
  }

  // Returning a POJO with the client methods instead of a class instance. Given the surface area
  // of the client, this should be sufficient. This also allows for easier testing and mocking. We can
  // always refactor to a class if needed in the future.
  return {
    usePrompt: async (id: string, skipCache = false) => {
      const prompt = await cachedPromptLoader(id, skipCache);
      return prompt;
    },

    fromSnapshot: async (id: string, skipCache = false) => {
      const { prompt, snapshot } = await cachedSnapshotLoader(id, skipCache);

      if (!snapshot) {
        throw new Error(`Snapshot with id ${id} not found`);
      }

      return { prompt, snapshot };
    },

    registerAssertion: (name: string, fn: AssertionFn) => {
      assertionRegistry.register(name, fn);
    },

    clearCaches: () => clearCaches(),
  };
}
