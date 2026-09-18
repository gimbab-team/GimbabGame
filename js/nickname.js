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

function checkAlreadyRegistered() {
  const deviceId = localStorage.getItem("device_id");

  if (deviceId) {
    location.href = "startgame.html";
  }
}

checkAlreadyRegistered();