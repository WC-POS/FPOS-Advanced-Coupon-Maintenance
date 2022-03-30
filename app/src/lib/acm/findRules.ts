import { FindManyOptions, getConnection } from "typeorm";

import { CouponRule } from "../../models/CouponRule";

async function findRules(options: FindManyOptions<CouponRule>) {
  const conn = getConnection("ACM");
  if (!conn || !conn.isConnected) return [];

  const repo = await conn.getRepository(CouponRule);
  const rules = await repo.find(options);
  return rules;
}

export default findRules;
