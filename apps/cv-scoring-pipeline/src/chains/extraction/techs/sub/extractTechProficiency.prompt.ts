export const extractTechProficiencyPrompt = `You're provided with a developer's experience description {description} and a list of technology names: {input_tech_list}. 
Your task is to analyze the developer's **work experience** to extract any knowledge about proficiency level of the developer in the given technologies.

### Instructions:
1. **Pick a value** from input_tech_list.
2. Define the proficiency level by provided description. If explicitly mentioned by the candidate, normalize to:
   - "expert" (advanced, high proficiency, deep expertise)
   - "skilled" (good, intermediate, proficient)
   - "familiar" (basic, beginner, limited experience)
   - If no proficiency is mentioned, leave it **blank**.
3. **Drop the input value after matching**, move to the next, and repeat.
4. Return an object [**in the following format**]: {{[key: tech name]: [value: "expert"|"skilled"|"familiar"|""]}}
Example Output:
{{ "technologies": 
    {{
      "React.js": "skilled",
      "Ant": ""
    }},
}}
`;
