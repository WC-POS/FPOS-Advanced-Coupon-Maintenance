import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponItem } from "../../models/CouponItem";
import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";
import { v4 } from "uuid";

async function saveRule(
  rule: CouponRule,
  itemsArr: CouponItem[],
  dailyAvailabilityArr: CouponDailyAvailability[]
) {
  console.log(dailyAvailabilityArr);
  const conn = getConnection("ACM");
  if (!conn || !conn.isConnected) return undefined;

  const ruleRepo = conn.getRepository(CouponRule);
  if (!rule) return undefined;

  const dailyRepo = conn.getRepository(CouponDailyAvailability);
  const itemRepo = conn.getRepository(CouponItem);
  await dailyRepo.delete({ couponRule: rule });
  await itemRepo.delete({ couponRule: rule });

  const newRule = await ruleRepo.save(rule);
  await dailyRepo.insert(
    dailyAvailabilityArr.map((day) => ({
      ...day,
      id: v4(),
      couponRule: newRule,
    }))
  );
  await itemRepo.insert(
    itemsArr.map((item) => ({ ...item, id: v4(), rule: newRule }))
  );
  return ruleRepo.findOne(
    { id: newRule.id },
    { relations: ["dailyAvailability", "items"] }
  );
}

export default saveRule;
