import { useFetcher } from "@remix-run/react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { action } from "../routes/api.db";

import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from "./ui/table";
import { LoaderIcon } from "lucide-react";

export function VectorStore() {
  const fetcher = useFetcher<typeof action>();

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Vector Store</CardTitle>
        <CardDescription>
          What do the expenses look like in the vector store??
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-2 flex flex-col">
        <fetcher.Form
          method="POST"
          action="/api/db"
          className="gap-2 flex flex-col"
        >
          <Button type="submit">Load from Vector Store</Button>
        </fetcher.Form>

        {fetcher.state === "loading" ? (
          <LoaderIcon />
        ) : (
          <Table>
            <TableCaption>A list of your recent expenses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Embedding</TableHead>
                <TableHead>Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetcher.data?.resources.map((r) => {
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell className="">
                      <div className="truncate font-mono text-xs text-wrap break-all h-40">
                        {r.embedding}
                      </div>
                    </TableCell>
                    <TableCell className="truncate font-mono text-xs">
                      <pre>
                        {JSON.stringify(
                          {
                            id: r.id,
                            ownerId: r.ownerId,
                            createdAt: r.createdAt,
                            vendor: r.vendor,
                            status: r.status,
                            region: r.region,
                            amount: r.amount,
                            approvedBy: r.approvedById,
                          },
                          null,
                          2
                        )}
                      </pre>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell className="text-right">
                  {fetcher.data?.resources.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
