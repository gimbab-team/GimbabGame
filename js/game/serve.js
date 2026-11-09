// 서빙: 자른 김밥을 손님에게 끌어다 놓으면 주문을 판정한다
import { state, updateProfitDisplay } from "./state.js";
import { getBoardIngredients, clearBoard } from "./board.js";
import { leaveAndReplace } from "./customers.js";
import { counterSubmit, addProfit } from "./orderProfit.js";
import { getIngredientById } from "../../data/ingredients.js";

function serve(slotEl) {
  if (!state.playing || state.paused) return;
  const slot = state.slots.find((s) => s.el === slotEl);
  if (!slot || slot.leaving) return;

  const board = getBoardIngredients();
  if (board.length === 0) return; // 도마에 올린 게 없음

  const { profitGain, ingredientCost } = counterSubmit(
    slot.order,
    board,
    getIngredientById,
  );
  addProfit(state, profitGain, ingredientCost);
  updateProfitDisplay();
  clearBoard();

  leaveAndReplace(slot, profitGain > 0 ? "happy" : "angry", 1300);
}

// 손님(.slot) 위에 놓기(drop)
function setupServe() {
  const slots = document.getElementById("customer-slots");

  slots.addEventListener("dragover", (e) => {
    if (!e.dataTransfer.types.includes("text/x-kimbap")) return;
    e.preventDefault();
  });

  slots.addEventListener("drop", (e) => {
    if (!e.dataTransfer.types.includes("text/x-kimbap")) return;
    e.preventDefault();
    const slotEl = e.target.closest(".slot");
    if (slotEl) serve(slotEl);
  });
}

export { setupServe };
