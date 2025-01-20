import { prisma } from "./db.server";
import { vectorStore } from "./vector-store.server";

export async function resetVectorStore() {
  try {
    await vectorStore.reset();

    const expenses = await prisma.expense.findMany({});
    const documents = expenses.map((d) => {
      return {
        pageContent: `ID: ${d.id}
Vendor: ${d.vendor}
Amount: ${d.amount}
Region: ${d.region}
OwnerId: ${d.ownerId}
Status: ${d.status}
Approved By: ${d.approvedById}
Created At: ${d.createdAt.toISOString()}`,
        metadata: {
          id: d.id,
          vendor: d.vendor,
          amount: d.amount,
          region: d.region,
          ownerId: d.ownerId,
          status: d.status,
          createdAt: d.createdAt,
        },
      };
    });

    await vectorStore.addDocuments(documents, {
      ids: expenses.map((d) => d.id),
    });
  } catch (e) {
    console.error(e);
  }
}
