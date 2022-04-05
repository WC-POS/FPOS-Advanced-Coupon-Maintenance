import { createConnection } from "typeorm";
import disconnect from "./disconnect";
import { entities } from "futurepos-typed-models";
import getConfig from "../config/getConfig";

async function connectFPOS() {
  const config = await getConfig();
  const splitHost = config.SQL.host.split("\\");
  await disconnect("FPOS");
  try {
    const connection = await createConnection({
      name: "FPOS",
      type: "mssql",
      host: config.SQL.host,
      username: config.SQL.user,
      password: config.SQL.password,
      database: config.fposDB,
      entities: entities,
      port: 1433,
      synchronize: false,
      extra: {
        encrypt: false,
        instanceName: splitHost.length > 1 ? splitHost[1] : undefined,
      },
    });
    return connection;
  } catch (err) {
    console.log(err);
  }
}

export default connectFPOS;
