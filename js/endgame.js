import { supabase, getDeviceId } from "./supabase.js";

async function updateBestScore() {
  const finalProfit = Number(sessionStorage.getItem("finalProfit"));

  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from("rankings")
    .select("best_score")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) {
    console.log(error);
    return;
  }
  if (!data) {
    const { error: insertError } = await supabase.from("rankings").insert({
      device_id: deviceId,
      nickname: sessionStorage.getItem("nickname") || "익명",
      best_score: finalProfit,
    });
    if (insertError) console.log(insertError);
    return;
  }

  if (finalProfit > data.best_score) {
    await supabase
      .from("rankings")
      .update({ best_score: finalProfit })
      .eq("device_id", deviceId);
  }
}

async function showRanking() {
  const deviceId = getDeviceId();
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

async function init() {
  await updateBestScore();
  await showRanking();
}

init();
