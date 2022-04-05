import encryptConfig from "./encryptConfig";
import fs from "fs";
import getUserDataPath from "../app/getUserDataPath";
import path from "path";

async function writeConfig(config: SettingsConfig) {
  const filePath = path.join(getUserDataPath(), "config.json");
  await fs.promises.writeFile(
    filePath,
    JSON.stringify(encryptConfig(config), null, 4)
  );
}

export default writeConfig;
