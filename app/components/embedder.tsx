import { useFetcher } from "@remix-run/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { action } from "../routes/api.embed";
import { LoaderIcon } from "lucide-react";

export function Embedder() {
  const fetcher = useFetcher<typeof action>();

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Embedding</CardTitle>
        <CardDescription>
          What does an embedded document look like?
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-2 flex flex-col">
        <fetcher.Form
          method="POST"
          action="/api/embed"
          className="gap-2 flex flex-col"
        >
          <Textarea name="input" />
          <Button type="submit">Embed</Button>
        </fetcher.Form>
        {fetcher.state == "loading" ? (
          <LoaderIcon />
        ) : (
          <div className="font-mono whitespace-break-spaces text-wrap break-words text-xs max-h-64 overflow-ellipsis truncate">
            {JSON.stringify(fetcher.data?.embeddings)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
