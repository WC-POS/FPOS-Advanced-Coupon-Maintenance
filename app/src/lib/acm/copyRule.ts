import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponItem } from "../../models/CouponItem";
import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";
import { v4 } from "uuid";

async function copyRule(id: string) {
  const conn = getConnection("ACM");
  if (!conn || !conn.isConnected) return undefined;

  const ruleRepo = conn.getRepository(CouponRule);
  const rule = await ruleRepo.findOne({ id });
  if (!rule) return undefined;

  const dailyRepo = conn.getRepository(CouponDailyAvailability);
  const itemRepo = conn.getRepository(CouponItem);
  const availability = await dailyRepo.find({ couponRule: rule });
  const items = await itemRepo.find({ couponRule: rule });
  let newRule = await ruleRepo.save({
    ...rule,
    id: v4(),
    items: [],
    dailyAvailability: [],
  });
  dailyRepo.insert(
    availability.map((day) => ({ ...day, id: v4(), couponRule: newRule }))
  );
  itemRepo.insert(
    items.map((item) => ({ ...item, id: v4(), couponRule: newRule }))
  );
  newRule = await ruleRepo.findOne(
    { id: newRule.id },
    { relations: ["dailyAvailability", "items"] }
  );
  return newRule;
}

export default copyRule;
