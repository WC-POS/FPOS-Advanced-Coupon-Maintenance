import CryptoJS from "crypto-js";
import getMAC from "getmac";

function decryptConfig(config: SettingsConfig) {
  if (!config.encrypted) return config;
  return {
    ...config,
    SQL: {
      ...config.SQL,
      password: CryptoJS.AES.decrypt(config.SQL.password, getMAC()).toString(
        CryptoJS.enc.Utf8
      ),
    },
    encrypted: false,
  };
}

export default decryptConfig;
