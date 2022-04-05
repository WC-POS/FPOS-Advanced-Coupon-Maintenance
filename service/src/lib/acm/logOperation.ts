import { CouponItem } from "../../models/CouponItem";
import { Log } from "../../models/Log";
import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import { getConnection } from "typeorm";
import { CouponRule } from "../../models/CouponRule";

async function logOperation(couponItem: CouponItem, saleItem: SaleItem, rule: CouponRule) {
  const acm = getConnection("ACM");
  if (!acm || !acm.isConnected) return undefined;
  const repo = acm.getRepository(Log);
  const log = await repo.save({
    fposSaleId: saleItem.saleId,
    fposSaleItemId: saleItem.saleItemId,
    rule: rule.id,
    ruleItem: couponItem.id,
    originalPrice: saleItem.actualPrice,
    alteredPrice: saleItem.actualPrice,
    operationAmount: couponItem.amount,
    operation: couponItem.operation,
  });
  return log;
}

export default logOperation;
