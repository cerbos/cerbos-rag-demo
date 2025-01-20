import { OllamaEmbeddings } from "@langchain/ollama";

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "mxbai-embed-large";
const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || "http://localhost:11434";

export const embeddings = new OllamaEmbeddings({
  model: EMBEDDING_MODEL, // Default value
  baseUrl: OLLAMA_ENDPOINT, // Default value
});
