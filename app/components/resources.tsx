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

export function Resources() {
  const fetcher = useFetcher<typeof action>();

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>What do the expenses look like?</CardDescription>
      </CardHeader>
      <CardContent className="gap-2 flex flex-col">
        <fetcher.Form
          method="POST"
          action="/api/db"
          className="gap-2 flex flex-col"
        >
          <Button type="submit">Load from DB</Button>
        </fetcher.Form>

        {fetcher.state === "loading" ? (
          <LoaderIcon />
        ) : (
          <Table>
            <TableCaption>A list of your recent expenses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Embedding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetcher.data?.resources.map((r) => {
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.createdAt}</TableCell>
                    <TableCell>{r.vendor}</TableCell>
                    <TableCell className="tabular-nums">{r.amount}</TableCell>
                    <TableCell>{r.region}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.approvedById}</TableCell>
                    <TableCell className="truncate w-10 text-ellipsis">
                      {r.embedding}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>Total</TableCell>
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
