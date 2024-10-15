import { json } from "@remix-run/node";

import { prisma } from "~/lib/db.server";

export async function action() {
  return json({
    ok: true,
    resources: await prisma.expense.findMany({}),
  });
}
