import appName from "./name.constant";
import path from "path";

function getUserDataPath() {
  let basePath;
  if (process.platform === "darwin") {
    basePath = path.join(
      process.env.HOME!,
      "Library",
      "Application Support",
      appName
    );
  } else if (process.platform === "win32") {
    basePath = path.join(process.env.APPDATA!, appName);
  }
  return basePath as string;
}

export default getUserDataPath;
