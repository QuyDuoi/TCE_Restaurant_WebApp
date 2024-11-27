import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";

const CancelBookingForm = ({ table, onCancel, onUpdateStatus }) => {
  const [form] = Form.useForm();
  const [confirmText, setConfirmText] = useState("");

  const handleSave = () => {
    if (confirmText === "XAC NHAN") {
      // Cập nhật trạng thái bàn thành "available"
      onUpdateStatus(table.id, "available");
      notification.success({
        message: "Hủy đặt bàn thành công!",
        description: `Bàn ${table.tenBan} đã được chuyển về trạng thái trống.`,
      });
      onCancel(); // Đóng modal
    } else {
      notification.error({
        message: "Lỗi xác nhận",
        description: "Vui lòng nhập đúng nội dung 'XAC NHAN' để hoàn tất hủy bàn.",
      });
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Hủy đặt bàn</h2>
      <Form form={form} layout="vertical">
        {/* Vị trí bàn */}
        <Form.Item label="Vị trí bàn">
          <Input value={`${table.tenBan} - ${table.id_khuVuc}`} disabled />
        </Form.Item>

        {/* Trạng thái bàn */}
        <Form.Item label="Trạng thái bàn">
          <Input value={table.trangThai === "booked" ? "Bàn đặt" : table.trangThai} disabled />
        </Form.Item>

        {/* Người đặt */}
        <Form.Item label="Người đặt">
          <Input
            value={table.nguoiDat || "Chưa có thông tin người đặt"}
            disabled
          />
        </Form.Item>

        {/* Xác nhận hủy */}
        <Form.Item
          label="Xác nhận hủy *"
          rules={[{ required: true, message: "Vui lòng nhập xác nhận hủy" }]}
        >
          <Input
            placeholder="Nhập 'XAC NHAN' để hoàn tất hủy bàn"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </Form.Item>

        {/* Nút lưu */}
        <Form.Item>
          <Button
            type="primary"
            style={{
              width: "100%",
              marginTop: "16px",
              backgroundColor: "#4CAF50",
              borderColor: "#4CAF50",
            }}
            onClick={handleSave}
          >
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CancelBookingForm;
