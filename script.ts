import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const prisma = new PrismaClient();

async function main() {
  const usersWithPosts = await prisma.item.findMany();
  console.dir(usersWithPosts, { depth: null });
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
