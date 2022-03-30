import { FindManyOptions, getConnection } from "typeorm";

import { Item } from "futurepos-typed-models/dist/Item";

async function findItems(options: FindManyOptions<Item>) {
  const conn = getConnection("FPOS");
  if (!conn.isConnected) return [];
  const repo = conn.getRepository(Item);
  const items = await repo.find(options);
  return items;
}

export default findItems;
