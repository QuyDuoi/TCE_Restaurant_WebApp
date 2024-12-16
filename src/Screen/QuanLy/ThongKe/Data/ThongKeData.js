// Data/ThongKeData.js
import { tinhPhanTram, tinhPhanTramChoTop5 } from "../CacHamTinhToan.ts";
import {
  thongKeDoanhThu,
  thongKeHinhThucThanhToan,
  thongKeNguonDoanhThu,
  thongKeTop5,
} from "../CallApiThongKe.ts";
import moment from 'moment';

export const fetchData = async (filter) => {
  try {
    const { type, date, startDate, endDate } = filter;
    let choiseDay = null;

    if (type === 'custom') {
      choiseDay = null;
      // Sử dụng startDate và endDate cho khoảng ngày tùy chỉnh
    } else {
      choiseDay = date;
    }

    // Gọi các API với type và thời gian
    console.log(`Fetching data for type: ${type}, date: ${date}, startDate: ${startDate}, endDate: ${endDate}`);
    const doanhThu = await thongKeDoanhThu(type, startDate, endDate, choiseDay);
    const hinhThucTT = await thongKeHinhThucThanhToan(type, startDate, endDate, choiseDay);
    const nguonDoanhThu = await thongKeNguonDoanhThu(type, startDate, endDate, choiseDay);
    const top5 = await thongKeTop5(type, startDate, endDate, choiseDay);

    const doanhThuPt = tinhPhanTram(
      doanhThu.tongKhuyenMai,
      doanhThu.tongDoanhThu
    );
    const hinhThucTtPt = tinhPhanTram(
      hinhThucTT.tongTienMat,
      hinhThucTT.tongChuyenKhoan
    );
    const nguonDoanhThuPt = tinhPhanTram(
      nguonDoanhThu.banMangDi,
      nguonDoanhThu.banTaiCho
    );
    const top5Pt = tinhPhanTramChoTop5(top5);

    const createThongKeItem = (label, percentage, value, color) => ({
      label,
      percentage,
      value,
      color,
    });
    
    const ThongKeData = [
      {
        title: "Thống kê doanh thu",
        items: [
          createThongKeItem("Khuyến mại", doanhThuPt.phanTramA, doanhThu.tongKhuyenMai, "#FFA07A"),
          createThongKeItem("Doanh thu", doanhThuPt.phanTramB, doanhThu.tongDoanhThu, "#4CAF50"),
        ],
      },
      {
        title: "Nguồn doanh thu",
        items: [
          createThongKeItem("Bán mang đi", nguonDoanhThuPt.phanTramA, nguonDoanhThu.banMangDi, "#FFD700"),
          createThongKeItem("Tại nhà hàng", nguonDoanhThuPt.phanTramB, nguonDoanhThu.banTaiCho, "#FF8C00"),
        ],
      },
      {
        title: "Phương thức thanh toán",
        items: [
          createThongKeItem("Tiền mặt", hinhThucTtPt.phanTramA, hinhThucTT.tongTienMat, "#4CAF50"),
          createThongKeItem("Chuyển khoản", hinhThucTtPt.phanTramB, hinhThucTT.tongChuyenKhoan, "#1E90FF"),
        ],
      },
    ];

    const DataTop5 = [
      {
        title: "Top 5 sản phẩm",
        items: Array(5)
          .fill(null)
          .map((_, index) => {
            if (index < top5Pt.length) {
              const item = top5Pt[index];
              return {
                rank: index + 1,
                label: item.tenMon,
                quantity: item.soLuongMon,
                percentage: item.phanTram,
                color: ["#FF6347", "#FFA07A", "#FFD700", "#1E90FF", "#32CD32"][
                  index
                ],
                image: item.anhMonAn, // URL ảnh
              };
            } else {
              // Trường hợp thiếu dữ liệu, thêm mục trống
              return {
                rank: index + 1,
                label: "Chưa có dữ liệu",
                quantity: 0,
                percentage: 0,
                color: ["#FF6347", "#FFA07A", "#FFD700", "#1E90FF", "#32CD32"][
                  index
                ],
                image: null, // Không có ảnh
              };
            }
          }),
      },
    ];

    return { ThongKeData, DataTop5 };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
