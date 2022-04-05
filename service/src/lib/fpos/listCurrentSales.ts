import { MoreThanOrEqual, getConnection } from "typeorm";

import { AppState } from "../../models/AppState";
import { Sale } from "futurepos-typed-models/dist/Sale";

async function listCurrentSales() {
  const acm = getConnection("ACM");
  const fpos = getConnection("FPOS");
  if (!fpos.isConnected) return [];
  const saleRepo = fpos.getRepository(Sale);
  const stateRepo = acm.getRepository(AppState);
  const appState = (await stateRepo.find({}))[0];
  return saleRepo.find({
    isCancelled: 0,
    isTrainMode: 0,
    endDate: null,
    updateDate: MoreThanOrEqual(appState.createdAt),
  });
}

export default listCurrentSales;
