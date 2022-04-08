import { LessThanOrEqual, MoreThanOrEqual, getConnection } from "typeorm";
import { formatISO, getUnixTime } from "date-fns";

import { CouponRule } from "../../models/CouponRule";
import validateRuleSchedule from "./validateRuleSchedule";

async function listCurrentRules() {
  const acm = getConnection("ACM");
  if (acm && acm.isConnected) {
    const repo = acm.getRepository(CouponRule);
    const today = formatISO(new Date());
    const rules = await repo.find({
      where: {
        isActive: true,
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: ["dailyAvailability", "items"],
    });
    return rules.filter((rule) => validateRuleSchedule(rule));
  }
  return [];
}

export default listCurrentRules;
