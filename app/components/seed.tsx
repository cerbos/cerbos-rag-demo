import { useFetcher } from "@remix-run/react";
import { Button } from "./ui/button";
import { action } from "../routes/api.seed";

export function Seed() {
  const fetcher = useFetcher<typeof action>();

  return (
    <fetcher.Form
      method="POST"
      action="/api/seed"
      className="gap-2 flex flex-col"
    >
      <Button type="submit">Reset</Button>
    </fetcher.Form>
  );
}
