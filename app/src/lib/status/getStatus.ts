import getConfig from "../config/getConfig";
import { getConnection } from "typeorm";

async function getStatus(name: StatusInfo["name"]): Promise<StatusInfo> {
  const config = await getConfig();
  try {
    const conn = getConnection(name);
    return {
      connected: conn.isConnected,
      name,
      database: config.fposDB,
      host: config.SQL.host,
    };
  } catch (err) {
    console.log(err);
    return {
      connected: false,
      name,
      database: config.fposDB,
      host: config.SQL.host,
    };
  }
}

export default getStatus;
