import { getConnection } from "typeorm";
import sendStatus from "../status/sendStatus";

async function disconnect(name: StatusInfo["name"]) {
  try {
    const conn = getConnection(name);
    if (conn.isConnected) {
      await conn.close();
      sendStatus({
        connected: false,
        name,
        database: conn.options.database as string,
        host: "",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

export default disconnect;
