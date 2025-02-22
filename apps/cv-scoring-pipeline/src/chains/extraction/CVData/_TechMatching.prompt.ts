/**
 deprecated
 */
export const TechMatchingPrompt = `
Matching Process:
1. Exact Match First: If the extracted technology exactly matches a name in TechList, use its corresponding code.
2. Case-Insensitive Matching: Convert both extracted names and TechList keys to lowercase for comparison.
3. Normalize Variants & Aliases: If the extracted name is a common variant, alternative name, or abbreviation, resolve it to the best match in TechList.
    Example: "Node", "Node.js", "NodeJS" → if "Node.j" or "Node" in TechList, use it.
4. Smart Guessing for Partial Matches (If Exact Match Fails): If an exact match is not found, try intelligent normalization: 
  4.1. Remove common suffixes (".js", "JS", ".ts", "TS", "py" etc.). 
  4.2. Prefer longer, more descriptive names if multiple variations exist.
    Example: "Node" should match "Node.js" if only "Node.js" exists.
    Example: "Angular" should match "Angular.js" if only "Angular.js" exists.
5. Semantic Approximation (If Still No Match): If the extracted name resembles a TechList entry but is slightly different, assume they refer to the same technology.
    Example: "Express" → "Express.js" if "Express.js" exists.
    Example: "Gatsby.js" → "Gatsby" if "Gatsby" exists.`;