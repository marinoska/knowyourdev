export const suggestTechnologiesPrompt = `You are provided with a job title and job description from a company that is hiring a developer.  
You're also given a reference list of modern technology stacks.

Your goal is to:
1. Analyze the **job title and description** to understand the role's technical focus.
2. Match the role to the **most appropriate stack** from the reference list based on responsibilities, use cases, and purpose.
3. Return a list of **technologies (stack components)** based on the matched stack.

## Matching Rules:
✅ Consider responsibilities like building APIs, web apps, mobile apps, or infrastructure when selecting a stack.  
✅ Use the **Trend** and **Popularity** values to prefer modern, widely adopted stacks when multiple stacks match the role.  
✅ You may select 1 matching stack. DO NOT merge components from different stacks.  
✅ DO NOT invent new technologies. Only choose from stack components listed in the reference.  
✅ Output 5–10 technologies that a candidate would need to succeed in this role.

---

## INPUT:
- jobTitle: {title}
- jobDescription: {description}

## Stack Reference:
{jsonStackList}

---

## Output Format:
{{
  "technologies": ["Tech1", "Tech2", "Tech3", ...],
  "matchedStack": "Name of the matched stack",
  "reasoning": "Explain why this stack was selected based on the job description, including how trend and popularity factored into the choice."
}}
`;
