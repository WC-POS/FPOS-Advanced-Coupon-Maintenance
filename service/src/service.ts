import appName from "./lib/app/name.constant";

const path = require("path");
const service = require("node-windows").Service;

const svc = new service({
  name: "FPOS Advanced Coupon Service",
  description:
    "Simple node service for registering and finding coupon instances built in the FPOS Advanced Coupon Maintenance appication",
  script: path.resolve(__dirname, "index.js"),
  nodeOptions: ["--harmony", "--max_old_space_size=4096"],
  env: {
    name: "USERDATA",
    value: path.join(process.env["USERPROFILE"], "AppData", "Roaming", appName)
  }
});

svc.on("install", () => {
  svc.start();
});

let args = process.argv.slice(2);
if (args.length && args[0].toLowerCase() === "-uninstall") {
  svc.uninstall();
} else {
  svc.install();
}
