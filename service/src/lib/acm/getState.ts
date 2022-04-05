import { AppState } from "../../models/AppState";
import { getConnection } from "typeorm";

async function getState() {
  const acm = getConnection("ACM");
  if (!acm || !acm.isConnected) return undefined;
  const repo = acm.getRepository(AppState);
  const stateArr = await repo.find({});
  if (!stateArr.length) {
    const state = await repo.save({});
    state.createdAt = new Date(0);
    repo.save(state);
    stateArr.push(state);
  }
  return stateArr[0];
}

export default getState;
