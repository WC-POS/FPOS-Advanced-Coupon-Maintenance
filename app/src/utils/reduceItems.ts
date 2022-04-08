import { Item } from "futurepos-typed-models/dist/Item";

function reduceItems(items: Item[]) {
  return items.reduce((prev, current) => {
    if (prev.length && prev[prev.length - 1].name === current.department) {
      prev[prev.length - 1].items.push({
        name: current.itemName,
        description: current.itemDescription,
        department: current.department,
      });
    } else if (current.department === "") {
      return prev;
    } else {
      prev.push({ name: current.department, items: [] });
    }
    return prev;
  }, [] as SimpleDepartment[]);
}

export default reduceItems;
