export const jsonOutputPrompt = (schema: Record<string, any>) => `
### Rules:
1. Your response must strictly conform to the format of a JSON object.
2. Do NOT include any Markdown or codeblock formatting (e.g., \`\`\`
json
or \`\`\`).
3. Ensure all field names and structures match the given schema exactly.

Output must adhere to the following schema:
{${JSON.stringify(schema)}}
`;