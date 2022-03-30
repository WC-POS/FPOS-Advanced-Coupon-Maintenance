import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";

async function findRule(id: string) {
  const conn = getConnection("ACM");
  if (!conn || !conn.isConnected) return undefined;

  const repo = conn.getRepository(CouponRule);
  const rule = await repo.findOne(
    { id },
    { relations: ["dailyAvailability", "items"] }
  );
  return rule;
}

export default findRule;
