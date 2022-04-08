import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponRule } from "../../models/CouponRule";

function getScheduleStartTime(schedule: CouponDailyAvailability) {
  return schedule.startHour + schedule.startMinute;
}

function getScheduleEndTime(schedule: CouponDailyAvailability) {
  return schedule.endHour + schedule.endMinute;
}

function validateRuleSchedule(rule: CouponRule) {
  if (rule.dailyAvailability) {
    const today = new Date();
    const day = today.getDay();
    const time = today.getHours() + today.getMinutes();
    const todayAvailability = rule.dailyAvailability.find(
      (avail) =>
        avail.dayIndex === day &&
        getScheduleStartTime(avail) < time &&
        getScheduleEndTime(avail) > time
    );
    if (todayAvailability) return todayAvailability;
    return false;
  }
  return false;
}

export default validateRuleSchedule;
