/**
 * Langchain params
 * {cv_text}
 */
export const techExtractionPrompt = `You're provided with a developer's CV. Your task is to analyze the developer's **work experience, project descriptions, and skills list** to extract and classify **technologies and experience details**.

TODAY is ${Date()}

## **Step 1: Extract & Normalize Technologies**
✅ **Identify and classify only explicitly mentioned technologies** (languages, frameworks, databases, cloud tools, etc.) throughout the whole CV.
✅ **Examine all CV sections and pages** - skills, profile, general description, job descriptions etc. 
✅ Extract technology details based on the following rules:
   - **"originalName"**: The exact technology name as written in the CV.
   - **"name"**: The corresponding name from TechList. 
       - Matching Process:
       --Exact Match First: If the extracted technology exactly matches a name in TechList, use its corresponding code.
       --Case-Insensitive Matching: Convert both extracted names and TechList keys to lowercase for comparison.
       - Normalize Variants & Aliases: If the extracted name is a common variant, alternative name, or abbreviation, resolve it to the best match in TechList.
            Example: "Node", "Node.js", "NodeJS" → if "Node.j" or "Node" in TechList, use it.
        - Smart Guessing for Partial Matches (If Exact Match Fails): If an exact match is not found, try intelligent normalization: 
          1. Remove common suffixes (".js", "JS", ".ts", "TS", "py" etc.). 
          2. Prefer longer, more descriptive names if multiple variations exist.
            Example: "Node" should match "Node.js" if only "Node.js" exists.
            Example: "Angular" should match "Angular.js" if only "Angular.js" exists.
        - Semantic Approximation (If Still No Match): If the extracted name resembles a TechList entry but is slightly different, assume they refer to the same technology.
            Example: "Express" → "Express.js" if "Express.js" exists.
            Example: "Gatsby.js" → "Gatsby" if "Gatsby" exists.
        - If no match is found, leave the code blank.
   - **"proficiency"**: If explicitly mentioned by the candidate, normalize to:
       - **"expert"** (advanced, high proficiency, deep expertise)
       - **"skilled"** (good, intermediate, proficient)
       - **"familiar"** (basic, beginner, limited experience)
       - If no proficiency is mentioned, leave it **blank**.
   - **"skill"**: If the tech is explicitly listed in the skills section, mark as **true**, otherwise **false**.
   - **"inTechList"**: **true** if the extracted technology exists in TechList, otherwise **false** (discard any technology not in the list).

---

## **Step 2: Extract Jobs**
✅ **Extract the developer’s jobs/roles with descriptions**
✅ Extract experience details based on the following rules:
   - **"role"**: The candidate's role/title in the job/project.
   - **"job"**: The job/project name as listed in the CV.
   - **"start"**: The start date of the job/project in **mm-yyyy** format.
   - **"end"**: The end date of the job/project in **mm-yyyy** format. If not specified then TODAY
   - **"months"** Number of month which is calculated by (end - start)
   - **"present"** If it's a current job, mark as **true**, otherwise **false**.
   - **"description"** Full **unchanged** job description

---

Example Output:
{{
  "technologies": [
    {{"originalName": "TypeScript", 
    "name": "TypeScript",
    "proficiency": "skilled", 
    "skill": true, 
    "inTechList": true, 
   }}
  ],
  "jobs": [
    {{"role": "Full Stack Engineer", "job": "Company Name", "start": "01-01-2022", "end": "01-01-2023", "months": 12, "description": "Job description here"}}
  ]
}}

**TechList Reference:** 
{tech_list}

CV:
{cv_text}`;
