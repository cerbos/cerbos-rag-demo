import { ActionFunctionArgs, json } from "@remix-run/node";

import { cerbos } from "~/lib/cerbos.server";
import { principals } from "~/lib/users";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = formData.get("user")?.toString();

  if (!user) {
    return json(null);
  }

  if (!principals[user]) {
    return json(null);
  }

  const req = {
    principal: principals[user],
    resource: { kind: "expense" },
    action: "view",
  };
  return json({
    ok: true,
    req,
    res: await cerbos.planResources(req),
  });
}
