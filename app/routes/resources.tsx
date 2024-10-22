import {
  ActionFunctionArgs,
  json,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { PrincipalSelect } from "~/components/principal-select";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { embeddings } from "~/embedding.server";
import { prisma } from "~/lib/db.server";
import { resetVectorStore } from "~/lib/reset-vector-store.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Cerbos for AI Agent" },
    { name: "description", content: "Using Cerbos in a RAG architecture" },
  ];
};

export async function loader() {
  const resources = await prisma.expense.findMany({});
  return json({ resources });
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const d = await prisma.expense.create({
    data: {
      vendor: body.get("vendor")!.toString(),
      amount: parseInt(body.get("amount")!.toString()),
      ownerId: body.get("principal")!.toString(),
      region: body.get("region")!.toString(),
      status: "PENDING",
    },
  });

  const document = `ID: ${d.id}
  Vendor: ${d.vendor}
  Amount: ${d.amount}
  Owner: ${d.ownerId}
  Region: ${d.region}
  Status: ${d.status}
  Created At: ${d.createdAt.toISOString()}`;

  await prisma.expense.update({
    data: {
      embedding: await embeddings
        .embedQuery(document)
        .then((embedding) => JSON.stringify(embedding)),
      embeddingRaw: document,
    },
    where: {
      id: d.id,
    },
  });
  await resetVectorStore();
  return redirect(`.`);
}
export default function ResourcesPage() {
  const { resources } = useLoaderData<typeof loader>();
  return (
    <div className="w-10/12 mx-auto flex flex-col gap-10 mt-4">
      <h1 className="font-bold my-2 text-4xl">Application Resources</h1>
      <Card className="">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>What do the expenses look like?</CardDescription>
        </CardHeader>
        <CardContent className="gap-2 flex flex-col">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((r) => {
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.createdAt}</TableCell>
                    <TableCell>{r.ownerId}</TableCell>
                    <TableCell>{r.vendor}</TableCell>
                    <TableCell className="tabular-nums">{r.amount}</TableCell>
                    <TableCell>{r.region}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.approvedById}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="POST">
            <Label>Vendor</Label>
            <Input name="vendor"></Input>

            <Label>Amount</Label>
            <Input name="amount" type="number"></Input>
            <Label>Region</Label>
            <Input name="region"></Input>
            <Label>Created By</Label>
            <PrincipalSelect />

            <Button type="submit">Add</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
