// 엔딩 화면(최고 점수 저장 + 랭킹 표시)
import { supabase, findUser } from "./supabase.js";

// 최고 점수 갱신
async function updateBestScore() {
  // 게임에서 저장해 둔 최종 수익
  const finalProfit = Number(sessionStorage.getItem("finalProfit")) || 0;

  // 이 기기의 고유 ID로 내 기록 조회
  const user = await findUser(localStorage.getItem("device_id"));
  if (!user) return;

  // 기존 최고 점수보다 높을 때만 갱신
  if (finalProfit > (user.best_score ?? 0)) {
    const { error } = await supabase
      .from("users")
      .update({ best_score: finalProfit, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) console.log(error);
  }
}

// 랭킹 표시(상위 20명)
async function showRanking() {
  const deviceId = localStorage.getItem("device_id");

  // 점수 높은 순으로 20명 조회
  const { data, error } = await supabase
    .from("users")
    .select("device_id, nickname, best_score")
    .order("best_score", { ascending: false })
    .limit(20);

  if (error) {
    console.log(error);
    return;
  }

  // 기존 목록 비우기
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";

  // 순위별로 목록 항목 생성
  for (let i = 0; i < data.length; i++) {
    const item = document.createElement("li");
    item.className = "rank-item";

    // 내 기록이면 강조 표시
    if (data[i].device_id === deviceId) {
      item.classList.add("my-rank");
    }

    // 순위 + 닉네임
    const name = document.createElement("span");
    name.className = "rank-name";
    name.textContent = i + 1 + "등 " + data[i].nickname;

    // 점수
    const score = document.createElement("span");
    score.className = "rank-score";
    score.textContent = (data[i].best_score ?? 0).toLocaleString() + "원";

    item.append(name, score);
    rankingList.appendChild(item);
  }
}

// 수익에 따른 등급
const RANKS = [
  { min: 30000, icon: "👑", title: "김밥의 달인", stars: 3 },
  { min: 15000, icon: "🍙", title: "김밥 장인", stars: 2 },
  { min: 5000, icon: "🥢", title: "알바생", stars: 1 },
  { min: -Infinity, icon: "🐥", title: "일반인", stars: 0 },
];

// 결과 표시(최종 수익, 별, 한줄평, 손님 기분)
function showResult() {
  const finalProfit = Number(sessionStorage.getItem("finalProfit")) || 0;
  document.getElementById("profit-won").innerHTML = finalProfit;

  // 별
  const grade = RANKS.find((r) => finalProfit >= r.min);
  let stars = "";
  if (grade.stars === 0) {
    stars = "NO STAR";
  } else {
    for (let i = 0; i < grade.stars; i++) {
      stars += "⭐ ";
    }
  }
  document.getElementById("stars").innerHTML = stars;

  // 한줄평
  document.getElementById("grade-line").textContent =
    grade.icon + " " + grade.title;

  // 손님 기분 카운트
  document.getElementById("happy-count").textContent =
    Number(sessionStorage.getItem("happyCount")) || 0;
  document.getElementById("angry-count").textContent =
    Number(sessionStorage.getItem("angryCount")) || 0;
}

// 초기 실행(점수 저장 후 랭킹 표시)
async function init() {
  showResult();
  await updateBestScore();
  await showRanking();
}

// 페이지가 실행 시 초기화 함수 실행
init();
