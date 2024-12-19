import type { Route } from "./+types/api.chat";
import { PlanResourcesResponse, Principal } from "@cerbos/core";

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
    principal: Principal;
    authorize: boolean;
  };
}

export async function action({ request }: Route.ActionArgs) {
  const body = await request.formData();
  const question = body.get("question")?.toString();
  const principal = body.get("principal")?.toString();
  const authorize = body.get("authorize")?.toString() === "on";

  console.log(question, principal);

  if (!question || !principal) {
    return {
      ok: false,
    };
  }

  const result = await doQuery(question, principals[principal], authorize);

  return {
    ok: true,
    result,
  };
}
