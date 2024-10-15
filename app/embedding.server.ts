import { PromptTemplate } from "@langchain/core/prompts";
import { OllamaEmbeddings } from "@langchain/ollama";

const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || "http://localhost:11434";
// const CHROMA_ENDPOINT = process.env.CHROMA_ENDPOINT || "http://localhost:5666";
// export const CHROMA_COLLECTION_NAME =
//   process.env.CHROMA_COLLECTION_NAME || "expense_dev";

export const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large", // Default value
  baseUrl: OLLAMA_ENDPOINT, // Default value
});

export const prompt = PromptTemplate.fromTemplate(`
  You are an assistant for question-answering tasks. 
  Use the following pieces of retrieved context to answer the question. 
  
  Use three sentences maximum and keep the answer concise. 
  
  Question: {question} 
  
  Context: {context} 
  
  My Username is {username}
  My User ID is {userId}
  My roles are {roles}
  My department is {department}
  My region is {region}
  
  The current time is {time}
  
  If the user role is MANAGER and department in SALES then they can only approve an expense if it is in the same region as them.
  If the user department is IT then they can access all expenses regardless of region.
  A user can't approve their own expenses unless they have the ADMIN role
  
  Answer:  
  `);
