import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { resetStatus, updateBanThunk } from "../../../../store/Slices/BanSlice.ts";

const CancelBookingForm = ({ table, area, onLoading, onCancel }) => {
  const [form] = Form.useForm();
  const [confirmText, setConfirmText] = useState("");
  const dispatch = useDispatch();
  const status = useSelector((state) => state.ban.status);

  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const selectedArea = area.filter((item) => item._id === table.id_khuVuc);
  
  const ghiChu = table.ghiChu.split(' - ')

  const handleSave = async () => {
    if (confirmText === "XAC NHAN") {
      setLoading(true);
      const dataToPost = {
        trangThai: "Trống",
        id_khuVuc: table.id_khuVuc,
      }
      try {
        await dispatch(updateBanThunk({
          id: table._id,
          formData: dataToPost
        }));

        onCancel(); // Đóng modal
      } catch (error) {
        console.error("Error while updating:", error);
      } finally {
        setLoading(false); // Đảm bảo spinner được tắt khi hoàn thành hoặc có lỗi
      }

    } else {
      notification.error({
        message: "Lỗi xác nhận",
        description: "Vui lòng nhập đúng nội dung 'XAC NHAN' để hoàn tất hủy bàn.",
        duration: 2, // Thời gian hiển thị thông báo lỗi là 2 giây
      });
    }
  };


  useEffect(() => {
    console.log('statusCancle',status);
    if (status === 'succeeded') {
      // Cập nhật trạng thái bàn thành "available"
      notification.success({
        message: "Hủy đặt bàn thành công!",
        description: `Bàn ${table.tenBan} đã được chuyển về trạng thái trống.`,
        duration: 2, // Thời gian hiển thị thông báo lỗi là 2 giây
      });
      dispatch(resetStatus());
      onLoading(); // Gọi hàm để cập nhật lại hoặc làm mới dữ liệu
    } else if (status === 'failed') {
      notification.error({
        message: "Lỗi huỷ đặt bàn",
        description: "Huỷ đặt bàn không thành công.",
        duration: 2, // Thời gian hiển thị thông báo lỗi là 2 giây
      });
    }
  }, [status]); // Chỉ kích hoạt khi status thay đổi
  
  return (
    <>
      {loading && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "9999",
        }}>

          <Spin size="large" style={{ color: 'white' }} />
        </div>
      )}
      <div style={{ padding: "16px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Hủy đặt bàn</h2>
        <Form form={form} layout="vertical">
          {/* Vị trí bàn */}
          <Form.Item label="Vị trí bàn">
            <Input value={`${table.tenBan} - ${selectedArea[0].tenKhuVuc}`} disabled />
          </Form.Item>

          {/* Trạng thái bàn */}
          <Form.Item label="Trạng thái bàn">
            <Input value={table.trangThai === "booked" ? "Bàn đặt" : table.trangThai} disabled />
          </Form.Item>

          {/* Người đặt */}
          <Form.Item label="Người đặt">
            <Input
              value={ghiChu[3] || "Chưa có thông tin người đặt"}
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
    </>
  );
};

export default CancelBookingForm;
