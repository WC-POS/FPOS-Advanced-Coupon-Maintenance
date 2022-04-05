import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponItem } from "../../models/CouponItem";
import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";
import { v4 } from "uuid";

async function createRule(
  ruleObj: CouponRule,
  itemsArr: CouponItem[],
  dailyAvailabilityArr: CouponDailyAvailability[]
) {
  const conn = getConnection("ACM");
  if (!conn.isConnected) return undefined;
  const dailyRepo = conn.getRepository(CouponDailyAvailability);
  const itemRepo = conn.getRepository(CouponItem);
  const ruleRepo = conn.getRepository(CouponRule);

  const rule = await ruleRepo.save({
    ...ruleObj,
    id: v4(),
    items: [],
    dailyAvaibility: [],
  });

  await dailyRepo.insert(
    dailyAvailabilityArr.map((day) => ({
      ...day,
      couponRule: rule,
    }))
  );
  await itemRepo.insert(itemsArr.map((item) => ({ ...item, rule })));
  return ruleRepo.findOne(
    {
      id: rule.id,
    },
    { relations: ["dailyAvailability", "items"] }
  );
}

export default createRule;
