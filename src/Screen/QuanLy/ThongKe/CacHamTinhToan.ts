export const tinhPhanTramChoTop5 = (monAnList) => {
    // Kiểm tra đầu vào: Mảng monAnList phải là một mảng
    if (!Array.isArray(monAnList)) {
        throw new Error("Dữ liệu đầu vào phải là một mảng.");
    }

    // Nếu mảng rỗng, trả về một mảng rỗng
    if (monAnList.length === 0) {
        return [];
    }

    // Kiểm tra tất cả phần tử trong mảng là đối tượng và có thuộc tính soLuongMon
    if (monAnList.some(monAn => typeof monAn.soLuongMon !== "number" || monAn.soLuongMon < 0)) {
        throw new Error("Mỗi món ăn phải có thuộc tính 'soLuongMon' hợp lệ.");
    }

    // Tính tổng số lượng món ăn
    const tongSoLuongMonAn = monAnList.reduce((tong, monAn) => tong + monAn.soLuongMon, 0);

    // Nếu tổng số lượng là 0, gán phần trăm 0 cho tất cả các món
    if (tongSoLuongMonAn === 0) {
        return monAnList.map(monAn => ({ ...monAn, phanTram: 0 }));
    }

    // Nếu chỉ có một món ăn, gán phần trăm là 100%
    if (monAnList.length === 1) {
        return [{ ...monAnList[0], phanTram: 100 }];
    }

    // Tính phần trăm cho từng món ăn, giữ 2 số thập phân
    let phanTramList = monAnList.map(monAn => ({
        ...monAn,
        phanTram: parseFloat(((monAn.soLuongMon / tongSoLuongMonAn) * 100).toFixed(2))
    }));

    // Tính tổng phần trăm
    let tongPhanTram = phanTramList.reduce((tong, monAn) => tong + monAn.phanTram, 0);

    // Điều chỉnh sai lệch nếu tổng phần trăm không bằng 100
    if (tongPhanTram !== 100) {
        const saiLech = 100 - tongPhanTram;
        // Tìm món có phần trăm lớn nhất hoặc nhỏ nhất để điều chỉnh
        const viTriCanDieuChinh = saiLech > 0
            ? phanTramList.findIndex(monAn => monAn.phanTram === Math.max(...phanTramList.map(monAn => monAn.phanTram)))
            : phanTramList.findIndex(monAn => monAn.phanTram === Math.min(...phanTramList.map(monAn => monAn.phanTram)));

        // Điều chỉnh phần trăm
        phanTramList[viTriCanDieuChinh].phanTram = parseFloat((phanTramList[viTriCanDieuChinh].phanTram + saiLech).toFixed(2));
    }

    // Sắp xếp mảng theo phần trăm giảm dần
    phanTramList.sort((a, b) => b.phanTram - a.phanTram);

    return phanTramList;
};

export const tinhPhanTram = (a, b) => {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new Error("Both arguments must be numbers");
    }
  
    const total = a + b;
  
    if (total === 0) {
        return { aPercentage: 0, bPercentage: 0 }; // Tránh chia cho 0
    }
  
    const phanTramA = Math.round((a / total) * 100);
    const phanTramB = Math.round((b / total) * 100);
  
    return {
        phanTramA, // Phần trăm của `a` (đã làm tròn)
        phanTramB, // Phần trăm của `b` (đã làm tròn)
    };
  }