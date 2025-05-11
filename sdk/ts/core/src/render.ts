import { CompiledPrompt } from "./types";
import Mustache from "mustache";

export type RenderOptions = {
  strict?: boolean;
};

/**
 * Renders a compiled prompt with the given inputs.
 *
 * @param prompt - The compiled prompt.
 * @param inputs - The inputs to render the prompt with.
 * @param options - Options for rendering.
 * @param options.strict - If true, will throw an error if any required inputs are missing.
 *
 * @returns The rendered prompt.
 */
export function renderCompiledPrompt<TInputs extends Record<string, unknown>>(
  prompt: CompiledPrompt<TInputs>,
  inputs: Partial<TInputs>,
  options: RenderOptions = {}
): string {
  const mergedInputs = {
    ...(prompt.defaultInputs || {}),
    ...inputs,
  } as Record<string, unknown>;

  if (options.strict) {
    const missing = prompt.inputs.filter(
      (key) => mergedInputs[key as string] === undefined
    );

    if (missing.length > 0) {
      throw new Error(`Missing required inputs: ${missing.join(", ")}`);
    }
  }

  return Mustache.render(prompt.compiledPrompt, mergedInputs);
}
