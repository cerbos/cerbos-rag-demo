import type { Route } from "./+types/embedding";
import { Embedder } from "~/components/embedder";
import { prisma } from "~/lib/db.server";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Cerbos for AI Agent" },
    { name: "description", content: "Using Cerbos in a RAG architecture" },
  ];
};

export async function loader() {
  const resources = await prisma.expense.findMany({});
  return { resources };
}
export default function EmbeddingPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="w-10/12 mx-auto flex flex-col gap-10 mt-4">
      <h1 className="font-bold my-2 text-4xl">Embedding Resources</h1>
      <Embedder
        items={loaderData.resources.map((r) => {
          return {
            id: r.id,
            title: `${r.id} - ${r.vendor} - $${r.amount}`,
            embeddingRaw: r.embeddingRaw || "",
          };
        })}
      />
    </div>
  );
}
