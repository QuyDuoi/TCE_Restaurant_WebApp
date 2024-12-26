// AddTableForm.jsx
import React from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  InputNumber,
  message,
} from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ipAddress } from "../../../../../services/api.ts";
import { fetchKhuVucVaBan } from "../../../../../store/Thunks/khuVucThunks.ts";

const { Option } = Select;

const FormThemban = ({ onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;
  const dsKhuVuc = useSelector((state) => state.khuVuc.khuVucs);

  const handleSaveBan = async (values) => {
    try {
      await axios.post(`${ipAddress}themBan`, {
        tenBan: values.tenBan,
        sucChua: values.sucChua,
        id_khuVuc: values.id_khuVuc,
      });
      message.success("Thêm bàn thành công!");
      dispatch(fetchKhuVucVaBan(id_nhaHang));
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error adding table:", error);
      message.error(error.response.data.msg);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "300px",
        margin: "0 auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Thông tin bàn</h2>
      <Form form={form} layout="vertical" onFinish={handleSaveBan}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="id_khuVuc"
              label="Khu vực"
              rules={[{ required: true, message: "Vui lòng chọn khu vực!" }]}
            >
              <Select placeholder="Chọn khu vực">
                {dsKhuVuc.map((khuVuc) => (
                  <Option key={khuVuc._id} value={khuVuc._id}>
                    {khuVuc?.tenKhuVuc}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="tenBan"
              label="Tên bàn"
              rules={[{ required: true, message: "Vui lòng nhập tên bàn!" }]}
            >
              <Input placeholder="VD: Bàn 1" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="sucChua"
              label="Sức chứa"
              rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="VD: 4"
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm bàn
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FormThemban;
