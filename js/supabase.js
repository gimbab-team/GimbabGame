const SUPABASE_URL = "https://ilmirmbtnsyqrzvtyrgk.supabase.co";
const SUPABASE_KEY = "sb_publishable_9tQfARJ5L4CofACtLDctBw_CehXEwV_";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export { supabase };

function getDeviceId() {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = "device_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

// 이 기기의 device_id로 등록된 사용자 조회 (없으면 null)
async function findUser(deviceId) {
  if (!deviceId) return null;
  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, best_score")
    .eq("device_id", deviceId)
    .maybeSingle();
  if (error) {
    console.log(error);
    return null;
  }
  return data;
}

export { getDeviceId, findUser };