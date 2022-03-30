import { app } from "electron";
import encryptConfig from "./encryptConfig";
import fs from "fs";
import path from "path";

async function writeConfig(config: SettingsConfig) {
  const filePath = path.join(app.getPath("userData"), "config.json");
  await fs.promises.writeFile(
    filePath,
    JSON.stringify(encryptConfig(config), null, 4)
  );
}

export default writeConfig;
