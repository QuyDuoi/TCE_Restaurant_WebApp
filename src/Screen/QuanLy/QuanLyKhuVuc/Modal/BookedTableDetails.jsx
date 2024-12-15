import React from "react";
import { Descriptions, Button } from "antd";

const BookedTableDetails = ({ table, area, onClose }) => {
  const selectedArea = area.find((item) => item._id === table.id_khuVuc);

  const mangGhiChu = table.ghiChu.split(' - ');
  console.log('GhiChu',mangGhiChu);
  const ghiChu = mangGhiChu[0];
  const ngay = mangGhiChu[1];
  const gio = mangGhiChu[2];
  const hoten = mangGhiChu[3]
  if (!table || table.trangThai !== "Đã đặt") {
    return (
      <div>
        <p>Không có thông tin đặt bàn cho bàn này.</p>
        <Button type="primary" onClick={onClose}>
          Đóng
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Thông tin bàn đặt</h2>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên bàn">{table.tenBan}</Descriptions.Item>
        <Descriptions.Item label="Khu vực">{selectedArea.tenKhuVuc}</Descriptions.Item>
        <Descriptions.Item label="Sức chứa">{table.sucChua} người</Descriptions.Item>
        <Descriptions.Item label="Ngày đặt">
          {ngay}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian đặt">
          {gio}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">{ghiChu+hoten || "Không có"}</Descriptions.Item>
      </Descriptions>

      {/* Nút đóng */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
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

export default BookedTableDetails;
