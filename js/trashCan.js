let boardIngredients = [];

export function addIngredient(ingredient) {
  boardIngredients.push(ingredient);
  renderBoard();
}

export function getBoardIngredients() {
  return boardIngredients;
}

export function clearBoard() {
  boardIngredients = [];
  renderBoard();
}

function renderBoard() {
  const boardEl = document.getElementById("cooking-board");
  if (!boardEl) return;

  boardEl.innerHTML = "";
  boardIngredients.forEach((ing) => {
    const img = document.createElement("img");
    img.src = ing.image;
    img.alt = ing.name;
    boardEl.appendChild(img);
  });
}

export function initTrash() {
  const trashEl = document.getElementById("trash-can");
  if (!trashEl) return;

  trashEl.addEventListener("click", clearBoard);
}
