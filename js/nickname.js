import { supabase, getDeviceId, findUser } from "./supabase.js";

const nicknameInput = document.getElementById("input-nickname");
const startBtn = document.getElementById("nickname-start-btn");

// 최초 접속: 닉네임 + device_id 저장
async function saveNickname() {
  const nickname = nicknameInput.value.trim();

  if (!nickname) {
    alert("닉네임을 입력해주세요!");
    return;
  }

  startBtn.disabled = true;
  const deviceId = getDeviceId();

  const { error } = await supabase
    .from("users")
    .insert({ device_id: deviceId, nickname: nickname });

  if (error) {
    startBtn.disabled = false;
    // 23505: unique 위반 (닉네임 중복)
    if (error.code === "23505") {
      if (error.message.includes("device_id")) {
        // 이미 등록된 기기 -> 그대로 진행
        location.href = "startgame.html";
        return;
      }
      alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
      return;
    }
    console.log(error);
    alert("저장 중 오류가 발생했습니다.");
    return;
  }

  sessionStorage.setItem("nickname", nickname);
  location.href = "startgame.html";
}

// 재접속: DB에 등록된 기기면 닉네임 입력 생략
async function checkAlreadyRegistered() {
  const deviceId = localStorage.getItem("device_id");
  const user = await findUser(deviceId);

  if (user) {
    sessionStorage.setItem("nickname", user.nickname);
    location.href = "startgame.html";
  }
}

startBtn.addEventListener("click", saveNickname);
checkAlreadyRegistered();
