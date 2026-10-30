import { supabase, getDeviceId } from "./supabase.js";

// 현재 점수, 기존 최고 점수 비교 및 저장
async function updateBestScore() {
  // 게임이 끝난 후 저장된 최종 점수를 가져옴
  const finalProfit = Number(sessionStorage.getItem("finalProfit"));
  const deviceId = getDeviceId();

  // 최고 점수 조회
  const { data, error } = await supabase
    .from("rankings")
    .select("best_score")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) {
    console.log(error);
    return;
  }

  // 기존 기록이 없을 시 새로 정보 저장
  if (!data) {
    const { error: insertError } = await supabase.from("rankings").insert({
      device_id: deviceId,
      nickname: sessionStorage.getItem("nickname") || "익명",
      best_score: finalProfit,
    });

    if (insertError) console.log(insertError);

    return;
  }

  // 현재 점수가 최고 점수일 경우 최고 점수 업데이트
  if (finalProfit > data.best_score) {
    await supabase
      .from("rankings")
      .update({ best_score: finalProfit })
      .eq("device_id", deviceId);
  }
}

// 전체 랭킹
async function showRanking() {
  const deviceId = getDeviceId();

  // 상위 10명 조회
  const { data, error } = await supabase
    .from("rankings")
    .select("device_id, nickname, best_score")
    .order("best_score", { ascending: false })
    .limit(10);

  if (error) {
    console.log(error);
    return;
  }

  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const item = document.createElement("li");
    item.className = "rank-item";
    if (data[i].device_id === deviceId) {
      item.classList.add("my-rank");
    }

    const name = document.createElement("span");
    name.className = "rank-name";
    name.textContent = i + 1 + "등 " + data[i].nickname;

    const score = document.createElement("span");
    score.className = "rank-score";
    score.textContent = data[i].best_score + "원";

    item.append(name, score);
    rankingList.appendChild(item);
  }
}

// 랭킹 초기화
async function init() {
  await updateBestScore();
  await showRanking();
}

// 페이지가 실행 시 초기화 함수 실행
init();
