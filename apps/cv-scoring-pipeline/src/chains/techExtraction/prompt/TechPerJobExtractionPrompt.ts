import { techList } from './tech_list.js';

export const techPerJobExtractionPrompt = `You're provided with a developer's job description. 
Your task is to analyze the developer's **work experience, project descriptions, and skills** to extract and classify **technologies list**.

## **Extract & Normalize Technologies**
✅ **Identify and classify ONLY explicitly and clearly mentioned technologies** (languages, frameworks, databases, cloud tools, etc.) throughout the job and role description.
✅ DO NOT infer or guess backend, frontend, or database technologies unless the tech name is CLEARLY stated by the engineer in the job description.
✅ DO NOT assume full-stack development or backend usage unless it is written in the description.
✅ If no technologies are explicitly stated by its official name, set "technologies": [].
✅ Extract technology details based on the following rules:
   - **"name"**: **Normalize the technology name against** TechList. If the extracted name has an alias (e.g., "AngularJS" → "Angular"), use the standardized name from **TechList**.

---

Example Output:
{{
  "technologies": ["Angular", "React"],
}}

**TechList Reference:** ${techList}`;
