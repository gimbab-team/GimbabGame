// 엔딩 화면(최고 점수 저장 + 랭킹 표시)
import { supabase, findUser } from "./supabase.js";

// 최고 점수 갱신
async function updateBestScore() {
  // 게임에서 저장해 둔 최종 수익
  const finalProfit = Number(sessionStorage.getItem("finalProfit")) || 0;

  // 이 기기의 고유 ID로 내 기록 조회
  const user = await findUser(localStorage.getItem("device_id"));

  // 내 기록(최고 점수) 조회
  const { data, error } = await supabase
    .from("rankings")
    .select("best_score")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) {
    console.log(error);
    return;
  }

  // 기록이 없으면 새로 등록
  if (!data) {
    const { error: insertError } = await supabase.from("rankings").insert({
      device_id: deviceId,
      nickname: sessionStorage.getItem("nickname") || "익명",
      best_score: finalProfit,
    });

    if (insertError) console.log(insertError);

    return;
  }

  // 기존 최고 점수보다 높을 때만 갱신
  if (finalProfit > user.best_score) {
    const { error } = await supabase
      .from("users")
      .update({ best_score: finalProfit, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) console.log(error);
  }
}

// 랭킹 표시(상위 10명)
async function showRanking() {
  const deviceId = localStorage.getItem("device_id");

  // 점수 높은 순으로 10명 조회
  const { data, error } = await supabase
    .from("users")
    .select("device_id, nickname, best_score")
    .order("best_score", { ascending: false })
    .limit(10);

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
    score.textContent = data[i].best_score + "원";

    item.append(name, score);
    rankingList.appendChild(item);
  }
}

// 초기 실행(점수 저장 후 랭킹 표시)
async function init() {
  await updateBestScore();
  await showRanking();
}

// 페이지가 실행 시 초기화 함수 실행
init();
