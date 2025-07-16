export const extractTechnologiesFromJobDescriptionPrompt = `You're provided with a job title and job description from a company that is hiring a developer.  
Your task is to analyze the **role expectations, project goals, and required skills** to extract and classify the **technologies list**.

## Step 1. **Extract Technologies**
✅ **Identify and classify ONLY explicitly and clearly mentioned technologies** (languages, frameworks, databases, cloud tools, etc.) throughout the job title and job description.  
✅ DO NOT infer or assume backend, frontend, or database technologies unless the technology is CLEARLY named in the description.  
✅ DO NOT assume full-stack development or backend use unless it is clearly described in the job responsibilities.  
✅ If no technologies are explicitly stated by name, set "technologies": [].

## Step 2. **Infer Job Characteristics**
   - "softwareDevelopmentScope": Analyze the job title and description to infer the primary focus:
      - Use "BE" for Back-End roles (e.g., designing APIs, server-side logic, or databases).
      - Use "FE" for Front-End roles, including Mobile Developers focused on client-side UI (e.g., React Native, Flutter, iOS, Android).
      - Use "FS" for Full-Stack roles (e.g., both frontend and backend responsibilities or system integration).
      - Leave empty if none can be confidently inferred.

   - "roleType": Analyze the job title and description to classify the type of role:
      - Use "SE" for Software Engineering roles, including mobile and web developers.
      - Use "QA" for Quality Assurance roles (e.g., test engineers, SDETs).
      - Use "DO" for DevOps-focused roles (e.g., CI/CD, infrastructure, cloud, monitoring).
      - Use "UI/UX" for design-centric roles (e.g., UX researchers, UI designers).
      - Use "PM" for Product/Project/Program Management roles (e.g., coordination, strategy).
      - Leave empty if none of these types apply clearly.

   - "isSoftwareDevelopmentRole": Set to:
      - true if the role involves software development responsibilities (e.g., building, coding, engineering software systems).
      - false if the role is non-development (e.g., HR, marketing, coordination roles).

   - "isMobileDevelopmentRole": Set to:
      - true if the role clearly involves mobile development (e.g., iOS/Android/React Native/Flutter development).
      - false if unrelated to mobile platforms.

   - "summary": Provide a **short, one-sentence summary** that captures the **main focus** of the role based on the description.

Example Output:
{{
  "technologies": ["React", "Node.js", "AWS"],
  "softwareDevelopmentScope": "FS",
  "roleType": "SE",
  "isSoftwareDevelopmentRole": true,
  "isMobileDevelopmentRole": false,
  "summary": "The company is hiring a full-stack engineer to build scalable web applications using modern JavaScript technologies."
}}
`;
