import { SaleItem } from "futurepos-typed-models/dist/SaleItem";

function splitItemsBySeat(items: SaleItem[]) {
  const seats = [[]] as SaleItem[][];
  let currentSeat = 0;
  items.forEach((item) => {
    if (item.itemName && item.itemName !== "") {
      seats[currentSeat].push(item);
    } else {
      currentSeat = item.basePrice;
      seats[currentSeat] = [];
    }
  });
  return seats;
}
export default splitItemsBySeat;
