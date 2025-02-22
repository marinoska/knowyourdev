/**
 * Langchain input names to be provided:
 * input_tech_list: {input_tech_list}
 * reference_tech_list: {reference_tech_list}
 */
export const normaliseTechNameListPrompt = `

You are given:

An input list of technologies: input_tech_list
A reference list of technologies: reference_tech_list
Your goal is to match each technology from input_tech_list to its closest equivalent in reference_tech_list using a fuzzy matching approach and return an output_tech_list. 
The match should be based on similarity, abbreviations, common variations, and typical naming conventions.

Instructions, for each value in input_tech_list:
If an exact match exists in TechList, add it in output_tech_list.
If no exact match exists, add in output_tech_list the closest match based on fuzzy similarity, common abbreviations, or typical variations.
Ignore differences like:
Case sensitivity (React.js == react.js == React)
Dots in names (React.js == React)
Minor typos (Node.js ≈ Node)
Spacing and dashes (Elasticsearch == Elastic Search, Node.js == Node)
If there is no sufficiently close match (below 80% similarity), do not add a value in output_tech_list.

Example Inputs & Outputs:
  input_tech_list: "Node.js, React, MongoDB",
  tech_reference_list: 
    "PHP, Symfony, JavaScript, React.js, Ansible, Ant, Jenkins, Node"
  
  Matching process: Node.js (input) => Node (reference), React (input) => React.js (reference), MongoDB (input) => "" (not found)
  output_tech_list:
  {{
  "technologies": [Node, React.js]
  }}
`;