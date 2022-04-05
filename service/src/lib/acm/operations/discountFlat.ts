function discountFlat(price: number, amount: number) {
  return Math.max(price - amount * 100, 0);
}

export default discountFlat;
