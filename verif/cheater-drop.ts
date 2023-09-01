import { PrismaClient } from "@prisma/client";
import { dir } from "console";
import { create } from "domain";

const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  let yesterday = new Date(2023, 5, 9);
  let today = new Date(2023, 5, 10);
  const totalTransfer = await prisma.drop.findMany({
    where: {
      AND: [
        {
          date: {
            lt: today,
          },
        },
        {
          date: {
            gt: yesterday,
          },
        },
      ],
    },
    include: {
      nft: {
        include: {
          item: true,
        },
      },
      to: true,
    },
  });

  let parsedDrop = totalTransfer.map((t) => {
    return {
      player: t.toUser,
      date: `${new Date(t.date).toDateString()} - ${new Date(
        t.date
      ).toLocaleTimeString()} UTC`,
      nft: t.nft?.item?.name,
      rarity: t.nft?.item?.rarityName,
      id: `#${t.nft?.issuedId}`,
      floorPrice: `${t.nft?.item?.floorPrice}`,
      nftImageUrl: `${t.nft?.item?.imageUrl}`,
    };
  });

  dir(parsedDrop);

  let data = JSON.stringify(parsedDrop);
  fs.appendFile(
    `./data/drop-${yesterday.getMonth() + 1}-${yesterday.getDate()}.json`,
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
