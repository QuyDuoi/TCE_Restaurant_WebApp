// UpdateTableList.jsx
import React, { useState } from "react";
import {
  List,
  Button,
  Popconfirm,
  Form,
  Input,
  Select,
  InputNumber,
  Col,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import message from "antd/es/message";
import { ipAddress } from "../../../../../services/api.ts";
import { fetchKhuVucVaBan } from "../../../../../store/Thunks/khuVucThunks.ts";

const { Option } = Select;

const FormCapNhatBan = () => {
  const dsBan = useSelector((state) => state.ban.bans);
  const dsKhuVuc = useSelector((state) => state.khuVuc.khuVucs);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;
  const id_nhanVien = user._id;

  const [editingItem, setEditingItem] = useState(null);

  const handleUpdateBan = async (id, updatedData) => {
    try {
      await axios.put(`${ipAddress}capNhatBan/${id}`, updatedData);
      message.success("Cập nhật bàn thành công!");
      dispatch(fetchKhuVucVaBan(id_nhaHang));
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating table:", error);
      message.error(error.response.data.msg || "Cập nhật bàn thất bại!");
    }
  };

  const handleDeleteBan = async (id) => {
    try {
      await axios.delete(`${ipAddress}xoaBan/${id}`, {
        data: { id_nhanVien: id_nhanVien, id_nhaHang: id_nhaHang },
      });
      message.success("Xóa bàn thành công!");
      dispatch(fetchKhuVucVaBan(id_nhaHang));
    } catch (error) {
      console.error("Error deleting table:", error);
      message.error(error.response.data.msg || "Xóa thông tin bàn thất bại!");
    }
  };

  return (
    <List
      dataSource={dsBan}
      style={{ overflowY: "auto", maxHeight: "420px" }}
      renderItem={(item) => {
        const khuVuc = dsKhuVuc.find((khuVuc) => khuVuc._id === item.id_khuVuc);
        return (
          <List.Item
            actions={[
              <Button
                type="link"
                style={{ padding: "0", color: "blue" }}
                onClick={() => setEditingItem(item._id)}
              >
                Sửa
              </Button>,
              <span style={{ margin: "0 8px" }}>|</span>,
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa bàn này không?"
                onConfirm={() => handleDeleteBan(item._id)}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button type="link" style={{ color: "red", padding: 0 }}>
                  Xóa
                </Button>
              </Popconfirm>,
            ]}
          >
            {editingItem === item._id ? (
              <Form
                style={{
                  backgroundColor: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  marginLeft: "2px",
                }}
                layout="inline"
                onFinish={(values) => handleUpdateBan(item._id, values)}
              >
                <Col xs={24} sm={8} md={24}>
                  <Form.Item
                    name="id_khuVuc"
                    label="Tên khu vực"
                    initialValue={item.id_khuVuc}
                    rules={[
                      { required: true, message: "Vui lòng chọn khu vực!" },
                    ]}
                  >
                    <Select style={{ width: 150 }}>
                      {dsKhuVuc.map((khuVuc) => (
                        <Option key={khuVuc._id} value={khuVuc._id}>
                          {khuVuc.tenKhuVuc}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} md={24}>
                  <Form.Item
                    name="tenBan"
                    label="Tên bàn"
                    initialValue={item.tenBan}
                    rules={[
                      {
                        required: true,
                        message: "Tên bàn không được để trống!",
                      },
                    ]}
                  >
                    <Input style={{ width: "100px" }} placeholder="Tên bàn" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} md={24}>
                  <Form.Item
                    name="sucChua"
                    label="Sức chứa"
                    initialValue={item.sucChua}
                    rules={[
                      {
                        required: true,
                        message: "Sức chứa không được để trống!",
                      },
                    ]}
                  >
                    <InputNumber min={1} placeholder="Sức chứa" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} md={24} style={{ textAlign: "center" }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Cập nhật
                    </Button>
                    <Button
                      type="default"
                      onClick={() => setEditingItem(null)}
                      style={{ marginLeft: "8px" }}
                    >
                      Hủy
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            ) : (
              <div style={{ width: "100%" }}>
                <strong>Khu vực:</strong>{" "}
                {khuVuc ? khuVuc.tenKhuVuc : "Không xác định"} |{" "}
                <strong>Tên bàn:</strong> {item.tenBan} |{" "}
                <strong>Sức chứa:</strong> {item.sucChua}
              </div>
            )}
          </List.Item>
        );
      }}
    />
  );
};

export default FormCapNhatBan;
