import { PromptTemplate } from "@langchain/core/prompts";

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

Answer:  
  `);
