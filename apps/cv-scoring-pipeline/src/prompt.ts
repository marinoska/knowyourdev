export const prompt = `
### Task Overview
Analyze the candidate's CV, GitHub, LinkedIn, and freelance profiles. Assign a **Tech Stack Score (SR2) out of 55 points** based on six core criteria:

1. **Modernity (25 points max)** – Evaluate how up-to-date and relevant the candidate's **actively used** technologies are. **Apply minor deductions for listed aging tech, but stronger deductions if aging tech is actively used.**  
2. **Consistency (10 points max)** – Assess whether the candidate follows a **stable, logical tech stack** without frequent, unrelated shifts. **If aging tech is mixed with modern tech, slightly lower consistency.**  
3. **Evolution (10 points max)** – Determine if the candidate has **phased out aging or legacy tech at the right time**. **If aging tech is still actively used, cap the score at 3-4.**  
4. **Depth (5 points max)** – Measure the candidate's **years of experience per technology**, considering **skill depth in relevant areas**.  
5. **Skill Maturity (-5 to +5 adjustment)** – **Apply a full -5 penalty if the skills list lacks structure, is junior-like, or contains excessive generic terms.** **Do NOT penalize for simply listing aging tech if structured well.**  
6. **Career Stability (-5 to 0 adjustment)** – **Only penalize chaotic role shifts or downgrade-upgrade cycles (e.g., Analyst → Full Stack → Analyst → Web Dev).** **Frequent role shifts should apply a -5 penalty.**  

🚨 **The final SR2 score is a direct sum** of these category scores, with a max of **55 points**.

---

### **1️⃣ Modernity (25 points max)**  
Evaluate **the candidate’s currently active technologies** and assess how modern and widely used they are.  

🚨 **Scoring Adjustments for Listed vs. Actively Used Aging Tech:**  
- **If aging tech is only listed but NOT actively used, apply a minor 1-2 point deduction (Modernity Score ~22-23).**  
- **If aging tech is still actively used, apply a stronger deduction (Modernity Score capped at 12-13).**  
- **If modern stack is inconsistent or secondary, cap Modernity Score at 10.**  
- **Methodologies, general concepts (e.g., APIs, Cloud, WebSockets) should NOT be considered in Modernity.**  

✅ **Scoring Guidelines:**  
- **20-25 points:** Modern technologies are used **as the primary stack for 3+ years**, no aging tech listed.  
- **22-23 points:** Aging tech is **listed but NOT actively used**.  
- **12-15 points:** Modern tech is present, but **some aging tech is still actively used**.  
- **0-12 points:** Modern tech is **barely used or overshadowed by aging/legacy tech**.  

---

### **3️⃣ Evolution (10 points max)**  
Determine if the candidate has **successfully phased out outdated tech**.  

🚨 **Scoring Adjustments for Listed vs. Actively Used Aging Tech:**  
- **If aging tech is only listed (but NOT actively used), allow a score of 9-10.**  
- **If aging tech is still actively used, cap Evolution Score at 3-4.**  

✅ **Scoring Guidelines:**  
- **10 points:** Fully transitioned away from aging or legacy tech, none listed.  
- **9 points:** Aging tech is **still listed but NOT actively used**.  
- **3-4 points:** Aging or outdated tech is **still actively used today**.  

---

### **5️⃣ Skill Maturity (-5 to +5 adjustment)**  
Evaluate **how well-structured, logical, and senior-like the skills list is**.

🚨 **Scoring Adjustments:**  
- **For candidates who include aging tech and low-code platforms without strong structuring, apply a full -5 penalty.**  
- **If skills are well-structured, do NOT penalize just for listing aging tech.**  

✅ **Scoring Guidelines:**  
- **+5 points:** **Highly structured, clear separation of tech categories, senior tech prioritized.**  
- **0 points:** **Balanced mix of tech, minor inconsistencies.**  
- **-5 points:** **Disorganized, junior-like structure, excessive generic skills, low-code platforms.**  

---

### 📊 **Final SR2 Score Calculation (Max 55 Points)**  
\`SR2 = Modernity + Consistency + Evolution + Depth + Skill Maturity + Career Stability\`  

🚨 **DO NOT overestimate scores. Apply stronger penalties for active aging tech use, Skill Maturity, and Career Stability issues.**  

`;