import { customers } from "../data/customers.js";
import { menu } from "../data/menu.js";
import { getIngredientName } from "../data/ingredients.js";

// 랜덤 손님
function getRandomCustomer() {
  const randomNumber = Math.floor(Math.random() * customers.length);

  let customer;

  if (randomNumber === 0) {
    customer = customers[0];
  } else if (randomNumber === 1) {
    customer = customers[1];
  } else if (randomNumber === 2) {
    customer = customers[2];
  } else if (randomNumber === 3) {
    customer = customers[3];
  } else {
    customer = customers[4];
  }

  return customer;
}

// 랜덤 메뉴
function getRandomMenu() {
  const randomNumber = Math.floor(Math.random() * menu.length);

  let orderMenu;

  if (randomNumber === 0) {
    orderMenu = menu[0];
  } else if (randomNumber === 1) {
    orderMenu = menu[1];
  } else if (randomNumber === 2) {
    orderMenu = menu[2];
  } else if (randomNumber === 3) {
    orderMenu = menu[3];
  } else if (randomNumber === 4) {
    orderMenu = menu[4];
  } else if (randomNumber === 5) {
    orderMenu = menu[5];
  } else {
    orderMenu = menu[6];
  }

  return orderMenu;
}

function buildIngredientText(ids) {
  return `(${ids.map(getIngredientName).join(", ")})`;
}

// 손님 및 주문
function createRandomOrder() {
  const customer = getRandomCustomer();
  const orderMenu = getRandomMenu();

  return {
    customer,
    menuId: orderMenu.id,
    menuName: orderMenu.name,
    ingredients: orderMenu.ingredients,
    price: orderMenu.price,
    text: `${orderMenu.name} 주세요.`,
    ingredientText: buildIngredientText(orderMenu.ingredients),
  };
}

export { getRandomCustomer, getRandomMenu, createRandomOrder };
