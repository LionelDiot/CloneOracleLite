import { PrismaClient } from "@prisma/client";
import { create } from "domain";
import getItemsFromOpenLoot from "../prisma/seeds/items";
import { dir, log } from "console";

const fs = require("fs");
const { stringify } = require("csv-stringify");

const prisma = new PrismaClient();

async function main() {
  const utiilities = await prisma.item.findMany({
    where: {
      categories: {
        some: {
          name: "Cosmetic",
        },
      },
    },
    select: {
      name: true,
      floorPrice: true,
      _count: {
        select: {
          nfts: true,
        },
      },
    },
  });

  let parsedDrop = utiilities.map((d) => {
    return {
      name: d.name,
      floorprice: d.floorPrice,
      nfts: d._count.nfts,
    };
  });

  let data = JSON.stringify(parsedDrop);

  fs.appendFile(`./data/mc-utilities.json`, data, function (err: any) {
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
