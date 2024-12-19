import { type MetaFunction } from "react-router";
import { useState } from "react";

import { RAGDiagram } from "~/assets/diagram-rag";
import { RAGDiagramWithCerbos } from "~/assets/diagram-rag-with-cerbos";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

export const meta: MetaFunction = () => {
  return [
    { title: "Cerbos for AI Agent" },
    { name: "description", content: "Using Cerbos in a RAG architecture" },
  ];
};

export async function loader() {
  return {};
}
export default function Index() {
  const [showAuthz, setShowAuthz] = useState(false);
  return (
    <div className="w-10/12 mx-auto flex flex-col gap-10 mt-4">
      <h1 className="font-bold my-2 text-4xl">Authorization in RAG</h1>
      <div className="flex items-center space-x-2">
        <Switch id="with-cerbos" onCheckedChange={setShowAuthz} />
        <Label htmlFor="with-cerbos">With Authorization</Label>
      </div>

      {showAuthz ? <RAGDiagramWithCerbos /> : <RAGDiagram />}
    </div>
  );
}
