import { customers } from "../data/customers.js";
import { menu } from "../data/menu.js";
import { getIngredientName } from "../data/ingredients.js";

// 랜덤 손님
function getRandomCustomer() {
  return customers[Math.floor(Math.random() * customers.length)];
}

// 랜덤 메뉴
function getRandomMenu() {
  return menu[Math.floor(Math.random() * menu.length)];
}

// 재료 제외
function filterIngredients(ordered) {
  const filter = menu[ordered].ingredients.slice(2);
  return filter[Math.floor(Math.randome() * filter.length)];
}

// 재료 목록 출력

function buildIngredientText(ids) {
  return `(${ids.map(getIngredientName).join(", ")})`;
}

// 손님 및 주문
function createRandomOrder() {
  const customer = getRandomCustomer();
  const menu = getRandomMenu();

  return {
    customer,
    menuId: menu.id,
    menuName: menu.name,
    ingredients: menu.ingredients,
    price: menu.price,
    text: `${menu.name} 주세요.`,
    ingredientText: buildIngredientText(menu.ingredients),
  };
}

export { createRandomOrder };
export default createRandomOrder;
