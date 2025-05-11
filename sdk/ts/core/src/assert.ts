import { Assertion, AssertionContext, AssertionResult } from "./types";

export type AssertionReturn<T extends Assertion["type"]> = {
  type: T;
  value: string;
  passed: boolean;
  message: string;
};

export type AssertionFn = (
  val: string,
  o: string,
  context?: AssertionContext
) => AssertionReturn<Assertion["type"]>;

type RegistryMap = Map<string, AssertionFn>;

/**
 * This class is used by the client instance to register and run assertions on the model output.
 *
 */
export class AssertionRegistry {
  private registry: RegistryMap = new Map();

  /**
   * Method to register a new assertion.
   *
   * @param name - the name of the assertion type
   * @param fn - the assertion function
   *
   * @throws Error if the assertion type is already registered
   */
  register(name: string, fn: AssertionFn) {
    if (this.registry.has(name)) {
      throw new Error(`Assertion ${name} already registered`);
    }

    this.registry.set(name, fn);
  }

  /**
   * Method retrieves an assertion function by name.
   *
   * @param name - the name of the assertion type
   *
   * @returns The assertion function
   * @throws Error if the assertion type is not registered
   */
  get(name: string) {
    if (!this.registry.has(name)) {
      throw new Error(`Assertion ${name} not found`);
    }

    return this.registry.get(name);
  }

  /**
   * Method to check if an assertion type is registered.
   *
   * @param name - the name of the assertion type
   *
   * @returns true if the assertion type is registered, false otherwise
   */
  has(name: string) {
    return this.registry.has(name);
  }

  /**
   * Method to run an assertion function by name.
   *
   * @param name - the name of the assertion type
   * @param value - the expected assertion value. This is defined in the compiled prompt.
   * @param output - the actual output from the model
   * @param context - optional context for the assertion function
   *
   * @returns The result of the assertion function
   */
  run(name: string, value: string, output: string, context?: AssertionContext) {
    if (!this.has(name)) {
      throw new Error(`Assertion ${name} not found`);
    }

    const fn = this.get(name);

    if (!fn) {
      throw new Error(`Assertion ${name} not found`);
    }

    return fn(value, output, context);
  }

  /**
   * Method to run all assertions on the output.
   *
   * @param output - the actual output from the model
   * @param assertions - the list of assertions to run
   * @param context - optional context for the assertion function
   *
   * @returns An array of assertion results
   */
  runAll(output: string, assertions: Assertion[], context?: AssertionContext) {
    return assertions.map((a) => {
      const fn = this.get(a.type);
      if (!fn) {
        throw new Error(`Assertion ${a.type} not found`);
      }
      return fn(a.value, output, context);
    });
  }
}

/**
 * Factory function to create a new assertion registry. This is used by the client
 * initialize the regisry and register default assertions.
 *
 * @returns The assertion registry instance
 */
export function createRegistry() {
  const registry = new AssertionRegistry();

  // @todo -
  // Default assertions
  registry.register("contains", (value, output) => {
    const passed = output.includes(value);
    return {
      type: "contains",
      value,
      passed,
      message: passed
        ? `✔ Output contains '${value}'`
        : `✘ Output missing '${value}'`,
    };
  });

  registry.register("equals", (value, output) => {
    const passed = output.trim() === value.trim();
    return {
      type: "equals",
      value,
      passed,
      message: passed
        ? `✔ Output exactly matches expected value`
        : `✘ Output does not match expected value`,
    };
  });

  registry.register("matches", (value, output) => {
    try {
      const regex = new RegExp(value);
      const passed = regex.test(output);

      return {
        type: "matches",
        value,
        passed,
        message: passed
          ? `✔ Output matches regex /${value}/`
          : `✘ Output does not match regex /${value}/`,
      };
    } catch (err) {
      return {
        type: "matches",
        value,
        passed: false,
        message: `✘ Invalid regex: ${value}`,
      };
    }
  });

  registry.register("semantic-similarity", (value, _, context) => ({
    type: "semantic-similarity",
    value,
    passed: typeof context?.similarity?.[value] === "number",
    message: context?.similarity?.[value]
      ? `✔ Semantic similarity passed (${context.similarity[value]})`
      : `✘ Semantic similarity not provided for '${value}'`,
  }));

  return registry;
}
