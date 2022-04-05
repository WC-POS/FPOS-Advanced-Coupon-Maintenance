import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import connectACM from "./lib/data/connectACM";
import connectFPOS from "./lib/data/connectFPOS";
import getValidSaleItems from "./lib/acm/getValidSaleItems";
import listCurrentRules from "./lib/acm/listCurrentRules";
import listCurrentSales from "./lib/fpos/listCurrentSales";
import listSaleItems from "./lib/fpos/listSaleItems";
import logOperation from "./lib/acm/logOperation";
import operate from "./lib/acm/operate";
import splitItemsBySeat from "./lib/fpos/splitItemsBySeat";
import updateState from "./lib/acm/updateState";
import validateSaleItems from "./lib/acm/validateSaleItems";

async function main() {
  const acm = await connectACM();
  const fpos = await connectFPOS();
  if (acm && fpos && acm.isConnected && fpos.isConnected) {
    const saleItemRepo = fpos.getRepository(SaleItem);
    const sales = await listCurrentSales();
    const rules = await listCurrentRules();

    for (const sale of sales) {
      const items = await listSaleItems(sale.saleId);
      const seats = splitItemsBySeat(items);

      for (const seat of seats) {
        for (const rule of rules) {
          const isValid = validateSaleItems(rule, seat);

          if (isValid) {
            const validItems = await getValidSaleItems(rule, seat);

            for (const validItem of validItems) {
              const couponItem = rule.items.find(
                (item) => item.itemName === validItem.itemName
              )!;
              logOperation(couponItem, validItem);
              await operate(couponItem, validItem);
              saleItemRepo.save(validItem);
            }
          }
        }
      }
    }
    await updateState();
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(0);
  });
