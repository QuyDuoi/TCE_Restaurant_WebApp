import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchChiTietHoaDon } from "../../../../store/Slices/ChiTietHoaDonSlice.ts";
import { io } from "socket.io-client";
import { ipIO } from "../../../../services/api.ts";

const InvoiceDetails = ({ table, area, hoaDonData, onClose }) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  const selectedArea = area.find((a) => a._id === table.id_khuVuc) || {};
  const { chiTietHoaDons } = useSelector((state) => state.chiTietHoaDon);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hoaDonData) {
      setLoading(true); // Bắt đầu loading
      dispatch(fetchChiTietHoaDon(hoaDonData._id))
        .then(() => {
          setLoading(false); // Kết thúc loading
        })
        .catch((error) => {
          console.error("Error fetching chiTietHoaDon:", error);
          message.error("Có lỗi xảy ra khi tải thông tin.");
          setLoading(false);
        });
    } else {
      setLoading(false); // Không có hoaDon, không cần tải chi tiết
    }
  }, [hoaDonData, dispatch]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(ipIO);
    }

    const socket = socketRef.current;

    // Khi nhận được sự kiện "hoanThanhMon", fetch lại chi tiết hóa đơn
    const handleHoanThanhMon = (data) => {
      console.log("Sự kiện hoanThanhMon nhận được:", data);
      if (hoaDonData && hoaDonData._id) {
        dispatch(fetchChiTietHoaDon(hoaDonData._id));
      }
    };

    // Khi nhận được sự kiện "lenMon", fetch lại chi tiết hóa đơn
    const handleLenMon = (data) => {
      console.log("Sự kiện lenMon nhận được:", data);
      if (hoaDonData && hoaDonData._id) {
        dispatch(fetchChiTietHoaDon(hoaDonData._id));
      }
    };

    socket.on("hoanThanhMon", handleHoanThanhMon);
    socket.on("lenMon", handleLenMon);

    // Kiểm tra kết nối thành công
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    // Cleanup khi component bị unmount
    return () => {
      socket.off("hoanThanhMon", handleHoanThanhMon);
      socket.off("lenMon", handleLenMon);
      // Không disconnect socket ở đây nếu bạn muốn giữ kết nối
    };
  }, [hoaDonData, dispatch]);

  if (!hoaDonData) {
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
  const chiTietHoaDon = Array.isArray(chiTietHoaDons)
    ? chiTietHoaDons.filter((cthd) => cthd.id_hoaDon === hoaDonData._id)
    : [];

  const columns = [
    {
      title: "Món",
      dataIndex: "tenMon",
      key: "tenMon",
      width: 200,
      ellipsis: true, // Cắt bớt văn bản nếu vượt quá
    },
    {
      title: "Số Lượng",
      dataIndex: "soLuongMon",
      key: "soLuongMon",
      align: "center",
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai) =>
        trangThai ? (
          <span style={{ color: "green" }}>✔</span>
        ) : (
          <span style={{ color: "red" }}>✖</span>
        ),
      align: "center",
      width: 100, 
    },
    {
      title: "Giá",
      dataIndex: "giaTien",
      key: "giaTien",
      align: "right",
      width: 150, 
      render: (text) => `${text.toLocaleString()} đ`,
    },
  ];

  // Dữ liệu hiển thị bảng
  const dataSource = chiTietHoaDon.map((item) => ({
    ...item,
    tenMon: item.monAn ? item.monAn.tenMon : "Không xác định",
  }));

  // Tính tổng bill
  const totalBill = chiTietHoaDon.reduce((sum, item) => {
    const soLuong = Number(item.soLuongMon) || 0;
    const gia = Number(item.giaTien) || 0;
    return sum + soLuong * gia;
  }, 0);

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        Thông tin hóa đơn
      </h2>

      {/* Thông tin hóa đơn */}
      <div style={{ marginBottom: "16px" }}>
        <p>
          <strong>Bàn:</strong> {table.tenBan} | Khu vực:{" "}
          {selectedArea.tenKhuVuc || "Không xác định"}
        </p>
        <p>
          <strong>Thời gian vào:</strong>{" "}
          {new Date(hoaDonData.thoiGianVao).toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Danh sách món ăn */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            flexDirection: "column",
          }}
        >
          <Spin size="large" /> {/* Hiển thị loading spinner */}
          <p>Đang lấy thông tin món</p>
        </div>
      ) : (
        <>
          {/* Danh sách món ăn */}
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            locale={{ emptyText: "Chưa có thông tin món ăn!" }}
            rowKey="_id"
            style={{ marginBottom: "16px" }}
            scroll={{ y: 220, x: 550 }} // Thiết lập chiều cao cuộn dọc và chiều rộng cuộn ngang
          />

          {/* Tổng bill */}
          <div style={{ textAlign: "right", marginBottom: "16px" }}>
            <strong>Tổng tiền:</strong> {totalBill.toLocaleString()} đ
          </div>
        </>
      )}

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
