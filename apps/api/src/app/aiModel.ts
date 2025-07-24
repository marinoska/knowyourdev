import { ChatOpenAI } from "@langchain/openai";

export const gpt4oMini = new ChatOpenAI({
  // model: "gpt-4.1-mini",
  model: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
