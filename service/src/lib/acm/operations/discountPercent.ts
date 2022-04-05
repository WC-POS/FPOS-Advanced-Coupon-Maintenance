function discountPercent(price: number, amount: number) {
  return Math.trunc(price - (price * amount) / 100);
}

export default discountPercent;
