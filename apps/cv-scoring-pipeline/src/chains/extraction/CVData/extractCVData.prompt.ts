import { normaliseTechNamePrompt } from "./normaliseTechName.prompt.js";

/**
 * Langchain params
 * {cv_text}
 */
export const ExtractCVDataPrompt = `You're provided with a developer's CV. Your task is to analyze the developer's **work experience, project descriptions, and skills list** to extract and classify **technologies and experience details**.

TODAY is ${Date()}

## **Step 1: Extract & Normalize Technologies**
✅ **Identify and classify only explicitly mentioned technologies** (languages, frameworks, databases, cloud tools, etc.) throughout the whole CV.
✅ **Examine all general CV sections** - skills, profile, general description etc. 
✅ Extract technology details based on the following rules:
   - "originalName": The exact technology name as written in the CV.
   - "name": The corresponding tech name from TechList. Leave blank if not in the list. 
        - ${normaliseTechNamePrompt}
        - If no match is found, leave the name blank.
   - "proficiency": If explicitly mentioned by the candidate, normalize to:
       - "expert" (advanced, high proficiency, deep expertise)
       - "skilled" (good, intermediate, proficient)
       - "familiar" (basic, beginner, limited experience)
       - If no proficiency is mentioned, leave it **blank**.
   - "skill": If the tech is explicitly listed in the skills section, mark as **true**, otherwise **false**.
✅ **Examine all job descriptions** and extract technology details based on the following rules:
   - "originalName": The exact technology name as written in the CV.
   - "name": The corresponding tech name from TechList. Leave blank if not in the list. 
        - ${normaliseTechNamePrompt}
        - If no match is found, leave the name blank.
   - "proficiency": If explicitly mentioned by the candidate, normalize to:
       - "expert" (advanced, high proficiency, deep expertise)
       - "skilled" (good, intermediate, proficient)
       - "familiar" (basic, beginner, limited experience)
       - If no proficiency is mentioned, leave it **blank**.
   - "skill": If the tech is explicitly listed in the skills section, mark as **true**, otherwise **false**.
 

## **Step 2: Extract Jobs**
✅ **Extract the developer’s jobs/roles with descriptions**
✅ Extract experience details based on the following rules:
   - "role": The candidate's role/title in the job/project.
   - "job": The company/project name as listed in the CV.
   - "start": The start date of the job/project in **mm-yyyy** format.
   - "end": The end date of the job/project in **mm-yyyy** format. If not specified then TODAY
   - "months": Number of month which is calculated by (end - start)
   - "present": If it's a current job, mark as **true**, otherwise **false**.
   - "description": Full **unchanged** job description

## **Step 3: Extract additional Info**
✅ Extract the developer’s data
   - "fullName": The candidate's name and surname.

---

Example Output:
{{
  "fullName": "Joe Doe",
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
  ],
}}

**TechList Reference:** 
{tech_list}

CV:
{cv_text}`;
