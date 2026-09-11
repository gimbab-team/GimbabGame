// 쓰레기통
import { getIngredientCost } from "./orderProfit.js";

function trashCan(board, getIngredientById) {
  return getIngredientCost(board, getIngredientById);
}

export { trashCan };
