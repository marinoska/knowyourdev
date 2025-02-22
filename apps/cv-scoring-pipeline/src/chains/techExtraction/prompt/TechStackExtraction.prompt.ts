import { techStackList } from './tech_stack_list.js';


/**
 * deprecated
 * use identifyStack instead
 *
 * Langchain params
 * {provided_techs}
 */
export const techStackExtractionPrompt = `
You are given a list of **technology stacks** and their corresponding components. Your task is to match a provided set of technologies against these predefined stacks and determine the most appropriate stack name.

## **Tech Stack Matching Rules**
1. **Parse the stack definitions** from the provided list.
   - Each stack is written as:  
     **(stack components) => stack name**
   - Example:  
     **(MongoDB, Express.js, React.js, Node.js) => MERN**
   
2. **Handle OR conditions (|)**:
   - If a stack component contains |, only **one** of its values needs to match.
   - Example: (Linux, Apache, MySQL, PHP|Perl|Python) => LAMP
     - PHP|Perl|Python means **at least one of them** must be present.

3. **Compare the provided technologies** with each stack:
   - Count how many components match.
   - If **≥ 75% of components match**, consider the stack **valid**.

4. **If multiple stacks qualify**, return ALL of them in the array**. If no one matches 75% return an empty array

---

## **Tech Stack List Reference**
${techStackList}

## **Provided Technologies**
{provided_techs}

**Determine the best matching stack based on the above rules.**
`;
