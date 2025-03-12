//  function that replaces single { with {{ and single } with }}
function replaceBraces(str: string) {
    return str.replace(/(?<!{){(?!{)/g, '{{').replace(/(?<!})}(?!})/g, '}}');
}

export const jsonOutputPrompt = (schema: Record<string, any>) => `
### Output format rules:
1. Your response must strictly conform to the format of a JSON object.
2. Do NOT include any Markdown or codeblock formatting (e.g., \`\`\`
json
or \`\`\`).
3. Ensure all field names and structures match the given schema exactly.

Output must adhere to the following schema:
${replaceBraces(JSON.stringify(schema))}
`;