import { useState } from "react";
import { ChatResponse } from "~/routes/api.chat";
import { Button } from "./ui/button";

export function ChatEntry({ response }: { response: ChatResponse }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="bg-blue-50 rounded-xl rounded-b-none p-2 gap-2 flex flex-col">
        <p className="text-sm">
          {response.result?.principal.id} - AuthZ:{" "}
          {response.result?.authorize ? "ENABLED" : "DISABLED"}
        </p>
        <p className="italic">{response.result?.result.question}</p>
      </div>
      <div className=" bg-green-50 rounded-xl rounded-t-none p-2">
        <p className="italic text-right text-sm">
          <pre className="break-words whitespace-pre-wrap">
            {response.result?.result.answer}
          </pre>
        </p>
      </div>
      <div className="text-right">
        <Button
          onClick={() => {
            setOpen((v) => !v);
          }}
          variant={"link"}
        >
          Details
        </Button>
      </div>
      {open && (
        <div className="flex gap-4">
          <div className="w-1/3 gap-2 flex flex-col">
            <h3 className="font-semibold">Query Plan</h3>
            <pre className="text-xs break-words whitespace-pre-wrap bg-gray-100 p-2 rounded-lg">
              {JSON.stringify(response.result?.queryPlan, null, 2)}
            </pre>
          </div>
          <div className="w-1/3 gap-2 flex flex-col">
            <h3 className="font-semibold">Vector Store Filter</h3>
            <pre className="text-xs break-words whitespace-pre-wrap bg-gray-100 p-2 rounded-lg">
              {JSON.stringify(response.result?.ragFilter, null, 2)}
            </pre>
          </div>
          <div className="w-1/3 gap-2 flex flex-col">
            <h3 className="font-semibold">Prompt</h3>
            <pre className="text-xs break-words whitespace-pre-wrap bg-gray-100 p-2 rounded-lg">
              {response.result?.prompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
