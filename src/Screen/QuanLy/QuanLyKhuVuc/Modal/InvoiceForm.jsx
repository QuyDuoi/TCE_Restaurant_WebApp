import React, { useEffect, useState } from "react";
import { Button, Input, Form, DatePicker, TimePicker, message } from "antd";
import moment from "moment"; // Thư viện để xử lý thời gian

const InvoiceForm = ({ table, onSave, onUpdateStatus }) => {
  const [form] = Form.useForm(); // Sử dụng form của Ant Design

  // State cho ngày giờ hiện tại
  const [currentDate, setCurrentDate] = useState(moment()); // Ngày giờ hiện tại

  useEffect(() => {
    // Cập nhật ngày giờ hiện tại khi form mở
    setCurrentDate(moment());
    form.setFieldsValue({
      ngayDat: moment(),
      gioDat: moment(),
    });
  }, [form]);

  const handleFinish = (values) => {
    // Xử lý khi nhấn Lưu
    console.log("Dữ liệu hóa đơn:", {
      ...values,
      ngayDat: values.ngayDat.format("DD/MM/YYYY"),
      gioDat: values.gioDat.format("HH:mm"),
    });

    // Hiển thị thông báo thành công
    message.success("Tạo hóa đơn thành công!");

    // Cập nhật trạng thái bàn thành "đang sử dụng"
    onUpdateStatus(table.id, "in-use");

    // Đóng modal
    onSave();
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Tạo hóa đơn</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          viTriBan: `${table.tenBan} - ${table.id_khuVuc}`,
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
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        {/* Giờ đặt bàn */}
        <Form.Item
          label="Giờ đặt bàn"
          name="gioDat"
          rules={[{ required: true, message: "Vui lòng chọn giờ đặt!" }]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
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
  );
};

export default InvoiceForm;
