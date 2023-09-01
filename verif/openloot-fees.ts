import { PrismaClient } from "@prisma/client";
import { create } from "domain";
import getItemsFromOpenLoot from "../prisma/seeds/items";

const fs = require("fs");
const { stringify } = require("csv-stringify");

const prisma = new PrismaClient();

let player = "Slurps";

async function main() {
  let nftArchetypeId = "BT0_RopeDemon_Gloves";
  const totalTransfer = await prisma.sale.aggregate({
    _sum: {
      price: true,
    },
  });

  console.log(totalTransfer);
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
