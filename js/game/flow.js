// 게임 진행: 영업 시작 / 일시정지 / 종료
import { state, elements, updateProfitDisplay } from "./state.js";
import { startTimer } from "./timer.js";
import { renderCustomers } from "./customers.js";

// 배경 음악 설정
const playBGM = new Audio("../assets/sounds/the_mountain-children-522447.mp3");
playBGM.loop = true; // true = 반복재생, false = 한 번만 실행
playBGM.volume = 0.08;

function startGame() {
  state.profit = 0;
  state.totalSales = 0;
  state.totalIngredientCost = 0;
  state.happyCount = 0;
  state.angryCount = 0;

  updateProfitDisplay();
  renderCustomers();
  startTimer(elements, state, endGame);
}

// 랭킹 페이지
function endGame() {
  sessionStorage.setItem("finalProfit", state.profit);
  sessionStorage.setItem("happyCount", state.happyCount);
  sessionStorage.setItem("angryCount", state.angryCount);
  location.href = "endgame.html";
}

// 영업 시작 버튼: 오버레이를 닫고 바로 게임 시작
function openShop() {
  elements.readyOverlay.classList.add("hidden");
  state.playing = true;
  playBGM.play();
  startGame();
}

// 일시정지 / 계속하기
function pauseGame() {
  if (!state.playing) return;
  clearInterval(state.timerId);
  state.paused = true;
  playBGM.pause();
  elements.pauseOverlay.classList.remove("hidden");
}

function resumeGame() {
  elements.pauseOverlay.classList.add("hidden");
  state.paused = false;
  playBGM.play();
  startTimer(elements, state, endGame, false);
}

// 오버레이 버튼 연결
function setupFlow() {
  elements.readyBtn.addEventListener("click", openShop);
  elements.pauseBtn.addEventListener("click", pauseGame);
  elements.resumeBtn.addEventListener("click", resumeGame);
  elements.restartBtn.addEventListener("click", () => location.reload());
  elements.homeBtn.addEventListener(
    "click",
    () => (location.href = "startgame.html"),
  );
}

export { setupFlow };
