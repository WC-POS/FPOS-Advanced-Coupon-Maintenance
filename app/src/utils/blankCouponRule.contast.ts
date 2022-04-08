import { add, formatISO } from "date-fns";

import type { CouponDailyAvailability } from "../models/CouponDailyAvailability";
import type { CouponItem } from "../models/CouponItem";

const blankCouponRule = {
  name: "",
  receiptName: "",
  isActive: true,
  isDiscountExclusive: false,
  maxApplications: -1,
  notes: "",
  startDate: formatISO(new Date()),
  endDate: formatISO(add(new Date(), { months: 1 })),
  dailyAvailability: [] as CouponDailyAvailability[],
  items: [] as CouponItem[],
};

export default blankCouponRule;
