import { SaleItem } from "futurepos-typed-models/dist/SaleItem";

function splitItemsBySeat(items: SaleItem[]) {
  const seats = [[]] as SaleItem[][];
  let currentSeat = 0;
  items.forEach((item) => {
    if (item.flags !== 4 && item.flags !== 32) {
      seats[currentSeat].push(item);
    } else if (item.flags === 4) {
      currentSeat = item.basePrice;
      seats[currentSeat] = [];
    }
  });
  return seats;
}
export default splitItemsBySeat;
