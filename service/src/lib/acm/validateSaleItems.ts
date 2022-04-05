import { CouponRule } from "../../models/CouponRule";
import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import { getConnection } from "typeorm";
import { Log } from "../../models/Log";

async function validateSaleItems(rule: CouponRule, items: SaleItem[]) {
  const acm = getConnection("ACM")
  const logRepo = await acm.getRepository(Log)
  const requiredItemNames = rule.items
    .map((item) => {
      if (item.isRequired) return item.itemName;
    })
    .filter((item) => item !== undefined);
  const validItems = new Array(requiredItemNames.length);
  validItems.fill(false);
  for (const requiredItem of requiredItemNames) {
    let index = items.findIndex((item) => item.itemName === requiredItem);
    if (index !== -1) {
      const logItem = await logRepo.findOne({ fposSaleItemId: items[index].saleItemId, rule: rule.id })
      if (logItem) continue;
      validItems[index] = true;
    }
  }
  return validItems.reduce((prev, current) => prev && current, true);
}

export default validateSaleItems;
