import {
  CompiledPrompt,
  AssertionContext,
  AssertionResult,
  Assertion,
  Snapshot,
} from "./types";
import { renderCompiledPrompt } from "./render";
import { AssertionRegistry } from "./assert";

/**
 * Class represents a compiled prompt object. This object is used to:
 * - Render the prompt with given inputs
 * - Assert the model output against the prompt's assertions
 * - Create a snapshot of the prompt with the model's output
 */
export class Prompt<TInputs extends Record<string, unknown>> {
  constructor(
    private compiledPrompt: CompiledPrompt<TInputs>,
    private assertionRegistry: AssertionRegistry,
    // Optional function to save the snapshot
    private saveSnapshot?: (snapshot: Snapshot<TInputs>) => void
  ) {}

  /**
   * Method renders the compiled prompt with given inputs.
   *
   * @param inputs - The inputs to render the prompt with.
   * @param strict - If true, will throw an error if any required inputs are missing.
   *
   * @returns The rendered prompt.
   */
  render(inputs: Partial<TInputs>, strict = false): string {
    return renderCompiledPrompt(this.compiledPrompt, inputs, { strict });
  }

  /**
   * Method to assert the output of the prompt against all assertions defined in the prompt.
   *
   * @param output - The model output to assert.
   * @param context - Optional context for assertions.
   *
   * @returns An array of assertion results.
   */
  assertAll(output: string, context?: AssertionContext): AssertionResult[] {
    return this.assertionRegistry.runAll(
      output,
      this.compiledPrompt.assertions ?? [],
      context
    );
  }

  /**
   * Method to assert the output of the prompt against a specific assertion.
   *
   * @param name - The name of the assertion to run.
   * @param output - The model output to assert.
   * @param context - Optional context for assertions.
   *
   * @returns The result of the assertion.
   */
  assert(
    name: string,
    output: string,
    context?: AssertionContext
  ): AssertionResult {
    return this.assertionRegistry.run(
      name,
      this.compiledPrompt.assertions?.find((a) => a.type === name)?.value ?? "",
      output,
      context
    );
  }

  /**
   * Creates a snapshot based on the current prompt and the model's output.
   *
   * @param params
   * @param params.output - The model output to use for the snapshot.
   * @param params.inputs - The inputs to use for the snapshot.
   * @param params.similarity - The similarity scores to use for the snapshot.
   *
   * @returns A snapshot object containing the prompt ID, output, inputs, assertions, and similarity scores.
   */
  snapshot(params: {
    output: string;
    inputs?: TInputs;
    similarity?: Record<string, number>;
    save?: boolean;
  }) {
    const results = this.assertAll(params.output);
    const passed = results.every((r) => r.passed);

    const snapshot: Snapshot<TInputs> = {
      id: `${this.compiledPrompt.id}-snap`,
      hash: this.compiledPrompt.hash,
      promptId: this.compiledPrompt.id,
      promptHash: this.compiledPrompt.hash,
      output: params.output,
      inputs: params.inputs ?? this.defaults,
      assertions: results,
      createdAt: new Date().toISOString(),
      similarity: params.similarity,
      passed,
    };

    // Save if a save function is provided
    // and the save flag is set to true
    if (this.saveSnapshot && params.save) {
      this.saveSnapshot(snapshot);
    }

    return snapshot;
  }

  /**
   * @returns The prompt's input names
   */
  get inputs() {
    return this.compiledPrompt.inputs;
  }

  /**
   * @returns The default inputs of the compiled prompt.
   */
  get defaults() {
    if (!this.compiledPrompt.defaultInputs) {
      return {} as TInputs;
    }

    return this.compiledPrompt.defaultInputs as TInputs;
  }

  /**
   * @returns The compiled prompt metadata (id, hash, tags, model, temperature, createdAt, updatedAt).
   */
  get meta() {
    const {
      id,
      hash,
      tags,
      model,
      temperature,
      createdAt,
      updatedAt,
      ...rest
    } = this.compiledPrompt;
    return {
      id,
      hash,
      tags,
      model,
      temperature,
      createdAt,
      updatedAt,
      custom: rest,
    };
  }
}
