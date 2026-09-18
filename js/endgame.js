import { supabase, getDeviceId } from "./supabase.js";

async function updateBestScore() {
  const finalProfit = Number(sessionStorage.getItem("finalProfit"));

  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from("rankings")
    .select("best_score")
    .eq("device_id", deviceId)
    .single();

  if (error) {
    console.log(error);
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
  const { data, error } = await supabase
    .from("rankings")
    .select("nickname, best_score")
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
    item.textContent =
      i + 1 + "등 " + data[i].nickname + " " + data[i].best_score + "원";
    rankingList.appendChild(item);
  }
}

async function init() {
  await updateBestScore();
  await showRanking();
}

init();