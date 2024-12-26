// UpdateAreaList.jsx
import React, { useState } from "react";
import { List, Button, Popconfirm, Form, Input, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import message from "antd/es/message";
import { ipAddress } from "../../../../../services/api.ts";
import { fetchKhuVucVaBan } from "../../../../../store/Thunks/khuVucThunks.ts";

const FormCapNhatKhuVuc = () => {
  const dsKhuVuc = useSelector((state) => state.khuVuc.khuVucs);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;

  const [editingItem, setEditingItem] = useState(null);

  const handleUpdateKhuVuc = async (id, newName) => {
    try {
      await axios.put(`${ipAddress}capNhatKhuVuc/${id}`, {
        tenKhuVuc: newName,
        id_nhaHang: id_nhaHang,
      });
      message.success("Cập nhật khu vực thành công!");
      dispatch(fetchKhuVucVaBan(id_nhaHang));
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating area:", error);
      message.error("Cập nhật khu vực thất bại, vui lòng thử lại.");
    }
  };

  const handleDeleteKhuVuc = async (id) => {
    try {
      await axios.delete(`${ipAddress}xoaKhuVuc/${id}`, {
        data: { id_nhaHang: id_nhaHang },
      });
      message.success("Xóa khu vực thành công!");
      dispatch(fetchKhuVucVaBan(id_nhaHang));
    } catch (error) {
      console.error("Error deleting area:", error);
      message.error("Xóa khu vực thất bại, vui lòng thử lại.");
    }
  };

  return (
    <List
      dataSource={dsKhuVuc}
      style={{ overflowY: "auto", maxHeight: "420px" }}
      renderItem={(item) => (
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
              title="Bạn có chắc chắn muốn xóa khu vực này không?"
              onConfirm={() => handleDeleteKhuVuc(item._id)}
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
              layout="inline"
              onFinish={(values) =>
                handleUpdateKhuVuc(item._id, values?.tenKhuVuc)
              }
            >
              <Form.Item
                name="tenKhuVuc"
                label="Tên khu vực"
                initialValue={item?.tenKhuVuc}
                rules={[
                  {
                    required: true,
                    message: "Tên khu vực không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Tên khu vực" />
              </Form.Item>
              <Col
                xs={24}
                sm={8}
                md={24}
                style={{ textAlign: "center", marginTop: "10px" }}
              >
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
            <p>
              <strong>Tên khu vực:</strong> {item?.tenKhuVuc}
            </p>
          )}
        </List.Item>
      )}
    />
  );
};

export default FormCapNhatKhuVuc;
