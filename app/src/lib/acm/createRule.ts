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

  const itemSavePromises = [] as Promise<CouponItem>[];
  itemsArr.forEach((item) => {
    itemSavePromises.push(
      itemRepo.save({ ...item, id: v4(), couponRule: rule })
    );
  });
  const dailyAvailabilitySavePromises =
    [] as Promise<CouponDailyAvailability>[];
  dailyAvailabilityArr.forEach((day) => {
    dailyAvailabilitySavePromises.push(
      dailyRepo.save({ ...day, id: v4(), couponRule: rule })
    );
  });

  await Promise.all(dailyAvailabilitySavePromises);
  await Promise.all(itemSavePromises);

  return ruleRepo.findOne(
    {
      id: rule.id,
    },
    { relations: ["dailyAvailability", "items"] }
  );
}

export default createRule;
