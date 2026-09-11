// 재료 이미지, 드래그&드롭
import { getIngredientById } from "../data/ingredients.js";

// 재료 이미지 렌더링
function renderIngredientItem(container, ing, className) {
  const img = document.createElement("img");
  img.className = className;
  img.src = ing.image;
  img.alt = ing.name;
  img.draggable = true;
  img.dataset.id = ing.id;
  container.appendChild(img);
}

function renderIngredientList(elements, ingredients) {
  elements.ingredientList.innerHTML = "";
  elements.baseIngredients.innerHTML = "";

  ingredients.forEach((ing) => {
    if (ing.layer === "topping") {
      renderIngredientItem(elements.ingredientList, ing, "ingredient-slot");
    } else {
      renderIngredientItem(elements.baseIngredients, ing, "base-slot");
    }
  });
}

// 조리대
function renderBoard(elements, state) {
  elements.boardItems.innerHTML = "";
  state.board.forEach((id) => {
    const ing = getIngredientById(id);
    const item = document.createElement("div");
    item.className = "board-item";
    const img = document.createElement("img");
    img.src = ing.image;
    img.alt = ing.name;
    item.appendChild(img);
    elements.boardItems.appendChild(item);
  });
}

// 재료 중복/필수 재료 검증
function ingredientCheck(board, ingredient) {
  if (board.length === 0) {
    return ingredient.layer === "gim";
  } else if (board.length === 1) {
    return ingredient.layer === "rice";
  } else {
    if (ingredient.layer !== "topping") return false;
    if (board.includes(ingredient.id)) return false;
    return true;
  }
}

function setupDragAndDrop(elements, state, { onSubmit, onDiscard }) {
  // 재료 집기
  function handleIngredientDragStart(e) {
    const item = e.target.closest("[data-id]");
    if (!item) return;
    e.dataTransfer.setData("text/plain", item.dataset.id);
  }

  elements.ingredientList.addEventListener(
    "dragstart",
    handleIngredientDragStart,
  );
  elements.baseIngredients.addEventListener(
    "dragstart",
    handleIngredientDragStart,
  );

  // 조리대에 재료 넣기
  function tryAddIngredient(id) {
    const ing = getIngredientById(id);
    if (!ing) return;
    if (!ingredientCheck(state.board, ing)) return;
    state.board.push(id);
    renderBoard(elements, state);
  }

  elements.cuttingBoard.addEventListener("dragover", (e) => e.preventDefault());
  elements.cuttingBoard.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) tryAddIngredient(id);
  });

  // 완성된 김밥 집기
  elements.cuttingBoard.addEventListener("dragstart", (e) => {
    if (state.board.length === 0) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/x-kimbap", "board");
  });

  // 완성된 김밥 카운터로
  elements.counter.addEventListener("dragover", (e) => e.preventDefault());
  elements.counter.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!e.dataTransfer.types.includes("text/x-kimbap")) return;
    onSubmit();
  });

  // 만들던 김밥 쓰레기통으로
  elements.trashCan.addEventListener("dragover", (e) => e.preventDefault());
  elements.trashCan.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!e.dataTransfer.types.includes("text/x-kimbap")) return;
    onDiscard();
  });
}

export { renderIngredientList, renderBoard, setupDragAndDrop };
