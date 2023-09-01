import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const totalTransfer = await prisma.nFT.groupBy({
    by: ["ownerName"],
    _count: {
      _all: true,
    },
  });

  // let parsedDrop = totalTransfer.map((d) => {
  //   return {
  //     id: d.issuedId,
  //     date: d.drops[0].date,
  //     player: d.drops[0].toUser,
  //   };
  // });

  let data = JSON.stringify(totalTransfer);

  fs.appendFile(`./data/bestnftowner.json`, data, function (err: any) {
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
