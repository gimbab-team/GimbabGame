// =======================================================
// 화면 전환 (구조 단계 - 게임 로직/드래그앤드롭/Supabase는 이후 단계에서 구현)
// =======================================================

const screens = {
  main: document.getElementById("mainScreen"),
  nickname: document.getElementById("nicknameModal"),
  start: document.getElementById("startModal"),
  howToPlay: document.getElementById("howToPlayModal"),
  gameOver: document.getElementById("gameOverModal"),
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

// 시작 시 닉네임 입력 화면부터 표시
showScreen("nickname");

document.getElementById("nicknameStartBtn").addEventListener("click", () => {
  showScreen("start");
});

document.getElementById("howToPlayBtn").addEventListener("click", () => {
  showScreen("howToPlay");
});

document.getElementById("howToPlayCloseBtn").addEventListener("click", () => {
  showScreen("main");
});

document.getElementById("gameStartBtn").addEventListener("click", () => {
  showScreen("main");
});

document.getElementById("restartBtn").addEventListener("click", () => {
  showScreen("start");
});
