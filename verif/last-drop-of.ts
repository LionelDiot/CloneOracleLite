import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  let nftArchetypeId = "BT0_Title_AllThatGlitters";
  const totalTransfer = await prisma.nFT.findMany({
    where: {
      archetypeId: nftArchetypeId,
    },
    include: {
      drops: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  let parsedDrop = totalTransfer.map((d) => {
    return {
      id: d.issuedId,
      date: d.drops[0].date,
      player: d.drops[0].toUser,
    };
  });

  let data = JSON.stringify(parsedDrop);

  fs.appendFile(
    `./data/drop-${nftArchetypeId}.json`,
    data,
    function (err: any) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
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
