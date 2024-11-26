const tableData = [
    {
      id: 1,
      tenBan: "Bàn 1",
      sucChua: 4,
      trangThai: "available",
      id_khuVuc: "VIP 1",
      createdAt: "2024-11-25T12:00:00Z",
      updatedAt: "2024-11-25T12:30:00Z",
      ghiChu: "Trống",
      maQRCode: "QR001",
    },
    {
      id: 2,
      tenBan: "Bàn 2",
      sucChua: 6,
      trangThai: "booked",
      id_khuVuc: "VIP 1",
      createdAt: "2024-11-25T12:00:00Z",
      updatedAt: "2024-11-26T08:00:00Z",
      ghiChu: "Bàn đã được đặt bởi khách VIP",
      maQRCode: "QR002",
    },
    {
      id: 3,
      tenBan: "Bàn 3",
      sucChua: 4,
      trangThai: "in-use",
      id_khuVuc: "VIP 1",
      createdAt: "2024-11-25T12:00:00Z",
      updatedAt: "2024-11-26T09:00:00Z",
      ghiChu: "Bàn đang sử dụng cho buổi tiệc sinh nhật",
      maQRCode: "QR003",
    },
    {
      id: 4,
      tenBan: "Bàn 4",
      sucChua: 2,
      trangThai: "available",
      id_khuVuc: "VIP 2",
      createdAt: "2024-11-25T12:00:00Z",
      updatedAt: "2024-11-25T12:30:00Z",
      ghiChu: "Trống",
      maQRCode: "QR004",
    },
    {
      id: 5,
      tenBan: "Bàn 5",
      sucChua: 8,
      trangThai: "booked",
      id_khuVuc: "VIP 2",
      createdAt: "2024-11-25T12:00:00Z",
      updatedAt: "2024-11-26T08:30:00Z",
      ghiChu: "Bàn đặt cho nhóm khách doanh nghiệp",
      maQRCode: "QR005",
    },
  ];
  
  // Tạo thêm dữ liệu cho đủ 40 bàn
  for (let i = 6; i <= 40; i++) {
    const statusOptions = ["available", "booked", "in-use"];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    tableData.push({
      id: i,
      tenBan: `Bàn ${i}`,
      sucChua: Math.floor(Math.random() * 6) + 2, // Sức chứa từ 2 đến 8
      trangThai: status,
      id_khuVuc: `VIP ${Math.ceil(i / 5)}`, // Cứ 5 bàn thuộc 1 khu vực VIP
      createdAt: "2024-11-25T12:00:00Z",
      updatedAt: "2024-11-26T12:00:00Z",
      ghiChu:
        status === "available"
          ? "Trống"
          : status === "booked"
          ? "Bàn đặt bởi khách hàng quen thuộc"
          : "Bàn đang sử dụng cho khách sự kiện",
      maQRCode: `QR${i.toString().padStart(3, "0")}`,
    });
  }
  
  export default tableData;
  