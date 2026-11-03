import { supabase, getDeviceId } from "./supabase.js";

async function saveNickname() {
  const nicknameInput = document.getElementById("input-nickname");
  const nickname = nicknameInput.value;

  if (!nickname) {
    alert("닉네임을 입력해주세요!");
    return;
  }

  const deviceId = getDeviceId();

  const { error } = await supabase
    .from("rankings")
    .insert([{ device_id: deviceId, nickname: nickname, best_score: 0 }]);

  if (error) {
    console.log(error);
    alert("저장 중 오류가 발생했습니다.");
    return;
  }

  location.href = "startgame.html";
}

const startBtn = document.getElementById("nickname-start-btn");
startBtn.addEventListener("click", saveNickname);

// 기존 사용자인지 확인
async function checkAlreadyRegistered() {
  const deviceId = localStorage.getItem("device_id");

  const { data, error } = await supabase
    .from("rankings")
    .select("device_id")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) {
    console.log(error);
    return;
  }

  // 있으면 시작화면으로 이동
  if (data) {
    location.href = "startgame.html";
  }
}

checkAlreadyRegistered();
