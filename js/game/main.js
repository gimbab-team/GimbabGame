// 게임 화면 진입
import { updateProfitDisplay } from "./state.js";
import { setupBoardDrag, setupCut } from "./board.js";
import { setupServe } from "./serve.js";
import { setupTrash } from "./trash.js";
import { startPatience } from "./customers.js";
import { setupFlow } from "./flow.js";

setupBoardDrag(); // 김, 밥, 토핑 올리기
setupCut(); // 자르기
setupServe(); // 손님에게 서빙
setupTrash(); // 쓰레기통
startPatience(); // 손님 인내심
setupFlow(); // 영업 시작, 일시정지

// 영업 시작 버튼을 누르기 전에는 게임이 시작되지 않음
updateProfitDisplay();
