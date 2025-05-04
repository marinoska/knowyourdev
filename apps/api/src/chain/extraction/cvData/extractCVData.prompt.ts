/**
 * Langchain params
 * {cv_text}
 */
export const ExtractCVDataPrompt = `You're provided with a developer's CV. Your task is to extract the developer's **work experience, job descriptions, profile and skills list**.

TODAY is ${Date()}

Step 1: Extract general profile/description and skills section** based on the following rules:
   - "skillSection": Full **unchanged** general skill section 
   - "profileSection": Full **unchanged** general profile/description section
   - "fullName": The candidate's name and surname.
   - "position": Headline/position/"role in the heading",
   - "sections": Array of CV sections names normalized to one of the "List of sections" provided below.)',


## **Step 2: Extract Jobs**
✅ **Extract the developer’s jobs/roles with descriptions**
✅ Extract experience details based on the following rules:
   - "role": The candidate's role/title in the job/project.
   - "text": Full **unchanged** job description
   - "job": The company/project name as listed in the CV.
   - "start": The start date of the job/project in **mm-yyyy** format.
   - "end": The end date of the job/project in **mm-yyyy** format. If it's a present job with no end date specified set TODAY's date in **mm-yyyy** format
   - "months": Number of month which is calculated as (end - start)
   - "present": If it's a current job, mark as **true**, otherwise **false**.

---

Example Output:
{{
  "fullName": "Joe Doe",
  "skillSection": "TS, Node, React - expert ...",
  "profileSection": "seasoned web engineer",
  "position": "Full-stack engineer",
  "sections": [
    "Education", 
    "Contacts", 
    "Skills", 
    "Jobs"
  ]
  "jobs": [
    {{
    "role": "Full Stack Engineer", 
    "job": "Company Name", 
    "text": "Job description here",
    "start": "01-2022", 
    "end": "01-2023", 
    "months": 12, 
    }}
  ],
}}

List of sections:
{list_of_sections}

CV:
{cv_text}`;
