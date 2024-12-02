import React, { useEffect, useState } from "react";
import { Button, Input, Form, DatePicker, TimePicker, message } from "antd";
import moment from "moment"; // Thư viện để xử lý thời gian
import { useDispatch, useSelector } from "react-redux";
import { themHoaDonMoi } from "../../../../store/Thunks/hoaDonThunks.ts";

const InvoiceForm = ({ table, area, onSave, onUpdateStatus }) => {

  const dispatch = useDispatch();
  const { status, error} = useSelector(state => state.hoaDon);
  const [form] = Form.useForm(); // Sử dụng form của Ant Design
  
  console.log('value table',table);
  
  
  const selectedArea = area.filter((item)=> item._id === table.id_khuVuc)

  console.log('value area',selectedArea);
  
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

//id fix cung:
  const id_nhanVien = '6746d3045e16205c66496435'
  const id_nhaHang = '66fab50fa28ec489c7137537'
  const handleFinish = async (values) => {
    // Xử lý khi nhấn Lưu
    const dataToPost = {
        thoiGianVao: moment(values.ngayDat.format("DD/MM/YYYY") + ' ' + values.gioDat.format("HH:mm")).toISOString(),
        id_ban: table._id,
        id_nhaHang: id_nhaHang,
        id_nhanVien: id_nhanVien,
    };


    try {
        await dispatch(themHoaDonMoi(dataToPost));
        // Hiển thị thông báo thành công
        message.success("Thêm hóa đơn thành công!");
    } catch (error) {
        console.log('Lỗi', error.message);
        // Có thể hiển thị thông báo lỗi nếu cần
        message.error("Có lỗi xảy ra, vui lòng thử lại.");
    }

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
