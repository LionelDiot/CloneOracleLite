import { PrismaClient } from "@prisma/client";
import { create } from "domain";
import getItemsFromOpenLoot from "../prisma/seeds/items";

const fs = require("fs");
const { stringify } = require("csv-stringify");

const prisma = new PrismaClient();

let player = "Hilas";

async function main() {
  const totalTransfer = await prisma.nFT.findMany({
    where: {
      ownerName: player,
    },
    include: {
      item: true,
      drops: true,
    },
  });

  let parsedDrop = totalTransfer.map((d) => {
    return {
      player: d.ownerName,
      id: d.issuedId,
      nft: d.item?.name,
      floorPrice: d.item?.floorPrice,
      dropDate: d.drops.length ? d.drops[0].date : "",
      youDroppedIt: d.drops.length ? d.drops[0].toUser == player : "",
    };
  });

  let data = JSON.stringify(parsedDrop);

  fs.appendFile(`./data/nft-of-${player}.json`, data, function (err: any) {
    if (err) throw err;
    console.log("Saved!");
  });

  //   const filename = "saved_from_db.csv";
  // const writableStream = fs.createWriteStream(filename);
  // totalTransfer[0].
  // const columns = [
  //   "player",
  //   "id",
  //   "nft",
  // ];
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
