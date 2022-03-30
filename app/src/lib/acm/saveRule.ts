import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponItem } from "../../models/CouponItem";
import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";
import { v4 } from "uuid";

async function saveRule(
  ruleObj: CouponRule,
  itemsArr: CouponItem[],
  dailyAvailabilityArr: CouponDailyAvailability[]
) {
  const conn = getConnection("ACM");
  if (!conn || !conn.isConnected) return undefined;

  const ruleRepo = conn.getRepository(CouponRule);
  const rule = await ruleRepo.findOne({ id: ruleObj.id });
  if (!rule) return undefined;

  const dailyRepo = conn.getRepository(CouponDailyAvailability);
  const itemRepo = conn.getRepository(CouponItem);
  await dailyRepo.delete({ couponRule: rule });
  await itemRepo.delete({ couponRule: rule });

  const newRule = await ruleRepo.save({
    ...ruleObj,
    items: [],
    dailyAvailability: [],
  });
  dailyRepo.insert(
    dailyAvailabilityArr.map((day) => ({
      ...day,
      id: v4(),
      couponRule: newRule,
    }))
  );
  itemRepo.insert(
    itemsArr.map((item) => ({ ...item, id: v4(), rule: newRule }))
  );
  return ruleRepo.findOne(
    { id: newRule.id },
    { relations: ["dailyAvailability", "items"] }
  );
}

export default saveRule;
