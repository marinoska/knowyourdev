import { techStackList } from './tech_stack_list.js';

export const sp2_p2 = `You're provided with a list of **technologies (T1)** extracted from a developer's CV. Your task is to analyze the extracted technologies and detect **technology stacks**.
### **Step 2: Detect & Validate Tech Stacks**

✅ **Stack detection follows strict matching rules:**
   - **Check each stack in** ${techStackList} **against the extracted technologies (T1).**
   - **A stack is detected only if at least 75% of its components exist in T1.**
   - **Stack detection must strictly match exact names from T1** (no inferred or missing technologies).

✅ Extract stack experience values based on the following rules:
   - "name": The technology stack name.
   - "overallMonth": The total experience duration in months (based on matching components in T1).
   - "actualMonth": If the tech/stack is currently in use, provide the duration in months from today backward. If not in current use, set to **0**.
   - "% match": The percentage of components found in T1 (100% match, 75% match, etc.).
   - **"components"**: List of **only those stack components that exist in T1**.
   - "proficiency": If explicitly mentioned by the candidate, normalize it to:
     - **"expert"** (advanced, high proficiency, deep expertise).
     - **"skilled"** (good, intermediate, proficient).
     - **"familiar"** (basic, beginner, limited experience).
     - If no proficiency is mentioned, leave it blank.
   - "skill": If the tech/stack is explicitly listed in the skills section, mark as **true**, otherwise **false**.

✅ **Strict Filtering Rules:**
   - **Stacks with less than 75% component match are ignored.**
   - **All stack components must first appear in T1 before being added to T2.**
   - **If any component of a detected stack is missing in T1, the stack is NOT included in T2.**

✅ **Output JSON Object:**  
Name this output **T2**.
Return the detected technology stacks in JSON format.

Example:
{
  "T2": [
    {
      "name": "MERN",
      "overallMonth": 36,
      "actualMonth": 12,
      "% match": 100,
      "components": ["MongoDB", "Express.js", "React.js", "Node.js"],
      "proficiency": "skilled",
      "skill": false
    }
  ]
}
`;
