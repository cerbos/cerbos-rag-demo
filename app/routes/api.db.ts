import { prisma } from "~/lib/db.server";

export async function action() {
  return {
    ok: true,
    resources: await prisma.expense.findMany({}),
  };
}
