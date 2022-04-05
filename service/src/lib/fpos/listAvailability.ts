import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";

async function listAvailability(rule: CouponRule) {
  const acm = getConnection("ACM");
  if (acm && acm.isConnected) return [];
  const repo = acm.getRepository(CouponDailyAvailability);
  return repo.find({
    couponRule: rule,
  });
}

export default listAvailability;
