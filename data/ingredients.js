// 재료 데이터
const ingredients = [
  {
    id: "gim",
    name: "김",
    cost: 300,
  },
  {
    id: "rice",
    name: "밥",
    cost: 300,
  },
  {
    id: "egg",
    name: "계란",
    cost: 300,
  },
  {
    id: "danmuji",
    name: "단무지",
    cost: 100,
  },
  {
    id: "ham",
    name: "햄",
    cost: 400,
  },
  {
    id: "crabstick",
    name: "맛살",
    cost: 300,
  },
  {
    id: "carrot",
    name: "당근",
    cost: 100,
  },
  {
    id: "cucumber",
    name: "오이",
    cost: 200,
  },
  {
    id: "cheese",
    name: "치즈",
    cost: 400,
  },
  {
    id: "tuna",
    name: "참치",
    cost: 600,
  },
  {
    id: "perilla",
    name: "깻잎",
    cost: 200,
  },
  {
    id: "kimchi",
    name: "김치",
    cost: 300,
  },
  {
    id: "burdock",
    name: "우엉",
    cost: 200,
  },
  {
    id: "beef",
    name: "소고기",
    cost: 700,
  },
  {
    id: "cutlet",
    name: "돈까스",
    cost: 800,
  },
];

function getIngredientById(id) {
  return ingredients.find((ing) => ing.id === id);
}

function getIngredientName(id) {
  const ing = getIngredientById(id);
  return ing ? ing.name : id;
}

export { ingredients, getIngredientById, getIngredientName };
