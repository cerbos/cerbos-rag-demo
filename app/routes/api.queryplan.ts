import { ActionFunctionArgs, json } from "@remix-run/node";

import { cerbos } from "~/lib/cerbos.server";
import { principals } from "~/lib/users";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const principal = formData.get("principal")?.toString();

  if (!principal) {
    return json(null);
  }

  if (!principals[principal]) {
    return json(null);
  }

  const req = {
    principal: principals[principal],
    resource: { kind: "expense" },
    action: "view",
  };
  return json({
    ok: true,
    req,
    res: await cerbos.planResources(req),
  });
}
