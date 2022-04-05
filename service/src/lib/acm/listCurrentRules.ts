import { LessThanOrEqual, MoreThanOrEqual, getConnection } from "typeorm";
import { formatISO, getUnixTime } from "date-fns";

import { CouponRule } from "../../models/CouponRule";

async function listCurrentRules() {
  const acm = getConnection("ACM");
  if (acm && acm.isConnected) {
    const repo = acm.getRepository(CouponRule);
    const today = formatISO(new Date());
    return repo.find({
      where: {
        isActive: true,
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: ["dailyAvailability", "items"],
    });
  }
  return [];
}

export default listCurrentRules;
