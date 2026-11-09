// 손님: 입장, 말풍선(주문), 인내심, 퇴장
import { state, elements } from "./state.js";
import { createRandomOrder } from "./randomOrder.js";
import { getIngredientName } from "../../data/ingredients.js";

const PATIENCE_MS = 30000; // 손님이 기다려 주는 시간
const SLOT_COUNT = 1; // 손님은 한 번에 한 명씩

// 손님과 말풍선 그리기
function fillSlot(slot) {
  const order = createRandomOrder();
  slot.order = order;
  slot.elapsed = 0;

  const chips = order.ingredients
    .filter((id) => id !== "gim" && id !== "rice")
    .map((id) => `<span class="chip">${getIngredientName(id)}</span>`)
    .join("");
  // 빼 달라고 한 재료는 빨간 취소선 칩으로 표시
  const noChip = order.excluded
    ? `<span class="chip no">${getIngredientName(order.excluded)}</span>`
    : "";

  slot.el.innerHTML = `
    <div class="customer">
      <img class="peep" src="${order.customer.image}" alt="손님" />
    </div>
    <div class="bubble">
      <p class="say">${order.text}</p>
      <div class="menu-name">${order.menuName}<small>${order.price.toLocaleString()}원</small></div>
      <div class="chips">${chips}${noChip}</div>
      <div class="patience"><div class="fill"></div></div>
    </div>`;
}

function renderCustomers() {
  elements.customerSlots.innerHTML = "";
  state.slots = [];
  for (let i = 0; i < SLOT_COUNT; i++) {
    const el = document.createElement("div");
    el.className = "slot";
    elements.customerSlots.appendChild(el);
    const slot = { el, order: null, elapsed: 0, leaving: false };
    state.slots.push(slot);
    fillSlot(slot);
  }
}

// 손님이 떠나고(기분 모션) 잠시 뒤 새 손님이 온다
function leaveAndReplace(slot, mood, delay) {
  slot.leaving = true;
  if (mood === "happy") state.happyCount++;
  else state.angryCount++;
  slot.el.querySelector(".customer").classList.add(mood);
  slot.el.querySelector(".bubble").classList.add("out");
  setTimeout(() => {
    fillSlot(slot);
    slot.leaving = false;
  }, delay);
}

// 인내심 게이지 감소, 다 닳으면 화내며 떠나고 새 손님이 온다
function tickPatience(ms) {
  state.slots.forEach((slot) => {
    if (slot.leaving) return;
    slot.elapsed += ms;
    const left = Math.max(0, 1 - slot.elapsed / PATIENCE_MS);
    const fill = slot.el.querySelector(".fill");
    fill.style.width = left * 100 + "%";
    fill.classList.toggle("mid", left <= 0.5 && left > 0.25);
    fill.classList.toggle("low", left <= 0.25);

    if (left === 0) leaveAndReplace(slot, "angry", 900);
  });
}

// 게임 중(일시정지 아닐 때)에만 인내심이 줄어든다
function startPatience() {
  setInterval(() => {
    if (state.playing && !state.paused) tickPatience(100);
  }, 100);
}

export { renderCustomers, leaveAndReplace, startPatience };
