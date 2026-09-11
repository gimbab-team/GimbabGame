// 타이머
const GAME_TIME = 60;

function startTimer(elements, state, timeUp) {
  clearInterval(state.timerId);
  state.timeLeft = GAME_TIME;
  elements.timerValue.textContent = state.timeLeft;

  state.timerId = setInterval(() => {
    state.timeLeft--;
    elements.timerValue.textContent = state.timeLeft;
    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      timeUp();
    }
  }, 1000);
}

export { startTimer };
