import { Log } from "../../models/Log";
import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import { getConnection } from "typeorm";

async function updateLog(saleItem: SaleItem, log?: Log) {
    const acm = getConnection("ACM")
    const repo = acm.getRepository(Log)
    if (log) {
        log.alteredPrice = saleItem.actualPrice
        return repo.save(log)
    }
    return log
}

export default updateLog;