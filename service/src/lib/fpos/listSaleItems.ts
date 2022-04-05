import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import { getConnection } from "typeorm";

async function listSaleItems(saleId: string) {
  const fpos = getConnection("FPOS");
  if (fpos && fpos.isConnected) {
    const repo = fpos.getRepository(SaleItem);
    return repo.find({
      where: {
        saleId,
      },
      order: {
        itemIndex: "ASC",
      },
    });
  }
  return [];
}

export default listSaleItems;
