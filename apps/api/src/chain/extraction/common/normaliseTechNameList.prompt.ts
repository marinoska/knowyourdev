/**
 * Langchain input names to be provided:
 * input_tech_list: {input_tech_list}
 * reference_tech_list: {reference_tech_list}
 */
export const normaliseTechNameListPrompt = `

Your goal is to match each technology from **input_tech_list** to its closest equivalent in **reference_tech_list** using a **fuzzy matching approach** and return an **output_tech_list**.  
The match should be based on similarity, abbreviations, common variations, and typical naming conventions.  

### Matching Instructions:
1. **Pick a value** from input_tech_list.
2. **Find the closest match** in reference_tech_list:
   - If an **exact match** exists, add the pair {{original, normalized}} to output_tech_list.
   - If no exact match exists, find the **closest equivalent** based on:
     -- Common abbreviations (e.g., "JS" ≈ "JavaScript")
     -- Typical variations (e.g., "ReactJS" ≈ "React.js")
     -- Minor typos (e.g., "Nodejs" ≈ "Node.js")
     -- Case insensitivity (e.g., "react" ≈ "React.js")
     -- Formatting differences (e.g., "Elasticsearch" ≈ "Elastic Search")
   - If no exact match found, add add the pair {{original, normalized}} to output_tech_list
   - If there is **no sufficiently close match (below 80% similarity)**, **do not include the input value** in output_tech_list.
3. **Ensure the output list only contains values from reference_tech_list**.
4. **Drop the input value after matching**, move to the next, and repeat.

### Example:

#### Input:
  - **input_tech_list:** "Node.js, React, MongoDB"
  - **reference_tech_list:** ["PHP", "Symfony", "JavaScript", "React.js", "Ansible", "Jenkins", "Node"]

#### Matching Process:
  - "Node.js" (input) → **"Node"** (reference)
  - "React" (input) → **"React.js"** (reference)
  - "Ant" (input) → **No match, excluded**

#### Output:
{{
    "technologies": [
    {{
        original: "Node.js",
        normalized: "Node",
    }}, 
    {{
        original: "ReactJS",
        normalized: "React.js",
    }},
    {{
        original: "Ant",
        normalized: "",
    }}
    ]
}}

Ensure that the output list **contains an entry for each of the input technologies**, with empty "normalized" field if they do not have a valid match.
`;
