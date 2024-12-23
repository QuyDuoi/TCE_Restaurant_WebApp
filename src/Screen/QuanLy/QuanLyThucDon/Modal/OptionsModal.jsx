import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  List,
  Row,
  Col,
  Upload,
  message,
  Popconfirm,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchDanhMucVaMonAn } from "../../../../store/Thunks/danhMucThunks.ts";
import { ipAddress } from "../../../../services/api.ts";

const { Option } = Select;

const OptionsModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalState, setModalState] = useState({});
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;
  const dsDanhMuc = useSelector((state) => state.danhMuc.danhMucs);
  const dispatch = useDispatch();

  const handleImageChange = (info) => {
    if (info.file.status === "removed") {
      message.error(`Chọn ảnh không thành công.`);
    } else {
      message.success(`Chọn ảnh thành công!`);
    }
  };

  const handleSaveDish = async (values) => {
    try {
      const formData = new FormData();

      // Thêm các trường thông tin món ăn vào formData
      formData.append("tenMon", values.tenMon);
      formData.append("giaMonAn", values.giaMonAn);
      formData.append("moTa", values.moTa);
      formData.append("id_danhMuc", values.danhMuc);

      // Thêm file ảnh vào formData
      if (values.anhMonAn && values.anhMonAn.length > 0) {
        formData.append("anhMonAn", values.anhMonAn[0].originFileObj);
      } else {
        message.error("Vui lòng chọn hình ảnh hợp lệ!");
        return;
      }

      // Gửi yêu cầu tới API
      await axios.post(`${ipAddress}themMonAn`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Thêm món ăn thành công!");
      dispatch(fetchDanhMucVaMonAn(id_nhaHang));
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error adding dish:", error);
      message.error("Thêm món ăn thất bại, vui lòng thử lại.");
    }
  };

  const handleSaveCategory = async (values) => {
    try {
      await axios.post(`${ipAddress}themDanhMuc`, {
        tenDanhMuc: values.tenDanhMuc,
        id_nhaHang: id_nhaHang,
      });
      message.success("Thêm danh mục mới thành công!");
      dispatch(fetchDanhMucVaMonAn(id_nhaHang));
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
      message.error("Thêm danh mục thất bại, vui lòng thử lại.");
    }
  };

  const capNhatDanhMuc = async (id, newName) => {
    try {
      await axios.put(`${ipAddress}capNhatDanhMuc/${id}`, {
        tenDanhMuc: newName,
        id_nhaHang: id_nhaHang,
      });
      dispatch(fetchDanhMucVaMonAn(id_nhaHang));
      message.success("Cập nhật danh mục thành công!");
      setEditingCategory(null);
    } catch (error) {
      if (error.response) {
        // Backend trả về lỗi
        message.error(`Lỗi: ${error.response.data.msg}`);
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        message.error("Không thể kết nối đến server!");
      } else {
        // Lỗi khác (ví dụ cấu hình axios sai)
        message.error(`Lỗi: ${error.message}`);
      }
    }
  };

  const xoaDanhMuc = async (id) => {
    try {
      await axios.delete(`${ipAddress}xoaDanhMuc/${id}`, {
        data: { id_nhaHang: id_nhaHang },
      });

      dispatch(fetchDanhMucVaMonAn(id_nhaHang));
      message.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Error deleting category:", error);

      if (error.response && error.response.data && error.response.data.msg) {
        message.error(`Xóa danh mục thất bại: ${error.response.data.msg}`);
      } else {
        message.error("Xóa danh mục thất bại!");
      }
    }
  };

  const renderAddDishForm = () => (
    <div style={{ overflowY: "auto", maxHeight: "100%" }}>
      <Form form={form} layout="vertical" onFinish={handleSaveDish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="anhMonAn"
              label="Hình Ảnh"
              rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
            >
              <Upload
                name="file"
                maxCount={1}
                listType="picture"
                beforeUpload={() => false}
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={16}>
            <Form.Item
              name="danhMuc"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select placeholder="Chọn danh mục">
                {dsDanhMuc.map((danhMuc) => (
                  <Option key={danhMuc._id} value={danhMuc._id}>
                    {danhMuc.tenDanhMuc}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="tenMon"
              label="Tên món"
              rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
            >
              <Input placeholder="VD: Khoai lang nướng" />
            </Form.Item>
            <Form.Item
              name="giaMonAn"
              label="Giá món (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập giá món!" }]}
            >
              <Input placeholder="Nhập giá món" type="number" />
            </Form.Item>
            <Form.Item name="moTa" label="Mô tả">
              <Input.TextArea placeholder="VD: Tương cà + Tương ớt" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "16px" }}
            >
              Lưu thông tin
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );

  const renderAddCategoryForm = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSaveCategory}>
        <Form.Item
          name="tenDanhMuc"
          label="Tên danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input placeholder="VD: Tráng miệng" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu thông tin
        </Button>
      </Form>
    </div>
  );

  const renderEditCategoryList = () => (
    <List
      dataSource={dsDanhMuc}
      style={{ overflowY: "auto", maxHeight: "420px" }}
      renderItem={(item) => (
        <List.Item
          actions={[
            // Nút "Sửa"
            <Button
              type="link"
              style={{ padding: "0", color: "blue" }}
              onClick={() => setEditingCategory(item._id)}
            >
              Sửa
            </Button>,

            <span style={{ margin: "0 8px" }}>|</span>, // Thêm khoảng cách giữa các nút

            // Nút "Xóa" với Popconfirm
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa danh mục này không?"
              onConfirm={() => xoaDanhMuc(item._id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="link" style={{ color: "red", padding: 0 }}>
                Xóa
              </Button>
            </Popconfirm>,
          ]}
        >
          {editingCategory === item._id ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                defaultValue={item.tenDanhMuc}
                onChange={(e) => {
                  // Cập nhật tên danh mục trong lúc nhập
                  setModalState({
                    ...modalState,
                    newCategoryName: e.target.value,
                  });
                }}
              />
              <Button
                type="primary"
                onClick={() =>
                  capNhatDanhMuc(item._id, modalState.newCategoryName)
                } // Cập nhật danh mục
                style={{ marginLeft: "10px" }}
              >
                Cập nhật
              </Button>
            </div>
          ) : (
            item.tenDanhMuc
          )}
        </List.Item>
      )}
    />
  );

  const renderContent = () => {
    switch (modalState.activeOption) {
      case "addDish":
        return renderAddDishForm();
      case "addCategory":
        return renderAddCategoryForm();
      case "editCategory":
        return renderEditCategoryList();
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Lựa chọn chức năng"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width="65vw"
      style={{
        padding: "16px",
        maxHeight: "80vh",
      }}
    >
      <Row gutter={16} style={{ minHeight: "65vh" }}>
        <Col span={8}>
          <Button
            type={modalState.activeOption === "addDish" ? "primary" : "default"}
            block
            style={{ marginBottom: "8px" }}
            onClick={() =>
              setModalState({ ...modalState, activeOption: "addDish" })
            }
          >
            Thêm món
          </Button>
          <Button
            type={
              modalState.activeOption === "addCategory" ? "primary" : "default"
            }
            block
            style={{ marginBottom: "8px" }}
            onClick={() =>
              setModalState({ ...modalState, activeOption: "addCategory" })
            }
          >
            Thêm danh mục
          </Button>
          <Button
            type={
              modalState.activeOption === "editCategory" ? "primary" : "default"
            }
            block
            style={{ marginBottom: "8px" }}
            onClick={() =>
              setModalState({ ...modalState, activeOption: "editCategory" })
            }
          >
            Cập nhật danh mục
          </Button>
        </Col>

        <Col span={16} style={{ paddingLeft: "16px", overflowY: "auto" }}>
          {renderContent()}
        </Col>
      </Row>
    </Modal>
  );
};

export default OptionsModal;
