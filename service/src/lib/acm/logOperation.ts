import { CouponItem } from "../../models/CouponItem";
import { Log } from "../../models/Log";
import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import { getConnection } from "typeorm";

async function logOperation(couponItem: CouponItem, saleItem: SaleItem) {
  const acm = getConnection("ACM");
  if (!acm || !acm.isConnected) return undefined;
  const repo = acm.getRepository(Log);
  const log = await repo.save({
    fposSaleId: saleItem.saleId,
    fposSaleItemId: saleItem.saleItemId,
    rule: couponItem.couponRule.id,
    ruleItem: couponItem.id,
    originalPrice: saleItem.actualPrice,
    operationAmount: couponItem.amount,
    operation: couponItem.operation,
  });
  return log;
}

export default logOperation;
