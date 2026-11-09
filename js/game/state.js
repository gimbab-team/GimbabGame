// 게임 화면 공통: 상태, 화면 요소
const state = {
  profit: 0,
  totalSales: 0,
  totalIngredientCost: 0,
  happyCount: 0, // 만족해서 떠난 손님 수
  angryCount: 0, // 화나서 떠난 손님 수
  timeLeft: 0,
  timerId: null,
  playing: false,
  paused: false,
  slots: [], // { el, order, elapsed, leaving }
};

const elements = {
  profitValue: document.getElementById("profit-value"),
  timerValue: document.getElementById("timer-value"),
  readyOverlay: document.getElementById("ready-overlay"),
  pauseOverlay: document.getElementById("pause-overlay"),
  customerSlots: document.getElementById("customer-slots"),
  readyBtn: document.getElementById("ready-btn"),
  pauseBtn: document.getElementById("pause-btn"),
  resumeBtn: document.getElementById("resume-btn"),
  restartBtn: document.getElementById("restart-btn"),
  homeBtn: document.getElementById("home-btn"),
};

function updateProfitDisplay() {
  elements.profitValue.textContent = state.profit.toLocaleString();
}

export { state, elements, updateProfitDisplay };
