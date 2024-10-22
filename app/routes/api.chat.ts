import { PlanResourcesResponse } from "@cerbos/core";
import { ActionFunctionArgs, json } from "@remix-run/node";

import { doQuery } from "~/lib/llm.server";
import { principals } from "~/lib/users";

export interface ChatResponse {
  ok: boolean;
  result?: {
    result: {
      question: string;
      answer: string;
    };
    ragFilter: object;
    queryPlan: PlanResourcesResponse;
    prompt: string;
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const question = body.get("question")?.toString();
  const principal = body.get("principal")?.toString();
  const authorize = body.get("authorize")?.toString() === "on";

  console.log(question, principal);

  if (!question || !principal) {
    return json({
      ok: false,
    });
  }

  const result = await doQuery(question, principals[principal], authorize);

  return json({
    ok: true,
    result,
  });
}
