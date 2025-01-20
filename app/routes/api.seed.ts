import { embeddings } from "~/embedding.server";

import { prisma } from "~/lib/db.server";
import { resetVectorStore } from "~/lib/reset-vector-store.server";

const data = [
  {
    id: "1",
    ownerId: "sally",
    amount: 500,
    status: "PENDING",
    region: "EMEA",
    vendor: "Blue Origin",
    createdAt: new Date(),
  },
  {
    id: "2",
    ownerId: "sally",
    amount: 300000,
    status: "PENDING",
    region: "NA",
    vendor: "NASA",
    createdAt: new Date(),
  },
  {
    id: "3",
    ownerId: "sydney",
    amount: 1000,
    status: "PENDING",
    region: "EMEA",
    vendor: "Space X",
    createdAt: new Date(),
  },
  {
    id: "4",
    ownerId: "ian",
    amount: 1000,
    status: "PENDING",
    region: "EMEA",
    vendor: "Virign Galactic",
    createdAt: new Date(),
  },
  {
    id: "5",
    ownerId: "sally",
    amount: 50000,
    status: "PENDING",
    region: "EMEA",
    vendor: "ESA",
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

  await resetVectorStore();

  return {
    ok: true,
  };
}
