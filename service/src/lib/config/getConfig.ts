import decryptConfig from "./decryptConfig";
import defaultConfig from "./defaultConfig.constant";
import fs from "fs";
import getUserDataPath from "../app/getUserDataPath";
import path from "path";
import writeConfig from "./writeConfig";

async function getConfig() {
  const filePath = path.join(getUserDataPath(), "config.json");
  let config;
  try {
    const data = (await fs.promises.readFile(filePath)).toString();
    config = decryptConfig(JSON.parse(data) as SettingsConfig);
  } catch (err) {
    console.log(err);
    config = { ...defaultConfig };
    await writeConfig(config);
  }
  return config;
}

export default getConfig;
