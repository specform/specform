export type Assertion = {
  type: string;
  value: string;
};

export type CompiledPrompt<
  TInputs extends Record<string, unknown> = Record<string, unknown>
> = {
  id: string;
  hash: string;
  scenario: string;
  compiledPrompt: string;
  inputs: (keyof TInputs)[];
  defaultInputs?: Partial<TInputs>;
  assertions?: Assertion[];
  snapshot?: string;
  tags?: string[];
  model?: string;
  temperature?: number;
  createdAt?: string;
  updatedAt?: string;
  sourcePath?: string;
};

export type AssertionContext = {
  similarity?: Record<string, number>; // Optional similarity scores by key
};

export type AssertionResult = {
  type: Assertion["type"];
  value: string;
  passed: boolean;
  message: string;
};

export type Snapshot<
  TInputs extends Record<string, unknown> = Record<string, unknown>
> = {
  id: string;
  hash: string;
  promptId: string;
  promptHash: string;
  output: string;
  inputs: TInputs;
  assertions: AssertionResult[];
  similarity?: Record<string, number>;
  createdAt: string;
  passed: boolean;
};
