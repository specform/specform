---
model: "gpt-4"
temperature: 0.3
scenario: "Summarize a technical document"
tags: ["summarization", "test"]
---

## Description

This is a test `promptspec` for testing our parser. This description should be ignored and not returned in the final object.

Specs are used to define the structure of the prompt and the expected output. The parser will use this information to generate the prompt and validate the output. We have a few specific codefences that we use that are picked up by the parser and used to construct the CompiledPrompt object.

## Prompt

This is the actual test prompt. It should be a single codefence with the `prompt` tag. The parser will use this prompt to generate the final prompt for the model.

Interpulated inputs that need to be injected into the prompt at runtime use the mustache syntax, e.g. `{{variable}}`. In the SDK we'll expose a `renderPrompt` function on the CompiledPrompt object that will take the inputs as arguments and return the final prompt string.

```prompt
Please summarize the following article in a {{tone}} tone:

{{article}}
```

## Inputs

This is a list of inputs that will be injected into the prompt at runtime. The parser will use this information to generate the final prompt for the model. Default values can be provided for each variable, and the parser will use these values if no value is provided at runtime.

In the example below, we have a variable called `article` that is required, and a variable called `tone` that has a default value of "casual". The parser will use the default value if no value is provided at runtime.

```inputs
article = """Webhooks enable real-time communication..."""
tone = "casual"
```

## Assertions

This is a list of assertions that will be used to validate the output of the model. The SDK and CLI provide a method to validate the models output against these assertions. This allows to test for model drift and ensure that the model is producing the expected output.

```assertions
- contains: "real time"
- matches: /HTTP requests/i
- semantic-similarity: "event-driven communication"
```
