import { CouponItem } from "../../models/CouponItem";
import { getConnection } from "typeorm";
import { CouponRule } from "../../models/CouponRule";

async function listItems(rule: CouponRule) {
    const acm = getConnection("ACM")
    if (!acm || !acm.isConnected) return []
    const repo = acm.getRepository(CouponItem)
    return repo.find({ couponRule: rule })
}

export default listItems;