const BASE_URL = "https://68fe3dce7c700772bb133e1d.mockapi.io/api/v1/CHAMCONG/CHAMCONG";
const BASE_URL_TAIKHOAN = "https://68fe3dce7c700772bb133e1d.mockapi.io/api/v1/CHAMCONG/CHAMCONG";



// ===============================
// RANDOM HELPER
// ===============================

function thongKeThangBa(data) {

    // Tìm record tháng 3
    const record = data.find(x => x.Thang === "2026-03");
    if (!record || !record.GioVao_GioRa_Thang?.length) {
        return {
            tongNgayCong: 0,
            tongGio: 0,
            tongPhut: 0
        };
    }

    let tongNgayCong = 0;
    let tongPhutThang = 0;

    record.GioVao_GioRa_Thang.forEach(ngay => {

        const soGio = ngay.SoTieng_TrongNgay;

        // Nếu không có giờ vào/ra → bỏ qua
        if (!soGio || typeof soGio !== "object") return;

        // Cộng tổng phút
        tongPhutThang += soGio.tongPhut;

        // Nếu >= 8 tiếng → tính 1 công
        if (soGio.gio >= 8) {
            tongNgayCong++;
        }
    });

    return {
        tongNgayCong,
        tongGio: Math.floor(tongPhutThang / 60),
        tongPhut: tongPhutThang % 60
    };
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatTime(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ===============================
// TÍNH GIỜ
// ===============================
function tinhSoGio(gioVao, gioRa) {

  const [vaoH, vaoM] = gioVao.split(":").map(Number);
  const [raH, raM] = gioRa.split(":").map(Number);

  let tongPhut = (raH * 60 + raM) - (vaoH * 60 + vaoM);
  if (tongPhut < 0) tongPhut += 24 * 60;

  return {
    gio: Math.floor(tongPhut / 60),
    phut: tongPhut % 60,
    tongPhut
  };
}

// ===============================
// TẠO 1 THÁNG
// ===============================
function generateMonth(year, month) {

  const daysInMonth = new Date(year, month, 0).getDate();
  const listNgay = [];

  for (let day = 1; day <= daysInMonth; day++) {

    const dateStr = formatDate(year, month, day);

    // 20% nghỉ
    if (Math.random() < 0.2) {
      listNgay.push({
        idNgay: dateStr,
        GioVao: null,
        GioRa: null,
        IsTangCa: false,
        SoTieng_TrongNgay: 0
      });
      continue;
    }

    const vaoH = random(7, 9);
    const vaoM = random(0, 59);

    const tongPhutLam = random(360, 660); // 6h -> 11h

    const vaoTong = vaoH * 60 + vaoM;
    const raTong = vaoTong + tongPhutLam;

    const raH = Math.floor(raTong / 60) % 24;
    const raM = raTong % 60;

    const gioVao = formatTime(vaoH, vaoM);
    const gioRa = formatTime(raH, raM);

    const ketQua = tinhSoGio(gioVao, gioRa);

    listNgay.push({
      idNgay: dateStr,
      GioVao: gioVao,
      GioRa: gioRa,
      IsTangCa: ketQua.gio > 8,
      SoTieng_TrongNgay: ketQua
    });
  }

  return {
    Thang: `${year}-${String(month).padStart(2, '0')}`,
    GioVao_GioRa_Thang: listNgay
  };
}

// ===============================
// TẠO TOÀN BỘ 12 THÁNG
// ===============================
async function generateFullYear(year = 2026) {

  try {

    for (let month = 1; month <= 12; month++) {

      const dataMonth = generateMonth(year, month);

      await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataMonth)
      });

      console.log("✅ Đã tạo:", dataMonth.Thang);
    }

    console.log("🎉 Hoàn tất tạo dữ liệu cả năm!");

  } catch (err) {
    console.error("❌ Lỗi:", err);
  }
}

generateFullYear();
