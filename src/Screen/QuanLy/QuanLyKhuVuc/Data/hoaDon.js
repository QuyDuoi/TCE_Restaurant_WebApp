const hoaDon = [
    {
      _id: "hoadon1",
      tongGiaTri: 500000,
      trangThai: "in-use",
      tienGiamGia: 0,
      ghiChu: "Khách đặt tiệc sinh nhật",
      hinhThucThanhToan: "tiền mặt",
      id_nhanVien: "nv1",
      id_ban: 3, // Liên kết với bàn 3 (trangThai: "in-use")
      createdAt: "2024-11-26T09:00:00Z",
      updatedAt: "2024-11-26T11:00:00Z",
      id_caLamViec: "ca1",
      thoiGianRa: null,
      thoiGianVao: "2024-11-26T09:00:00Z",
    },
    {
      _id: "hoadon2",
      tongGiaTri: 800000,
      trangThai: "booked",
      tienGiamGia: 100000,
      ghiChu: "Đặt cho nhóm khách doanh nghiệp",
      hinhThucThanhToan: "chuyển khoản",
      id_nhanVien: "nv2",
      id_ban: 5, // Liên kết với bàn 5 (trangThai: "booked")
      createdAt: "2024-11-26T08:30:00Z",
      updatedAt: "2024-11-26T10:00:00Z",
      id_caLamViec: "ca2",
      thoiGianRa: null,
      thoiGianVao: "2024-11-26T08:30:00Z",
    },
    {
      _id: "hoadon3",
      tongGiaTri: 1200000,
      trangThai: "in-use",
      tienGiamGia: 200000,
      ghiChu: "Tiệc họp mặt gia đình",
      hinhThucThanhToan: "tiền mặt",
      id_nhanVien: "nv3",
      id_ban: 8, // Liên kết với bàn 8 (giả định trạng thái: "in-use")
      createdAt: "2024-11-26T18:00:00Z",
      updatedAt: "2024-11-26T20:30:00Z",
      id_caLamViec: "ca3",
      thoiGianRa: null,
      thoiGianVao: "2024-11-26T18:00:00Z",
    },
  ];

  
  export default hoaDon;
  