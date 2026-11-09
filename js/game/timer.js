// 타이머
const GAME_TIME = 100;

function startTimer(elements, state, timeUp, reset = true) {
  clearInterval(state.timerId);
  if (reset) state.timeLeft = GAME_TIME;
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
