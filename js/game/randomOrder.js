import { customers } from "../../data/customers.js";
import { menu, getNormalMenu } from "../../data/menu.js";
import { getIngredientName } from "../../data/ingredients.js";

// 랜덤 손님
function getRandomCustomer() {
  return customers[Math.floor(Math.random() * customers.length)];
}

// 랜덤 메뉴
function getRandomMenu() {
  return menu[Math.floor(Math.random() * menu.length)];
}

// 재료 제외: 김, 밥을 뺀 토핑 중 하나를 랜덤으로 골라 빼 달라고 한다
function filterIngredients(orderedMenu) {
  const filter = orderedMenu.ingredients.slice(2);
  return filter[Math.floor(Math.random() * filter.length)];
}

const EXCLUDE_CHANCE = 0.5; // 재료를 빼 달라고 할 확률

// 손님 및 주문
function createRandomOrder() {
  const customer = getRandomCustomer();
  const ordered = getRandomMenu();

  // 재료 제외 요청
  let excluded = null;
  if (Math.random() < EXCLUDE_CHANCE) {
    excluded = filterIngredients(ordered);
  }

  // 핵심 재료를 빼면 일반김밥으로 처리
  const finalMenu = excluded && excluded === ordered.coreIngredient
    ? getNormalMenu()
    : ordered;

  const ingredients = finalMenu.ingredients.filter((id) => id !== excluded);
  const excludedName = excluded ? getIngredientName(excluded) : null;

  return {
    customer,
    menuId: finalMenu.id,
    menuName: finalMenu.name,
    ingredients,
    excluded,
    price: finalMenu.price,
    text: excluded
      ? `${ordered.name} 주세요. ${excludedName} 빼주세요.`
      : `${ordered.name} 주세요.`,
  };
}

export { createRandomOrder };
