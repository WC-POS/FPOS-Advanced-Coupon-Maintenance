import { CouponItem } from "../../models/CouponItem";
import { SaleItem } from "futurepos-typed-models/dist/SaleItem";
import discountFlat from "./operations/discountFlat";
import discountPercent from "./operations/discountPercent";
import priceChange from "./operations/priceChange";
import priceIncrease from "./operations/priceIncrease";
import { CouponRule } from "../../models/CouponRule";
import { getConnection } from "typeorm";

async function operate(couponItem: CouponItem, saleItem: SaleItem, rule: CouponRule) {
  switch (couponItem.operation) {
    case "discount-flat":
      saleItem.actualPrice = discountFlat(
        saleItem.actualPrice,
        couponItem.amount
      );
      saleItem.basePrice = discountFlat(saleItem.basePrice, couponItem.amount);
      saleItem.taxablePrice = discountFlat(
        saleItem.taxablePrice,
        couponItem.amount
      );
      break;
    case "discount-percent":
      saleItem.actualPrice = discountPercent(
        saleItem.actualPrice,
        couponItem.amount
      );
      saleItem.basePrice = discountPercent(
        saleItem.basePrice,
        couponItem.amount
      );
      saleItem.taxablePrice = discountPercent(
        saleItem.taxablePrice,
        couponItem.amount
      );
      break;
    case "price-change":
      saleItem.actualPrice = priceChange(couponItem.amount);
      saleItem.basePrice = priceChange(couponItem.amount);
      saleItem.taxablePrice = priceChange(couponItem.amount);
      break;
    case "price-increase":
      saleItem.actualPrice = priceIncrease(
        saleItem.actualPrice,
        couponItem.amount
      );
      saleItem.basePrice = priceIncrease(saleItem.basePrice, couponItem.amount);
      saleItem.taxablePrice = priceIncrease(
        saleItem.taxablePrice,
        couponItem.amount
      );
      break;
  }
  if (rule.receiptName) {
    saleItem.receiptDescription =
    `**${rule.receiptName}-${saleItem.receiptDescription}`.slice(
      0,
      16
    );
  }
  return saleItem;
}

export default operate;
