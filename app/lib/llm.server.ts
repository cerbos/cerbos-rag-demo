import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PromptTemplate } from "@langchain/core/prompts";
import { cerbos } from "./cerbos.server";
import { PlanKind } from "@cerbos/core";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "node_modules/@langchain/core/dist/output_parsers";
import { mapOperand } from "./query-plan-mapper.server";
import { Principal } from "./users";

const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || "http://localhost:11434";
const CHROMA_ENDPOINT = process.env.CHROMA_ENDPOINT || "http://localhost:5666";
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "mxbai-embed-large";
const LLM = process.env.LLM || "llama3.1";

export const CHROMA_COLLECTION_NAME =
  process.env.CHROMA_COLLECTION_NAME || "expense_dev";

const llm = new Ollama({
  baseUrl: OLLAMA_ENDPOINT,
  model: LLM, // Default value
  temperature: 0,
  maxRetries: 2,
});

const embeddings = new OllamaEmbeddings({
  model: EMBEDDING_MODEL, // Default value
  baseUrl: OLLAMA_ENDPOINT, // Default value
});

export const vectorStore = new Chroma(embeddings, {
  collectionName: CHROMA_COLLECTION_NAME,
  url: CHROMA_ENDPOINT, // Optional, will default to this value
});

const prompt = PromptTemplate.fromTemplate(`
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

export async function doQuery(
  query: string,
  principal: Principal,
  authorize: boolean
) {
  let where;
  let authorization;

  if (authorize) {
    console.log("checking permissions");

    authorization = await cerbos.planResources({
      principal,
      resource: {
        kind: "expense",
      },
      action: "view",
    });

    switch (authorization.kind) {
      case PlanKind.ALWAYS_ALLOWED:
        console.log("always allowed");
        break;

      case PlanKind.ALWAYS_DENIED:
        console.log("denied access");
        break;

      case PlanKind.CONDITIONAL:
        where = mapOperand(authorization.condition, (field) =>
          field.replace("request.resource.attr.", "")
        );
    }

    console.log("conditions", where);
  }

  const retriever = vectorStore.asRetriever({
    k: 50,
    searchType: "similarity",
    // verbose: true,
    filter: where,
  });

  let finalPrompt = "";

  const ragChainWithSources = RunnableMap.from({
    // Return raw documents here for now since we want to return them at
    // the end - we'll format in the next step of the chain
    context: retriever,
    question: new RunnablePassthrough(),
  }).assign({
    answer: RunnableSequence.from([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (input: any) => {
        const variables = {
          context: formatDocumentsAsString(input.context),
          question: input.question,
          username: principal.attr.name,
          userId: principal.id,
          time: new Date().toISOString(),
          roles: principal.roles.join(", "),
          department: principal.attr.department,
          region: principal.attr.region ?? "All region",
        };
        finalPrompt = (await prompt.invoke(variables)).toString();
        return variables;
      },
      prompt,
      llm,
      new StringOutputParser(),
    ]),
  });

  const result = await ragChainWithSources.invoke(query);

  return {
    result,
    principal,
    authorize,
    ragFilter: where || null,
    queryPlan: authorization || null,
    prompt: finalPrompt,
  };
}
