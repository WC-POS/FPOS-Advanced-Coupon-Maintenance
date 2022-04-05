import { CouponRule } from "../../models/CouponRule";
import { SaleItem } from "futurepos-typed-models/dist/SaleItem";

function validateSaleItems(rule: CouponRule, items: SaleItem[]) {
  const requiredItemNames = rule.items
    .map((item) => {
      if (item.isRequired) return item.itemName;
    })
    .filter((item) => item !== undefined);
  const validItems = new Array(requiredItemNames.length);
  validItems.fill(false);
  [...requiredItemNames].forEach((ruleItem) => {
    const index = items.findIndex((item) => item.itemName === ruleItem);
    if (index !== -1) validItems[index] = true;
  });
  return validItems.reduce((prev, current) => prev && current, true);
}

export default validateSaleItems;
