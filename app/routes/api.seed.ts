import { json } from "@remix-run/node";
import { embeddings } from "~/embedding.server";

import { prisma } from "~/lib/db.server";

const data = [
  {
    id: "1",
    ownerId: "sally",
    amount: 500,
    status: "PENDING",
    region: "EMEA",
    vendor: "ABC",
    createdAt: new Date(),
  },
];

export async function action() {
  await prisma.expense.deleteMany({});

  await prisma.expense.createMany({
    data: await Promise.all(
      data.map(async (d) => {
        const document = `ID: ${d.id}
Vendor: ${d.vendor}
Amount: ${d.amount}
Owner: ${d.ownerId}
Region: ${d.region}
Status: ${d.status}
Created At: ${d.createdAt.toISOString()}`;
        return {
          ...d,
          embeddingRaw: document,
          embedding: await embeddings
            .embedQuery(document)
            .then((embedding) => JSON.stringify(embedding)),
        };
      })
    ),
  });

  return json({
    ok: true,
  });
}
