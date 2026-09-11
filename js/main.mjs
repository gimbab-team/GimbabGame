// 게임 화면
import { ingredients, getIngredientById } from "../data/ingredients.js";
import { createRandomOrder } from "./randomOrder.js";
import { counterSubmit, addProfit, subtractProfit } from "./orderProfit.js";
import { trashCan } from "./trashCan.js";
import {
  renderIngredientList,
  renderBoard,
  setupDragAndDrop,
} from "./dragDrop.js";
import { startTimer } from "./timer.js";

const state = {
  profit: 0,
  totalSales: 0,
  totalIngredientCost: 0,
  timeLeft: 0,
  timerId: null,
  board: [],
  currentOrder: null,
};

const elements = {
  profitValue: document.getElementById("profit-value"),
  timerValue: document.getElementById("timer-value"),
  customerImage: document.getElementById("customer-image"),
  orderText: document.getElementById("order-text"),
  orderIngredients: document.getElementById("order-ingredients"),
  ingredientList: document.getElementById("ingredient-list"),
  baseIngredients: document.getElementById("base-ingredients"),
  cuttingBoard: document.getElementById("cutting-board"),
  boardItems: document.querySelector("#cutting-board .board-items"),
  counter: document.getElementById("counter"),
  trashCan: document.getElementById("trash-can"),
};

function updateProfitDisplay() {
  elements.profitValue.textContent = state.profit.toLocaleString();
}

// 카운터
function submitOrder() {
  if (state.board.length === 0 || !state.currentOrder) return;
  const { profitGain, ingredientCost } = counterSubmit(
    state.currentOrder,
    state.board,
    getIngredientById,
  );
  addProfit(state, profitGain, ingredientCost);
  updateProfitDisplay();

  state.board = [];
  renderBoard(elements, state);
  nextOrder();
}

// 쓰레기통
function handleDiscard() {
  if (state.board.length === 0) return;
  const ingredientCost = trashCan(state.board, getIngredientById);
  subtractProfit(state, ingredientCost);
  updateProfitDisplay();

  state.board = [];
  renderBoard(elements, state);
}

setupDragAndDrop(elements, state, {
  onSubmit: submitOrder,
  onDiscard: handleDiscard,
});

// 손님, 주문
function renderOrder() {
  const order = state.currentOrder;
  elements.customerImage.src = order.customer.image;
  elements.customerImage.alt = order.customer.name;
  elements.orderText.textContent = order.text;
  elements.orderIngredients.textContent = order.ingredientText;
}

function nextOrder() {
  state.currentOrder = createRandomOrder();
  renderOrder();
}

// 게임 시작/종료
function startGame() {
  state.profit = 0;
  state.totalSales = 0;
  state.totalIngredientCost = 0;
  state.board = [];

  updateProfitDisplay();
  renderBoard(elements, state);
  nextOrder();
  startTimer(elements, state, endGame);
}

// 랭킹 페이지
function endGame() {
  // 수익 임시 저장(supabase 연결)
  sessionStorage.setItem("finalProfit", state.profit);
  location.href = "endgame.html";
}

// 초기화
renderIngredientList(elements, ingredients);
startGame();
