import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const prisma = new PrismaClient();

async function main() {
  const totalTransfer = await prisma.oLHistory.aggregate({
    _sum: {
      totalItems: true,
    },
  });

  console.log(`Total transfer : ${totalTransfer._sum.totalItems}`);
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
