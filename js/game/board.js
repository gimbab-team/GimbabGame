// 도마: 김, 밥, 토핑 올리기 / 자르기
// HTML 기본 드래그 앤 드롭(draggable, dragstart, dragover, drop) 사용

const cuttingSound = new Audio(
  "../assets/sounds/freesound_community-cutting-board-chops-scrapes-61998.mp3",
);
cuttingSound.volume = 1;
// cuttingSound.playbackRate = 1.8; // 배속 (1.5~2 사이로 조절)

function playCuttingSound() {
  cuttingSound.currentTime = 2;
  cuttingSound.play();
  setTimeout(() => cuttingSound.pause(), 500);
}

// 도마 위 상태
const boardState = {
  gim: false,
  rice: false,
  rolled: false, // 김밥 말기 완료(더블클릭)
  cut: false, // 자른 김밥 완성
};
const TOPPING_STEP = 11; // 토핑이 아래로 쌓이는 간격(px), 작을수록 많이 겹친다
const TOPPING_WIDTH = 0.8; // 토핑 가로 길이(김 가로 길이 대비)

// 김, 밥, 토핑 드래그
function setupBoardDrag() {
  const toppingList = document.getElementById("topping-list");
  const gimStack = document.getElementById("gim-stack");
  const cooker = document.getElementById("cooker");
  const board = document.getElementById("board");
  const filling = board.querySelector(".filling");

  // 밥솥을 누르면 밥이 나온다: 끌고 다니는 모양을 밥 이미지로
  const riceImg = new Image();
  riceImg.src = "../assets/ingredients/rice.svg";
  riceImg.width = 110;

  // 이 드래그를 도마가 받을 수 있는지
  function canAccept(types) {
    if (boardState.rolled) return false; // 말고 나면 재료를 더 올릴 수 없다
    if (types.includes("text/x-gim")) return !boardState.gim;
    if (types.includes("text/x-rice"))
      return boardState.gim && !boardState.rice;
    if (types.includes("text/plain")) return boardState.rice; // 토핑
    return false;
  }

  // 김 집기
  gimStack.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/x-gim", "gim");
    e.dataTransfer.effectAllowed = "copy";
  });

  // 밥솥 누른 채 끌기 시작: 밥이 딸려 나온다
  cooker.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/x-rice", "rice");
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setDragImage(riceImg, 55, 12);
  });

  // 토핑 집기
  toppingList.addEventListener("dragstart", (e) => {
    const topping = e.target.closest(".topping");
    if (!topping) return;
    e.dataTransfer.setData("text/plain", topping.dataset.id);
    e.dataTransfer.effectAllowed = "copy";
  });

  // 도마 위로 올릴 때: 받을 수 있으면 허용 + 강조
  board.addEventListener("dragover", (e) => {
    const types = [...e.dataTransfer.types];
    if (!canAccept(types)) return;
    e.preventDefault();
    board.classList.add("drop-ok");
  });
  board.addEventListener("dragleave", () => {
    board.classList.remove("drop-ok");
  });

  // 도마에 놓을 때
  board.addEventListener("drop", (e) => {
    board.classList.remove("drop-ok");
    const types = [...e.dataTransfer.types];
    if (!canAccept(types)) return;
    e.preventDefault();

    // 김 올리기
    if (types.includes("text/x-gim")) {
      boardState.gim = true;
      board.classList.add("has-gim");
      updateCutButton();
      return;
    }

    // 밥 올리기: 손을 떼면 바로 펼쳐진 밥이 놓인다
    if (types.includes("text/x-rice")) {
      boardState.rice = true;
      board.classList.add("has-rice");
      updateCutButton();
      return;
    }

    // 토핑 올리기: 가로로 긴 이미지를 한 줄씩 쌓는다
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    // 이미 올린 재료는 중복 불가
    if (filling.querySelector(`img[data-id="${id}"]`)) return;

    const img = document.createElement("img");
    img.dataset.id = id;
    img.alt = id;
    img.draggable = false;
    img.style.transform = "translateX(-50%)";
    img.style.top = filling.children.length * TOPPING_STEP + "px";
    // SVG는 CSS로 가로만 늘릴 수 없어서, 높이를 고정한 뒤 scaleX로 김 폭에 맞춘다
    img.onload = () => {
      const scale = (filling.clientWidth * TOPPING_WIDTH) / img.offsetWidth;
      img.style.transform = `translateX(-50%) scaleX(${scale})`;
    };
    img.src = `../assets/ingredients/${id}.svg`;
    filling.appendChild(img);
  });

  // 도마 집기: 쓰레기통으로 버리거나, 자른 김밥은 손님에게 서빙한다
  board.addEventListener("dragstart", (e) => {
    // 도마에 올린 재료가 없으면 집을 수 없다
    if (getBoardIngredients().length === 0) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/x-board", "board"); // 쓰레기통용
    if (boardState.cut) e.dataTransfer.setData("text/x-kimbap", "board"); // 서빙용
    e.dataTransfer.effectAllowed = "move";
  });
}

// 도마 위 토핑 id 목록 (놓은 순서)
function getBoardToppings() {
  return [...document.querySelectorAll("#board .filling img")].map(
    (img) => img.dataset.id,
  );
}

// 도마 위 재료 전체 (김, 밥, 토핑 순서)
function getBoardIngredients() {
  const list = [];
  if (boardState.gim) list.push("gim");
  if (boardState.rice) list.push("rice");
  return [...list, ...getBoardToppings()];
}

// 서빙/버린 후 도마 비우기 (김, 밥, 토핑 모두)
function clearBoard() {
  const board = document.getElementById("board");
  boardState.gim = false;
  boardState.rice = false;
  boardState.rolled = false;
  boardState.cut = false;
  board.classList.remove("has-gim", "has-rice", "rolled");
  board.draggable = true;
  board.querySelector(".roll").draggable = false;
  board.querySelector(".filling").innerHTML = "";
  updateCutButton();
}

// 자르기 버튼은 김밥을 말았고, 아직 자르지 않았을 때만 누를 수 있다
function updateCutButton() {
  const cutBtn = document.getElementById("cut-btn");
  cutBtn.disabled = !(boardState.rolled && !boardState.cut);
}

// 말기: 김발(도마)을 더블클릭하면 김밥이 말린 모양이 된다
// 자르기: 말린 뒤에 자르기 버튼을 누르면 서빙할 수 있다
function setupCut() {
  const cutBtn = document.getElementById("cut-btn");
  const board = document.getElementById("board");

  board.addEventListener("dblclick", () => {
    if (!boardState.gim || !boardState.rice || boardState.rolled) return;
    board.classList.add("rolled");
    boardState.rolled = true;
    // 말고 나면 도마는 고정하고, 말린 김밥만 끌 수 있다
    board.draggable = false;
    board.querySelector(".roll").draggable = true;
    updateCutButton();
  });

  cutBtn.addEventListener("click", () => {
    if (cutBtn.disabled) return;
    playCuttingSound();
    boardState.cut = true;
    updateCutButton();
  });

  updateCutButton();
}

export { setupBoardDrag, setupCut, getBoardIngredients, clearBoard };
