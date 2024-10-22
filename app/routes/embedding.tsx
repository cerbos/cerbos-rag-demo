import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Embedder } from "~/components/embedder";
import { prisma } from "~/lib/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Cerbos for AI Agent" },
    { name: "description", content: "Using Cerbos in a RAG architecture" },
  ];
};

export async function loader() {
  const resources = await prisma.expense.findMany({});
  return json({ resources });
}
export default function EmbeddingPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="w-10/12 mx-auto flex flex-col gap-10 mt-4">
      <h1 className="font-bold my-2 text-4xl">Embedding Resources</h1>
      <Embedder
        items={data.resources.map((r) => {
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
