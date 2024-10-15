import { ActionFunctionArgs, json } from "@remix-run/node";

import { cerbos } from "~/lib/cerbos.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const role = formData.get("role")?.toString();

  if (!role) {
    return json(null);
  }

  const req = {
    principal: {
      id: "user@example.com",
      roles: [role],
      attr: { department: "SALES", region: "EMEA" },
    },
    resource: { kind: "expense" },
    action: "view",
  };
  return json({
    ok: true,
    req,
    res: await cerbos.planResources(req),
  });
}
