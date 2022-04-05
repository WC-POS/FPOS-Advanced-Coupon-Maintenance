import { getConnection } from "typeorm";
import { CouponRule } from "../../models/CouponRule";

async function getRule(id: string) {
    const acm = getConnection("ACM")
    const repo = acm.getRepository(CouponRule)
    return repo.findOne({ where: { id }, relations: ["dailyAvailability", "items"] })
} 

export default getRule;