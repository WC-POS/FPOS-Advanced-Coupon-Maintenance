function generateIDPlaceholder() {
  return `NEW-${Math.floor(Math.random() * 1000).toString()}`;
}

export default generateIDPlaceholder;
