import { CouponRule } from "../../models/CouponRule";
import { In } from "typeorm";
import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import listLogs from "./listLogs";

async function getValidSaleItems(rule: CouponRule, items: SaleItem[]) {
  let itemsCopy = [...items];
  const logSaleItemIds = (
    await listLogs({
      where: {
        fposSaleItemId: In(items.map((item) => item.saleItemId)),
      },
    })
  ).map((item) => item.fposSaleItemId);
  itemsCopy = itemsCopy.filter(
    (item) => !logSaleItemIds.includes(item.saleItemId)
  );
  const validItems = [] as SaleItem[];
  rule.items.forEach((couponItem) => {
    const index = itemsCopy.findIndex(
      (item) => item.itemName === couponItem.itemName
    );
    if (index !== -1) validItems.push(itemsCopy[index]);
  });
  return validItems;
}

export default getValidSaleItems;
