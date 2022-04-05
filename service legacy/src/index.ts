import {
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  createConnection,
  getConnection,
} from "typeorm";

import { CouponDailyAvailability } from "./models/ACM/CouponDailyAvailability";
import { CouponItem } from "./models/ACM/CouponItem";
import { CouponRule } from "./models/ACM/CouponRule";
import CryptoJS from "crypto-js";
import { Sale } from "./models/FPOS/Sale";
import { SaleItem } from "./models/FPOS/SaleItem";
import fs from "fs";
import getMac from "getmac";
import path from "path";

interface SettingsConfig {
  SQL: {
    host: string;
    user: string;
    password: string;
  };
  appDB: string;
  fposDB: string;
}

async function getConfig() {
  const filepath = path.resolve(__dirname, "..", "config.json");
  try {
    const data = await fs.promises.readFile(filepath);
    const config = {
      ...JSON.parse(data.toString()),
    } as SettingsConfig;
    config.SQL.password = CryptoJS.AES.decrypt(
      config.SQL.password,
      getMac()
    ).toString(CryptoJS.enc.Utf8);
    return config;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

async function disconnect(name: "FPOS" | "ACM") {
  try {
    const connection = getConnection(name);
    if (connection.isConnected) {
      await connection.close();
    }
  } catch (err) {}
}

async function connect() {
  const config = await getConfig();
  if (config) {
    const fposEntities = path
      .join(__dirname, "models", "FPOS", "*.js")
      .toString();
    const acmEntities = path
      .join(__dirname, "models", "ACM", "*.js")
      .toString();
    await disconnect("FPOS");
    await disconnect("ACM");
    try {
      await createConnection({
        name: "FPOS",
        type: "mssql",
        host: config.SQL.host,
        username: config.SQL.user,
        password: config.SQL.password,
        database: config.fposDB,
        entities: [fposEntities],
        port: 1433,
        extra: {
          encrypt: false,
          instanceName: config.SQL.host.split("\\")[1],
        },
        synchronize: false,
      });
      await createConnection({
        name: "ACM",
        type: "mssql",
        host: config.SQL.host,
        username: config.SQL.user,
        password: config.SQL.password,
        database: config.appDB,
        entities: [acmEntities],
        port: 1433,
        extra: {
          encrypt: false,
          instanceName: config.SQL.host.split("\\")[1],
        },
        synchronize: true,
      });
      return true;
    } catch (err) {
      console.log("Could not connect to databases");
      return false;
    }
  } else {
    throw new Error("Could not find configuration file.");
  }
}

function sleep(val: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, val);
  });
}

async function main() {
  const acm = getConnection("ACM");
  const fpos = getConnection("FPOS");

  const availRepo = acm.getRepository(CouponDailyAvailability);
  const itemRepo = acm.getRepository(CouponItem);
  const ruleRepo = acm.getRepository(CouponRule);
  const saleRepo = fpos.getRepository(Sale);
  const saleItemRepo = fpos.getRepository(SaleItem);

  const today = new Date();
  const rules = await ruleRepo.find({
    isActive: true,
    startDate: LessThanOrEqual(today),
    endDate: MoreThanOrEqual(today),
  });

  const sales = await saleRepo.find({ endDate: null });
  for (const sale of sales) {
    const items = await saleItemRepo.find({ saleId: sale.saleId });
    sale.saleItems = items.sort(
      (item1, item2) => item1.itemIndex - item2.itemIndex
    );
  }

  rules.map((rule) => console.log(rule.name));

  for (const rule of rules) {
    console.log(rule.name);
    const currentDay = today.getDay();
    const currentHour = today.getHours();

    const availability = await availRepo.findOne({
      couponRule: rule,
      dayIndex: currentDay,
      isActive: true,
      startHour: LessThanOrEqual(currentHour),
      endHour: MoreThanOrEqual(currentHour),
    });
    if (availability) {
      if (
        (availability.startHour === currentHour &&
          availability.startMinute > today.getMinutes()) ||
        (availability.endHour === currentHour &&
          availability.endMinute < today.getMinutes())
      )
        continue;
      const optionalItems = await itemRepo.find({
        couponRule: rule,
        isRequired: false,
      });
      const requiredItems = await itemRepo.find({
        couponRule: rule,
        isRequired: true,
      });
      const optionalItemNames = optionalItems.map((item) => item.itemName);
      const requiredItemNames = requiredItems.map((item) => item.itemName);

      for (const sale of sales) {
        console.log(sale.checkNumber);
        interface SeatInfo {
          saleItemId: string;
          itemName: string;
        }
        const seats: SeatInfo[][] = [];
        let currentIndex = 0;

        sale.saleItems.forEach((saleItem) => {
          if (saleItem.itemName && saleItem.itemName !== "") {
            seats[currentIndex].push({
              saleItemId: saleItem.saleItemId,
              itemName: saleItem.itemName,
            });
          } else {
            currentIndex = saleItem.basePrice;
            seats[currentIndex] = [];
          }
        });

        for (const seat of seats) {
          if (seat) {
            let isValid = true;
            requiredItemNames.forEach((reqItem) => {
              isValid =
                isValid &&
                Boolean(
                  seat.filter((saleItem) => saleItem.itemName === reqItem)
                    .length
                );
            });

            if (isValid) {
              for (const saleItem of seat) {
                const itemRule = await itemRepo.findOne({
                  couponRule: rule,
                  itemName: saleItem.itemName,
                });
                const item = await saleItemRepo.findOne({
                  saleItemId: saleItem.saleItemId,
                });
                if (itemRule && item) {
                  switch (itemRule.operation) {
                    case "discount-flat":
                      console.log("discount-flat");
                      item.actualPrice = Math.max(
                        item.actualPrice - itemRule.amount * 100,
                        0
                      );
                      item.taxablePrice = Math.max(
                        item.taxablePrice - itemRule.amount * 100,
                        0
                      );
                      item.basePrice = Math.max(
                        item.basePrice - itemRule.amount * 100,
                        0
                      );
                      break;
                    case "discount-percent":
                      console.log("discount-percent");
                      item.actualPrice = Math.trunc(
                        item.actualPrice -
                          (item.actualPrice * itemRule.amount) / 100
                      );
                      item.basePrice = Math.trunc(
                        item.basePrice -
                          (item.basePrice * itemRule.amount) / 100
                      );
                      item.taxablePrice = Math.trunc(
                        item.taxablePrice -
                          (item.taxablePrice * itemRule.amount) / 100
                      );
                      break;
                    case "price-change":
                      console.log("price-change");
                      item.actualPrice = itemRule.amount * 100;
                      item.basePrice = itemRule.amount * 100;
                      item.taxablePrice = itemRule.amount * 100;
                      break;
                    case "price-increase":
                      console.log("price-increase");
                      item.actualPrice =
                        item.actualPrice + itemRule.amount * 100;
                      item.basePrice = item.basePrice + itemRule.amount * 100;
                      item.taxablePrice =
                        item.taxablePrice + itemRule.amount * 100;
                      break;
                  }
                  if (
                    rule.receiptName &&
                    item.receiptDescription &&
                    !item.receiptDescription.includes(rule.receiptName)
                  ) {
                    item.receiptDescription =
                      `**${rule.receiptName}-${item.receiptDescription}`.slice(
                        0,
                        16
                      );
                  }
                  await saleItemRepo.save({ ...item });
                }

                console.log(itemRule);
              }
            }
          }
        }
      }
    }
  }
}

connect()
  .then(async (status) => {
    if (status) {
      await main();
    }
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
