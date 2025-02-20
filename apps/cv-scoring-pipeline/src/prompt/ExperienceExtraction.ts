import { techList } from './tech_list';

export const sp2p1 = `You're provided with a developer's CV. Your task is to analyze the developer's **work experience, project descriptions, and skills list** to extract and classify **technologies and experience details**.

TODAY is ${Date()}

## **Step 1: Extract & Normalize Technologies (T1)**
✅ **Identify and classify only explicitly mentioned technologies** (languages, frameworks, databases, cloud tools, etc.).
✅ Extract technology details based on the following rules:
   - **"originalName"**: The exact technology name as written in the CV.
   - **"name"**: **Normalize the technology name against** TechList. If the extracted name has an alias (e.g., "AngularJS" → "Angular"), use the standardized name from **TechList**.
   - **"proficiency"**: If explicitly mentioned by the candidate, normalize to:
       - **"expert"** (advanced, high proficiency, deep expertise)
       - **"skilled"** (good, intermediate, proficient)
       - **"familiar"** (basic, beginner, limited experience)
       - If no proficiency is mentioned, leave it **blank**.
   - **"skill"**: If the tech is explicitly listed in the skills section, mark as **true**, otherwise **false**.
   - **"inTechList"**: **true** if the extracted technology exists in TechList, otherwise **false** (discard any technology not in the list).

### **✅ Example Output (T1 - Technologies)**
{{
  "T1": [
    {{
      "originalName": "JavaScript",
      "name": "JavaScript",
      "proficiency": "expert",
      "skill": true,
      "inTechList": true
    }},
    {{
      "originalName": "Node.js",
      "name": "Node.js",
      "proficiency": "skilled",
      "skill": true,
      "inTechList": true
    }}
  ]
}}

---

## **Step 2: Extract & Normalize Experience (E1)**
✅ **Extract the developer’s work experience details and the technologies explicitly mentioned in each job/project description (languages, frameworks, databases, cloud tools, etc.).**
✅ Extract experience details based on the following rules:
   - **"role"**: The candidate's role/title in the job/project.
   - **"job"**: The job/project name as listed in the CV.
   - **"start"**: The start date of the job/project in **dd-mm-yyyy** format.
   - **"end"**: The end date of the job/project in **dd-mm-yyyy** format. If not specified then TODAY
   - **"months"** Number of month which is calculated by (end - start)
    - **"originalTechnologies"**: Extract ONLY official technology names **explicitly and clearly stated** by the engineer in the job description.
    - NEVER EVER infer or guess backend, frontend, or database technologies unless the tech name is CLEARLY stated by the engineer in the job description.
    - NEVER EVER extract work experience from sections other than the experience list** (e.g., Profile, Summary, or Skills).  
    - NEVER EVER assume full-stack development or backend usage unless it is written in the description.
    - If the description mentions a feature (e.g., mobile app, GPS tracking, forms), but does not specify the tech stack, DO NOT extract any tech related to that feature.
    - If no technologies are explicitly stated by its official name, set "technologies": [].
   - **"technologies"**: **Normalize the technology name against** TechList. If the extracted name has an alias (e.g., "AngularJS" → "Angular"), use the standardized name from **TechList**.


---

### **✅ Example Output (E1 - Experience)**
{{
  "E1": [
    {{
      "role": "Full Stack Engineer",
      "job": "Portex Logistics",
      "start": "10-01-2022",
      "end": "31-03-2023",
      "technologies": ["JavaScript", "React", "Node.js"]
    }},
    {{
      "role": "Senior Back-end/PHP Developer",
      "job": "AppDaddy.com",
      "start": "01-08-2015",
      "end": "31-07-2016",
      "technologies": ["PHP", "MySQL", "Symfony"]
    }}
  ]
}}

---

## **🔴 STRICT Extraction Rules**

**TechList Reference:** ${techList}`;
