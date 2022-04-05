import { AppState } from "../../models/AppState";
import { getConnection } from "typeorm";

async function updateState() {
  const acm = getConnection("ACM");
  if (acm && acm.isConnected) {
    const repo = acm.getRepository(AppState);
    repo.delete({});
    const state = await repo.save({});
    return state;
  }
  return undefined;
}

export default updateState;
