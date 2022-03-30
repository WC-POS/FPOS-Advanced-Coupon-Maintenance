import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponItem } from "../../models/CouponItem";
import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";

async function deleteRule(id: string) {
  const conn = getConnection("ACM");
  if (!conn || !conn.isConnected) return undefined;

  const ruleRepo = conn.getRepository(CouponRule);
  const rule = await ruleRepo.findOne({ id });
  if (!rule) return undefined;

  const dailyRepo = conn.getRepository(CouponDailyAvailability);
  const itemRepo = conn.getRepository(CouponItem);

  await dailyRepo.delete({ couponRule: rule });
  await itemRepo.delete({ couponRule: rule });
  await ruleRepo.remove([rule]);
  return rule;
}

export default deleteRule;
