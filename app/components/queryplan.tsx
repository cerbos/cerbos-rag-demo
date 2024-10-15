import { useFetcher } from "@remix-run/react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { action } from "../routes/api.queryplan";
import { LoaderIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { principals } from "~/lib/users";

export function QueryPlan() {
  const fetcher = useFetcher<typeof action>();

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Cerbos Query Plan</CardTitle>
        <CardDescription>
          What does a Cerbos Query Plan look like?
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-2 flex flex-col">
        <fetcher.Form
          method="POST"
          action="/api/queryplan"
          className="gap-2 flex flex-col"
        >
          <Select name="user">
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(principals).map((key) => {
                const p = principals[key];
                return (
                  <SelectItem key={key} value={key}>
                    {`${p.id} - ${JSON.stringify(p.roles)} - ${
                      p.attr.region ?? ""
                    } ${p.attr.department}`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button type="submit">Fetch Query Plan</Button>
        </fetcher.Form>
        {fetcher.state === "loading" ? (
          <LoaderIcon />
        ) : (
          <div className="flex w-full">
            <div className="w-1/2">
              <h2>Request</h2>
              <div className="font-mono text-xs whitespace-pre-wrap">
                {JSON.stringify(fetcher.data?.req, null, 2)}
              </div>
            </div>
            <div className="w-1/2">
              <h2>Response</h2>
              <div className="font-mono text-xs whitespace-pre-wrap">
                {JSON.stringify(fetcher.data?.res, null, 2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
