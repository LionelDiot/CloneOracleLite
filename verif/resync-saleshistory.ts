import { PrismaClient } from "@prisma/client";
import { dir, log } from "console";
import { create } from "domain";

const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  let yesterday = new Date(2023, 5, 9);
  let today = new Date(2023, 5, 10);
  const items = await prisma.oLHistory.findMany({
    select: {
      totalItems: true,
      archetypeId: true,
      _count: {
        select: {
          olTransfers: true,
        },
      },
    },
  });

  for (const item of items) {
    if (item.totalItems != item._count.olTransfers) {
      log(`${item.totalItems} VS ${item._count.olTransfers}`);
      await prisma.oLHistory.update({
        where: {
          archetypeId: item.archetypeId,
        },
        data: {
          synced: false,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
