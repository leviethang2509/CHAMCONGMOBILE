// =======================
// BASEROW CONFIG
// =======================

const API_TOKEN = "221ocGpXV31eVxHiBU47FpDpeBpgloxE"; 
const TABLE_ID = "845692";
const TABLE_CHAMCONG_ID = "845746";
// <-- Table CHAMCONG của bạn
const ROW_URL_CHAMCONG =`https://api.baserow.io/api/database/rows/table/${TABLE_CHAMCONG_ID}`;
const BASE_URL_CHAMCONG =`https://api.baserow.io/api/database/rows/table/${TABLE_CHAMCONG_ID}/?user_field_names=true`;



const BASE_URL =
  `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true`;

// =======================
// OVERRIDE FETCH GLOBAL
// =======================

// Tự động thêm Authorization cho mọi request
const _fetch = window.fetch;

window.fetch = function (url, options = {}) {

  options.headers = {
    ...(options.headers || {}),
    "Authorization": `Token ${API_TOKEN}`,
    "Content-Type": "application/json"
  };

  return _fetch(url, options);
};
