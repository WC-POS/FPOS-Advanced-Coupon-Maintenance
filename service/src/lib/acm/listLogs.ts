import { FindManyOptions, getConnection } from "typeorm";

import { Log } from "../../models/Log";

function listLogs(options: FindManyOptions<Log>) {
  const acm = getConnection("ACM");
  if (!acm || !acm.isConnected) return [];
  const repo = acm.getRepository(Log);
  return repo.find(options);
}

export default listLogs;
