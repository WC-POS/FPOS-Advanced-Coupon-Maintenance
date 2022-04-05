import CryptoJS from "crypto-js";
import getMAC from "getmac";

function encryptConfig(config: SettingsConfig) {
  if (config.encrypted) return config;
  return {
    ...config,
    SQL: {
      ...config.SQL,
      password: CryptoJS.AES.encrypt(config.SQL.password, getMAC()).toString(),
    },
    encrypted: true,
  };
}

export default encryptConfig;
