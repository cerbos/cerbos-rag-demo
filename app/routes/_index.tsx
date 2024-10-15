import { json, type MetaFunction } from "@remix-run/node";
import { Embedder } from "~/components/embedder";
import { QueryPlan } from "~/components/queryplan";
import { Resources } from "~/components/resources";
import { Seed } from "~/components/seed";

export const meta: MetaFunction = () => {
  return [
    { title: "Cerbos for AI Agent" },
    { name: "description", content: "Using Cerbos in a RAG architecture" },
  ];
};

export async function loader() {
  return json({});
}
export default function Index() {
  return (
    <div className="w-10/12 mx-auto flex flex-col gap-10 mt-4">
      <Seed />
      <h1 className="font-bold my-2 text-4xl">Authorization in RAG</h1>
      <Resources />
      <Embedder />
      <QueryPlan />
    </div>
  );
}
