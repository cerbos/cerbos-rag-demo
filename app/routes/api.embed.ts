import { ActionFunctionArgs, json } from "@remix-run/node";
import { embeddings } from "~/embedding.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const input = formData.get("input")?.toString();
  console.log(input);
  if (!input) {
    return json(null);
  }
  return json({
    ok: true,
    embeddings: await embeddings.embedQuery(input),
  });
}
