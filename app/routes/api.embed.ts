import type { Route } from "./+types/api.embed";
import { embeddings } from "~/embedding.server";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const input = formData.get("input")?.toString();
  if (!input) {
    return null;
  }
  return {
    ok: true,
    embeddings: await embeddings.embedQuery(input),
  };
}
