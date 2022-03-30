import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponItem } from "../../models/CouponItem";
import { CouponRule } from "../../models/CouponRule";
import { app } from "electron";
import { createConnection } from "typeorm";
import disconnect from "./disconnect";
import getConfig from "../config/getConfig";
import path from "path";
import sendStatus from "../status/sendStatus";

async function connectACM() {
  const config = await getConfig();
  const dbPath = path.join(app.getPath("userData"), `${config.appDB}.sqlite`);
  await disconnect("ACM");
  try {
    const connection = await createConnection({
      name: "ACM",
      type: "better-sqlite3",
      database: dbPath,
      entities: [CouponDailyAvailability, CouponItem, CouponRule],
      synchronize: true,
    });
    sendStatus({
      connected: connection.isConnected,
      name: "ACM",
      database: connection.options.database as string,
      host: dbPath,
    });
  } catch (err) {
    console.log(err);
  }
}

export default connectACM;
