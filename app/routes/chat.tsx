import { json } from "@remix-run/node";
import { useEffect, useState } from "react";

import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { action as chatAction, ChatResponse } from "../routes/api.chat";
import { useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PrincipalSelect } from "~/components/principal-select";
import { Loader } from "lucide-react";
import { ChatEntry } from "~/components/chat-response";

export async function loader() {
  return json({});
}
export default function Chat() {
  const [, setShowAuthz] = useState(false);
  const fetcher = useFetcher<typeof chatAction>();

  const [responses, setResposnes] = useState<ChatResponse[]>([]);

  useEffect(() => {
    if (fetcher.data) {
      setResposnes((prevState) => {
        return [fetcher.data as ChatResponse, ...prevState];
      });
    }
  }, [fetcher.data]);
  return (
    <div className="w-10/12 mx-auto flex flex-col gap-10 min-h-screen max-h-screen">
      <h1 className="font-bold text-4xl py-4">Expenses Chat</h1>
      <div className="flex-1 overflow-y-scroll flex gap-4 flex-col">
        {responses
          .filter((r) => r.ok)
          .reverse()
          .map((response, i) => {
            return <ChatEntry response={response} key={i} />;
          })}
      </div>

      <div>
        <fetcher.Form
          method="POST"
          action="/api/chat"
          className="flex flex-col gap-4 pb-4"
        >
          <div className="flex gap-4">
            <Input name="question" />
            <Button
              type="submit"
              className="flex-growx"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? <Loader /> : "Send"}
            </Button>
          </div>
          <div className="flex gap-4">
            <PrincipalSelect name="principal" />

            <div className="flex items-center gap-4">
              <Switch
                id="with-cerbos"
                name="authorize"
                onCheckedChange={setShowAuthz}
              />
              <Label htmlFor="with-cerbos">With Authorization</Label>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
