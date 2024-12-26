import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Form,
  DatePicker,
  TimePicker,
  message,
  Spin,
} from "antd";
import moment from "moment"; // Library for handling time
import { useDispatch, useSelector } from "react-redux";
import { themHoaDonMoi } from "../../../../store/Thunks/hoaDonThunks.ts";
import { resetStatus } from "../../../../store/Slices/BanSlice.ts";

const InvoiceForm = ({
  table,
  area,
  onCreateInvoice,
  onLoading,
  onUpdateStatus,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Use Ant Design form
  const selectedArea = area.filter((item) => item._id === table.id_khuVuc);
  const [loading, setLoading] = useState(false); // Add loading state
  const status = useSelector((state) => state.hoaDon.status);
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang?._id;
  const id_nhanVien = user._id;

  useEffect(() => {
    // Update current date and time when form opens
    form.resetFields();
    form.setFieldsValue({
      ngayTao: moment(),
      gioTao: moment(),
    });
  }, [table, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    // Prepare data to post
    const dataToPost = {
      thoiGianVao: new Date(),
      id_ban: table._id,
      id_nhaHang: id_nhaHang,
      id_nhanVien: id_nhanVien,
    };

    try {
      const response = await dispatch(themHoaDonMoi(dataToPost)).unwrap();

      setLoading(false);
      message.success("Thêm hóa đơn thành công!");
      dispatch(resetStatus());
      form.resetFields();

      // Gửi dữ liệu về Modal bàn để truyền vào thông tin hóa đơn
      onCreateInvoice(response);

      // Optionally handle loading state
      onLoading();
    } catch (error) {
      message.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div
          style={{
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
          }}
        >
          <Spin size="large" style={{ color: "white" }} />
        </div>
      )}
      <div
        style={{
          padding: "16px",
          maxWidth: "500px", // Limit form width
          margin: "0 auto", // Center
          backgroundColor: "#fff", // White background for prominence
          borderRadius: "8px", // Rounded corners
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Add shadow effect
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Tạo hóa đơn
        </h2>
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
          {/* Table Position */}
          <Form.Item
            label="Vị trí bàn"
            name="viTriBan"
            rules={[{ required: true, message: "Vui lòng nhập vị trí bàn!" }]}
          >
            <Input disabled />
          </Form.Item>

          {/* Creation Date */}
          <Form.Item
            label="Ngày tạo"
            name="ngayTao"
            rules={[{ required: true, message: "Vui lòng chọn ngày đặt!" }]}
          >
            <DatePicker
              disabled
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          {/* Creation Time */}
          <Form.Item
            label="Thời gian tạo"
            name="gioTao"
            rules={[{ required: true, message: "Vui lòng chọn giờ đặt!" }]}
          >
            <TimePicker disabled style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>

          {/* Save Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%", // Full width
                marginTop: "16px",
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
              }}
            >
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default InvoiceForm;
