import React, { useEffect, useState } from "react";
import { Button, Input, Form, DatePicker, TimePicker, message, Spin } from "antd";
import moment from "moment"; // Thư viện để xử lý thời gian
import { useDispatch, useSelector } from "react-redux";
import { themHoaDonMoi } from "../../../../store/Thunks/hoaDonThunks.ts";
import { resetStatus } from "../../../../store/Slices/BanSlice.ts";

const InvoiceForm = ({ table, area, onSave, onLoading, onUpdateStatus }) => {

  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Sử dụng form của Ant Design
  const selectedArea = area.filter((item) => item._id === table.id_khuVuc);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const status = useSelector((state) => state.hoaDon.status);
  // State cho ngày giờ hiện tại
  const [currentDate, setCurrentDate] = useState(moment()); // Ngày giờ hiện tại


  useEffect(() => {
    // Cập nhật ngày giờ hiện tại khi form mở
    setCurrentDate(moment());
    form.resetFields();
    form.setFieldsValue({
      ngayDat: moment(),
      gioDat: moment(),
    });
  }, [table, form]);

  //id fix cung:
  const id_nhanVien = '6746d3045e16205c66496435'
  const id_nhaHang = '66fab50fa28ec489c7137537'
  const handleFinish = async (values) => {
    setLoading(true);
    // Chuẩn bị dữ liệu gửi đi
    const dataToPost = {
      thoiGianVao: moment(values.ngayDat.format("DD/MM/YYYY") + ' ' + values.gioDat.format("HH:mm")).toISOString(),
      id_ban: table._id,
      id_nhaHang: id_nhaHang,
      id_nhanVien: id_nhanVien,
    };

    // Gửi dữ liệu lên Redux
    await dispatch(themHoaDonMoi(dataToPost));

    setLoading(false);

    // Kiểm tra trạng thái và hiển thị thông báo
    if (status === "succeeded") {
      message.success("Thêm hóa đơn thành công!");
      dispatch(resetStatus());
      form.resetFields();
      // Đóng modal sau khi thành công
      onSave();
      onLoading();
    } else if (status === "failed") {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };


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
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Tạo hóa đơn</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            viTriBan: `Bàn ${table.tenBan} - ${selectedArea[0].tenKhuVuc}`,
            ngayDat: moment(),
            gioDat: moment(),
          }}
        >
          {/* Vị trí bàn */}
          <Form.Item
            label="Vị trí bàn"
            name="viTriBan"
            rules={[{ required: true, message: "Vui lòng nhập vị trí bàn!" }]}
          >
            <Input disabled />
          </Form.Item>

          {/* Ngày đặt bàn */}
          <Form.Item
            label="Ngày đặt bàn"
            name="ngayDat"
            rules={[{ required: true, message: "Vui lòng chọn ngày đặt!" }]}
          >
            <DatePicker disabled style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          {/* Giờ đặt bàn */}
          <Form.Item
            label="Giờ đặt bàn"
            name="gioDat"
            rules={[{ required: true, message: "Vui lòng chọn giờ đặt!" }]}
          >
            <TimePicker disabled style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>

          {/* Nút Lưu */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                marginTop: "16px",
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
              }}
            >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>

  );
};

export default InvoiceForm;
