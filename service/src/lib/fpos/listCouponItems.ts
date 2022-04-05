import { CouponItem } from "../../models/CouponItem";
import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";

async function listCouponItems(rule: CouponRule) {
  const acm = getConnection("ACM");
  if (acm && acm.isConnected) return [];
  const repo = acm.getRepository(CouponItem);
  return repo.find({ couponRule: rule });
}

export default listCouponItems;
