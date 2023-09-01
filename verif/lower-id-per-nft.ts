import { PrismaClient } from "@prisma/client";
import { dir, log } from "console";
import { create } from "domain";

const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  let yesterday = new Date(2023, 5, 9);
  let today = new Date(2023, 5, 10);
  const category = await prisma.category.findUnique({
    where: { name: "Cosmetic" },
    include: {
      items: {
        select: {
          name: true,
          nfts: {
            select: {
              issuedId: true,
            },
            orderBy: {
              issuedId: "asc",
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!category) return;

  let parsedDrop = category.items.map((d) => {
    return {
      name: d.name,
      lowerId: d.nfts[0].issuedId,
    };
  });

  let data = JSON.stringify(parsedDrop);

  fs.appendFile(`./data/lowest-id-per-nft.json`, data, function (err: any) {
    if (err) throw err;
    console.log("Saved!");
  });
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
