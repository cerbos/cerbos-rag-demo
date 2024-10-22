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
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface IItem {
  id: string;
  title: string;
  embeddingRaw: string;
}
interface Props {
  items: IItem[];
}

export function Embedder({ items }: Props) {
  const fetcher = useFetcher<typeof action>();
  const [selectedItem, setItemSelected] = useState<IItem | null>(null);

  const [embeddingDoc, setEmbeddingDoc] = useState<string>("");

  useEffect(() => {
    setEmbeddingDoc(selectedItem?.embeddingRaw || "");
  }, [selectedItem]);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Embedding</CardTitle>
        <CardDescription>
          What does an embedded document look like?
          <Select
            onValueChange={(itemId) => {
              setItemSelected(items.find((i) => i.id === itemId) || null);
            }}
            value={selectedItem?.id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a resource" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item, i) => {
                return (
                  <SelectItem key={i} value={item.id}>
                    {item.title}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-2 flex flex-col">
        <fetcher.Form
          method="POST"
          action="/api/embed"
          className="gap-2 flex flex-col"
        >
          <Textarea
            name="input"
            value={embeddingDoc}
            onChange={(e) => setEmbeddingDoc(e.currentTarget.value)}
            className="h-80"
          />
          <Button type="submit">Embed</Button>
        </fetcher.Form>
        {fetcher.state == "loading" ? (
          <LoaderIcon />
        ) : (
          <div className="font-mono whitespace-break-spaces text-wrap text-xs  overflow-ellipsis truncate break-all">
            {JSON.stringify(fetcher.data?.embeddings)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
