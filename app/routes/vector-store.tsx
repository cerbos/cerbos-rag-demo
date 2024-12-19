import type { Route } from "./+types/vector-store";
import { VectorStore } from "~/components/vector-store";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Cerbos for AI Agent" },
    { name: "description", content: "Using Cerbos in a RAG architecture" },
  ];
};

export async function loader() {
  return {};
}
export default function VectorStorePage() {
  return (
    <div className="w-10/12 mx-auto flex flex-col gap-10 mt-4">
      <h1 className="font-bold my-2 text-4xl">Vectors</h1>
      <VectorStore />
    </div>
  );
}
