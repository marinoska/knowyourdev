export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    // Attempt to parse the JSON string
    return JSON.parse(jsonString) as T;
  } catch (error) {
    // Log the error for debugging
    // @ts-ignore
    console.error("Failed to parse JSON:", error.message);
    return null;
  }
}

export function parseJsonOutput<T extends { content: string }, R extends {}>(
  output: T,
): R {
  if (!output.content) {
    throw new Error("Parsing failed. Empty content in the output");
  }

  if (typeof output.content !== "string") {
    throw new Error(
      "Parsing failed. Result is expected to be stringified json.",
    );
  }

  const result = safeJsonParse<R>(output.content);
  if (!result) {
    throw new Error(
      "Parsing failed. Result is expected to be stringified json.",
    );
  }

  return result;
}
