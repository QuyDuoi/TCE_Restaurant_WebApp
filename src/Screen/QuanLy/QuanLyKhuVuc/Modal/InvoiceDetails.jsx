import React from "react";
import { Table, Button } from "antd";

const InvoiceDetails = ({ table, hoaDonData = [], chiTietHoaDonData = [], onClose }) => {
  const hoaDon = hoaDonData.find((hd) => hd.id_ban === table.id);

  if (!hoaDon) {
    return (
      <div>
        <p>Không tìm thấy hóa đơn cho bàn này.</p>
        <Button type="primary" onClick={onClose}>
          Đóng
        </Button>
      </div>
    );
  }

  // Lấy danh sách chi tiết hóa đơn liên kết với hóa đơn hiện tại
  const chiTietHoaDon = chiTietHoaDonData.filter((cthd) => cthd.id_hoaDon === hoaDon._id);

  // Cấu hình cột cho bảng hiển thị món ăn
  const columns = [
    {
      title: "Món",
      dataIndex: "tenMon",
      key: "tenMon",
    },
    {
      title: "Số Lượng",
      dataIndex: "soLuongMon",
      key: "soLuongMon",
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "giaTien",
      key: "giaTien",
      align: "right",
      render: (text) => `${text.toLocaleString()} đ`,
    },
  ];

  // Dữ liệu hiển thị bảng
  const dataSource = chiTietHoaDon.map((item) => ({
    ...item,
    tenMon:
      item.id_monAn === "mon1"
        ? "Cơm thập cẩm"
        : item.id_monAn === "mon2"
        ? "Thịt nướng giòn"
        : "Tôm hùm Alaska",
  }));

  // Tính tổng bill
  const totalBill = chiTietHoaDon.reduce((sum, item) => sum + item.soLuongMon * item.giaTien, 0);

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Xem thông tin hóa đơn</h2>

      {/* Thông tin hóa đơn */}
      <div style={{ marginBottom: "16px" }}>
        <p>
          <strong>Bàn:</strong> {table.tenBan} | Khu vực: {table.id_khuVuc}
        </p>
        <p>
          <strong>Thời gian vào:</strong> {new Date(hoaDon.thoiGianVao).toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Danh sách món ăn */}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="_id"
        style={{ marginBottom: "16px" }}
        scroll={{ y: 200 }} // Chiều cao cố định là 200px, cuộn nếu vượt quá
      />

      {/* Tổng bill */}
      <div style={{ textAlign: "right", marginBottom: "16px" }}>
        <strong>Tổng bill:</strong> {totalBill.toLocaleString()} đ
      </div>

      {/* Nút đóng */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          style={{
            width: "120px",
            height: "40px",
            fontWeight: "600",
            backgroundColor: "#4CAF50",
            borderColor: "#4CAF50",
          }}
          onClick={onClose}
        >
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default InvoiceDetails;
