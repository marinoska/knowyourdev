export const extractTechnologiesPrompt = `You're provided with a developer's role and job description. 
Your task is to analyze the developer's **work experience, project descriptions, and skills** to extract and classify **technologies list**.

## Step 1. **Extract Technologies**
✅ **Identify and classify ONLY explicitly and clearly mentioned technologies** (languages, frameworks, databases, cloud tools, etc.) throughout the job and role description.
✅ DO NOT infer or guess backend, frontend, or database technologies unless the tech name is CLEARLY stated by the engineer in the job description.
✅ DO NOT assume full-stack development or backend usage unless it is written in the description.
✅ If no technologies are explicitly stated by its official name, set "technologies": [].

## Step 2. **Infer job specifics**
   - "softwareDevelopmentScope": Carefully analyze the job description and role name. Identify and infer the relevant category:
      - Use "BE" for Back-End roles (e.g., designing APIs, databases, or server-side logic).
      - Use "FE" for Front-End roles, including Mobile Developers focusing on client-side user interfaces (e.g., building UI for iOS/Android or using cross-platform frameworks like React Native/Flutter).
      - Use "FS" for Full-Stack roles, including Mobile Developers working on both client-side and backend systems or API integration.
      - Leave empty if none of these categories are explicitly mentioned or cannot be inferred.
   - "roleType": Carefully analyze the job description and role name. Identify and infer the relevant category:
      - Use "SE" for Software Engineering roles, including mobile developers (e.g., iOS/Android, cross-platform).
      - Use "QA" for Quality Assurance/Testing roles, such as testers or automation engineers.
      - Use "UI/UX" for design-focused roles, such as UX designers, UI designers, or researchers.
      - Use "PM" for Product/Project/Program Management roles, focusing on planning, strategy, or team coordination.
      - Leave empty if the role does not clearly match any of the above categories. 
   - "isSoftwareDevelopmentRole": Carefully analyze the job description and role name. Set this to:
      - true if the role involves software development tasks (e.g., "staff engineer", "software developer", "mobile developer").
      - false if the role is non-development (e.g., HR, marketing, or unrelated functions).
   - "isMobileDevelopmentRole": Carefully analyze the job description and role name. Set this to:
      - true if the role explicitly involves mobile development tasks (e.g., "iOS developer", "Android developer", "React Native developer", "Flutter developer").
      - false if the role is unrelated to mobile development
   - "summary": short summary for the role description,


Example Output:
{{
  "technologies": ["Angular", "React"],
  "softwareDevelopmentScope": "BE",
  "roleType": "SE",
  "isSoftwareDevelopmentRole": true,
  "summary": "Contributed in the development of a SaaS platform."
}}
`;
