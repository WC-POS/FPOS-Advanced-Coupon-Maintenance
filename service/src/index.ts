import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import connectACM from "./lib/data/connectACM";
import connectFPOS from "./lib/data/connectFPOS";
import getState from "./lib/acm/getState";
import getValidSaleItems from "./lib/acm/getValidSaleItems";
import listCurrentRules from "./lib/acm/listCurrentRules";
import listCurrentSales from "./lib/fpos/listCurrentSales";
import listSaleItems from "./lib/fpos/listSaleItems";
import logOperation from "./lib/acm/logOperation";
import operate from "./lib/acm/operate";
import splitItemsBySeat from "./lib/fpos/splitItemsBySeat";
import updateLog from "./lib/acm/updateLog";
import updateState from "./lib/acm/updateState";
import validateSaleItems from "./lib/acm/validateSaleItems";
import { formatISO } from "date-fns";

async function main() {
  const acm = await connectACM();
  const fpos = await connectFPOS();
  if (acm && fpos && acm.isConnected && fpos.isConnected) {
    await getState();
    const saleItemRepo = fpos.getRepository(SaleItem);
    const sales = await listCurrentSales();
    const rules = await listCurrentRules();

    for (const sale of sales) {
	  console.log(`[${formatISO(new Date())}] Scanning Check: ${sale.checkNumber}`)
      const items = await listSaleItems(sale.saleId);
      const seats = splitItemsBySeat(items);

      for (const seat of seats) {
        for (const rule of rules) {
          const isValid = await validateSaleItems(rule, seat ? seat : []);

          if (isValid) {
			console.log(`[${formatISO(new Date())}] Applying Rule: ${rule.name} (${rule.id})`)
            const validItems = await getValidSaleItems(rule, seat);
            for (const validItem of validItems) {
              const couponItem = rule.items.find(
                (item) => item.itemName === validItem.itemName
              )!;
              const log = await logOperation(couponItem, validItem, rule);
              const newSaleItem = await saleItemRepo.save({
                ...(await operate(couponItem, validItem, rule)),
              });
              await updateLog(newSaleItem, log);
            }
          }
        }
      }
    }
    await updateState();
  } else {
    console.log("Could not connect to databases");
  }
}

setInterval(async () => {
  try {
    main();
	console.log(`[${formatISO(new Date())}] Scan Complete`)
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}, 30000);
