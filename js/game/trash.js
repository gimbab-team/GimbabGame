// 쓰레기통: 도마 위 재료를 버리면 재료비만큼 손해
import { state, updateProfitDisplay } from "./state.js";
import { getBoardIngredients, clearBoard } from "./board.js";
import { getIngredientCost, subtractProfit } from "./orderProfit.js";
import { getIngredientById } from "../../data/ingredients.js";

function discard() {
  if (!state.playing || state.paused) return;
  const board = getBoardIngredients();
  if (board.length === 0) return;

  const ingredientCost = getIngredientCost(board, getIngredientById);
  subtractProfit(state, ingredientCost);
  updateProfitDisplay();
  clearBoard();
}

// 쓰레기통 위에 놓기(drop)
function setupTrash() {
  const trash = document.getElementById("trash-can");

  trash.addEventListener("dragover", (e) => {
    if (!e.dataTransfer.types.includes("text/x-board")) return;
    e.preventDefault();
  });

  trash.addEventListener("drop", (e) => {
    if (!e.dataTransfer.types.includes("text/x-board")) return;
    e.preventDefault();
    discard();
  });
}

export { setupTrash };
