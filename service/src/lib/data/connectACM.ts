import { AppState } from "../../models/AppState";
import { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import { CouponItem } from "../../models/CouponItem";
import { CouponRule } from "../../models/CouponRule";
import { Log } from "../../models/Log";
import { createConnection } from "typeorm";
import disconnect from "./disconnect";
import getConfig from "../config/getConfig";
import getUserDataPath from "../app/getUserDataPath";
import path from "path";

async function connectACM() {
  const config = await getConfig();
  const dbPath = path.join(getUserDataPath(), `${config.appDB}.sqlite`);
  await disconnect("ACM");
  try {
    const conn = await createConnection({
      name: "ACM",
      type: "better-sqlite3",
      database: dbPath,
      entities: [
        AppState,
        CouponDailyAvailability,
        CouponItem,
        CouponRule,
        Log,
      ],
      synchronize: true,
    });
    return conn;
  } catch (err) {
    console.log(err);
  }
}

export default connectACM;
