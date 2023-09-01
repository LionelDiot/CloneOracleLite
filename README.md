# openloot-oracle

## version 18 de node

`nvm use 18`

## fichier .env

copier le contenue du fichier `.env.example` dans un fichier `.env`

## Ouvrir l'explorateur de base de donnes

npx prisma studio

## Synchroniser la base donnee

1 - npx ts-node prisma/seeds/transferHistory.ts

2 - npx ts-node prisma/seeds/salesHistory.ts

3 - npx ts-node prisma/seeds/processSales.ts
