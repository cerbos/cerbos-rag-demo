import { Ollama } from "@langchain/ollama";

const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || "http://localhost:11434";

const LLM = process.env.LLM || "llama3.1";

export const llm = new Ollama({
  baseUrl: OLLAMA_ENDPOINT,
  model: LLM, // Default value
  temperature: 0,
  maxRetries: 2,
});
