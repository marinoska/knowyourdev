/**
 * Langchain input names to be provided:
 * input_tech_list: {input_tech_list}
 * reference_tech_list: {reference_tech_list}
 */
export const normaliseTechNamePrompt = `

You are given:

An input technology: IT
A reference list of technologies: TechList
Your goal is to match given technology to its closest equivalent in TechList using a fuzzy matching approach and return its name. 
The match should be based on similarity, abbreviations, common variations, and typical naming conventions.

Instructions:
If an exact match exists in TechList, return it.
If no exact match exists, return the closest match based on fuzzy similarity, common abbreviations, or typical variations.
Ignore differences like:
Case sensitivity (React.js == react.js == React)
Dots in names (React.js == React)
Minor typos (Node.js ≈ Node)
Spacing and dashes (Elasticsearch == Elastic Search, Node.js == Node)
If there is no sufficiently close match (below 80% similarity), do not return a value.

Example Inputs & Outputs:
  input: React,
  tech_list: 
    "PHP, Symfony, JavaScript, React.js, Node, Ansible, Ant, Jenkins, Node"
  Matching process: React (input) => React.js (output name)
`;