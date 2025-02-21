import { techStackList } from './tech_stack_list.js';
export const stackIdentificationPrompt = `
You are given a list of **technology stacks** and their corresponding components. Your task is to match a provided set of technologies against these predefined stacks and determine the most appropriate stack name.

## **Tech Stack Matching Rules**
1. **Parse the stack definitions** from the provided list.
   - Each stack is written as:  
     **(stack components) => stack name**
   - Example:  
     **(MongoDB, Express.js, React.js, Node.js) => MERN**
   
2. **Handle OR conditions (|`)**:
   - If a stack component contains `|', only **one** of its values needs to match.
   - Example: '(Linux, Apache, MySQL, PHP|Perl|Python) => LAMP'
     - 'PHP|Perl|Python'`' means **at least one of them** must be present.

3. **Compare the provided technologies** with each stack:
   - Count how many components match.
   - If **≥ 75% of components match**, consider the stack **valid**.

4. **If multiple stacks qualify**, return the one with the **highest match percentage**.
   - If percentages are the same, return the **most specific stack** (one with more components).

---

### **✅ Output Format**
{{
  "stackName": "Matched Stack Name or 'Unmatched'",
  "matchedComponents": ["Matching Tech 1", "Matching Tech 2", ...],
  "matchPercentage": 85
}}

---

## **Tech Stack List Reference**
{techStackList}

## **Provided Technologies**
{providedTechs}

**Determine the best matching stack based on the above rules.**
`;
