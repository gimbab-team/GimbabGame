// 주문 판정
function checkOrder(order, board) {
  let errorCount = 0;

  if (board[0] !== "gim") errorCount++;
  if (board[1] !== "rice") errorCount++;

  const boardToppings = board.slice(2);
  const requiredToppings = order.ingredients.filter(
    (id) => id !== "gim" && id !== "rice",
  );

  requiredToppings.forEach((id) => {
    if (!boardToppings.includes(id)) errorCount++;
  });
  boardToppings.forEach((id) => {
    if (!requiredToppings.includes(id)) errorCount++;
  });

  let payoutRatio;
  if (errorCount === 0) payoutRatio = 1;
  else if (errorCount === 1) payoutRatio = 0.8;
  else if (errorCount === 2) payoutRatio = 0.5;
  else payoutRatio = 0;

  const profitGain = Math.round(order.price * payoutRatio);

  return { errorCount, payoutRatio, profitGain };
}

// 재료 원가
function getIngredientCost(board, getIngredientById) {
  return board.reduce((sum, id) => {
    const item = getIngredientById(id);
    return sum + (item && item.cost ? item.cost : 0);
  }, 0);
}

// 카운터 제출(판정 + 재료비)
function counterSubmit(order, board, getIngredientById) {
  const { errorCount, profitGain } = checkOrder(order, board);
  const ingredientCost = getIngredientCost(board, getIngredientById);

  return { errorCount, profitGain, ingredientCost };
}

// 수익 누적(최종 수익)
function addProfit(state, profit, ingredientCost) {
  state.totalSales += profit;
  state.totalIngredientCost += ingredientCost;
  state.profit = state.totalSales - state.totalIngredientCost;
  return state.profit;
}

// 쓰레기통에 들어간 재료 가격 계산
function subtractProfit(state, ingredientCost) {
  state.totalIngredientCost += ingredientCost;
  state.profit = state.totalSales - state.totalIngredientCost;
  return state.profit;
}

export { getIngredientCost, counterSubmit, addProfit, subtractProfit };
