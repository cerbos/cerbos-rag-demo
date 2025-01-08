import { PlanKind } from "@cerbos/core";
import { cerbos } from "./cerbos.server";
import { mapOperand } from "./query-plan-mapper.server";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "node_modules/@langchain/core/dist/output_parsers";
import { llm } from "./llm.server";
import { prompt } from "./prompt.server";
import { Principal } from "./users";
import { vectorStore } from "./vector-store.server";

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

  const retriever = vectorStore.getStore().asRetriever({
    k: 50,
    // searchType: "similarity",
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
