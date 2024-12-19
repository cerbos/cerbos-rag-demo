import type { Route } from "./+types/api.queryplan";
import { cerbos } from "~/lib/cerbos.server";
import { principals } from "~/lib/users";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const principal = formData.get("principal")?.toString();

  if (!principal) {
    return null;
  }

  if (!principals[principal]) {
    return null;
  }

  const req = {
    principal: principals[principal],
    resource: { kind: "expense" },
    action: "view",
  };
  return {
    ok: true,
    req,
    res: await cerbos.planResources(req),
  };
}
