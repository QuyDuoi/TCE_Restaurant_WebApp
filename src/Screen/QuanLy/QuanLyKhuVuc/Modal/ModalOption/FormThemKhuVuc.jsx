// AddAreaForm.jsx
import React from "react";
import { Form, Input, Button, Col, message } from "antd";
import axios from "axios";
import { ipAddress } from "../../../../../services/api.ts";
import { fetchKhuVucVaBan } from "../../../../../store/Thunks/khuVucThunks.ts";
import { useDispatch, useSelector } from "react-redux";

const FormThemKhuVuc = ({ onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;

  const handleSaveKhuVuc = async (values) => {
    try {
      await axios.post(`${ipAddress}themKhuVuc`, {
        tenKhuVuc: values.tenKhuVuc,
        id_nhaHang: id_nhaHang,
      });
      message.success("Thêm khu vực mới thành công!");
      dispatch(fetchKhuVucVaBan(id_nhaHang));
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error adding area:", error);
      message.error(error.response.data.msg);
    }
  };

  return (
    <Form
      style={{ width: "300px" }}
      form={form}
      layout="vertical"
      onFinish={handleSaveKhuVuc}
    >
      <Col>
        <Form.Item
          name="tenKhuVuc"
          label="Tên khu vực"
          rules={[{ required: true, message: "Vui lòng nhập tên khu vực!" }]}
        >
          <Input placeholder="VD: Khu vực A" />
        </Form.Item>
      </Col>
      <Col xl={24} style={{ textAlign: "center" }}>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm khu vực
          </Button>
        </Form.Item>
      </Col>
    </Form>
  );
};

export default FormThemKhuVuc;
