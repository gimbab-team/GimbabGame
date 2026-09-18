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

export { getDeviceId };