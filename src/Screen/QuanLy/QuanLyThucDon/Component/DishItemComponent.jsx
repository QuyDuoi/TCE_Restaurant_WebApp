import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Menu,
  Switch,
  Modal,
  Input,
  message,
  Form,
  Select,
  Upload,
  Col,
  Row,
} from "antd";
import { SettingOutlined, UploadOutlined } from "@ant-design/icons";
import { ipAddress } from "../../../../services/api.ts";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchDanhMucVaMonAn } from "../../../../store/Thunks/danhMucThunks.ts";

const { Option } = Select;

const DishItemComponent = ({ dish }) => {
  const [status, setStatus] = useState(dish.trangThai);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editDish, setEditDish] = useState(dish);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const dsDanhMuc = useSelector((state) => state.danhMuc.danhMucs);

  const id_nhaHang = user.id_nhaHang._id;

  const [form] = Form.useForm();

  // Hàm hiển thị chi tiết món ăn
  const showDetails = () => {
    Modal.info({
      title: "Chi tiết món ăn",
      content: (
        <div>
          <img
            src={dish.anhMonAn}
            alt={dish.tenMon}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <p>
            <strong>Tên món: </strong>
            {dish.tenMon}
          </p>
          <p>
            <strong>Giá: </strong>
            {dish.giaMonAn.toLocaleString("vi-VN")} đ
          </p>
          <p>
            <strong>Trạng thái: </strong>
            {status ? "Còn hàng" : "Hết hàng"}
          </p>
          <p>
            <strong>Mô tả: </strong>
            {dish.moTa}
          </p>
        </div>
      ),
      onOk() {},
      centered: true,
    });
  };

  const capNhatTrangThaiMon = async (trangThai) => {
    try {
      await axios.put(`${ipAddress}capNhatTrangThaiMon/${dish._id}`, {
        trangThai: trangThai, // Gửi trực tiếp trangThai
      });

      message.success("Cập nhật trạng thái món ăn thành công!");
      setStatus(trangThai); // Cập nhật trạng thái cục bộ
      dispatch(fetchDanhMucVaMonAn(id_nhaHang));
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật trạng thái món:",
        error.response?.data?.msg || error.message
      );
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // Hàm chỉnh sửa món ăn và gửi yêu cầu PUT tới API
  const handleEdit = async () => {
    const values = form.getFieldsValue();
    const formData = new FormData();

    formData.append("tenMon", values.tenMon);
    formData.append("giaMonAn", values.giaMonAn);
    formData.append("moTa", values.moTa);
    formData.append("id_danhMuc", values.danhMuc);

    // Append image file if provided
    if (values.anhMonAn && values.anhMonAn.length > 0) {
      formData.append("anhMonAn", values.anhMonAn[0].originFileObj);
    }

    try {
      // Send PUT request to update dish
      const response = await axios.put(
        `${ipAddress}capNhatMonAn/${dish._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        message.success("Chỉnh sửa món ăn thành công!");
        setIsModalVisible(false);
        dispatch(fetchDanhMucVaMonAn(id_nhaHang)); // Tải lại danh mục và món ăn sau khi cập nhật
      } else {
        message.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error updating dish:", error);
      message.error(error.response.data.msg);
    }
  };

  // Hàm xóa món ăn và gửi yêu cầu DELETE tới API
  const handleDelete = async () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa món ăn này?",
      onOk: async () => {
        try {
          await axios.delete(`${ipAddress}xoaMonAn/${dish._id}`).then((res) => {
            message.success("Xóa món ăn thành công!");
            dispatch(fetchDanhMucVaMonAn(id_nhaHang));
          });
        } catch (error) {
          console.error("Error deleting dish:", error);
          message.error("Xóa món ăn thất bại!");
        }
      },
    });
  };

  const handleImageChange = ({ fileList }) => {
    setEditDish((prev) => ({
      ...prev,
      fileList,
    }));
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={showDetails}>
        Chi tiết
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setIsModalVisible(true)}>
        Chỉnh sửa
      </Menu.Item>
      <Menu.Item key="3" onClick={handleDelete}>
        Xóa món
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "6px",
        height: "110px",
        boxSizing: "border-box",
      }}
    >
      {/* Phần trái: Ảnh món ăn */}
      <div
        style={{
          width: "30%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={dish.anhMonAn}
          alt={dish.tenMon}
          style={{
            width: "90%",
            height: "90%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Phần giữa: Tên món và giá */}
      <div
        style={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 8px",
        }}
      >
        <div
          style={{
            fontSize: "1.0vw",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          {dish.tenMon}
        </div>
        <div
          style={{
            fontSize: "0.8vw",
            color: "green",
          }}
        >
          {dish.giaMonAn.toLocaleString("vi-VN")} đ
        </div>
      </div>

      {/* Phần phải: Toggle và trạng thái */}
      <div
        style={{
          width: "25%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Switch
          checked={status}
          onChange={() => capNhatTrangThaiMon(!status)}
          style={{ marginBottom: "4px" }}
        />
        <div
          style={{
            fontSize: "0.7vw",
            color: status ? "green" : "red",
            textAlign: "center",
          }}
        >
          {status ? "Sẵn sàng" : "Ngưng phục vụ"}
        </div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            icon={<SettingOutlined />}
            style={{
              position: "absolute",
              bottom: "1px",
              right: "5px",
              border: "none",
              background: "transparent",
            }}
          />
        </Dropdown>
      </div>

      {/* Modal chỉnh sửa món ăn */}
      <Modal
        title="Cập nhật thông tin món ăn"
        open={isModalVisible}
        centered
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
          initialValues={{
            danhMuc: editDish.id_danhMuc,
            tenMon: editDish.tenMon,
            giaMonAn: editDish.giaMonAn,
            moTa: editDish.moTa,
            anhMonAn: editDish.anhMonAn
              ? [
                  {
                    uid: "-1",
                    name: "current-image",
                    status: "done",
                    url: editDish.anhMonAn,
                  },
                ]
              : [],
          }}
        >
          <Row gutter={16}>
            <Col xl={12}>
              {/* Danh Mục */}
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
            </Col>

            <Col xl={12}>
              {/* Tên Món */}
              <Form.Item
                name="tenMon"
                label="Tên món"
                rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
              >
                <Input placeholder="VD: Khoai lang nướng" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xl={12}>
              {/* Hình Ảnh */}
              <Form.Item
                name="anhMonAn"
                label="Hình Ảnh"
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
                rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
              >
                <Upload
                  name="file"
                  listType="picture"
                  maxCount={1}
                  accept=".png,.jpg,.jpeg"
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                  fileList={editDish.fileList}
                  onRemove={() => message.info("Đã xóa ảnh.")}
                >
                  <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col xl={12}>
              {/* Giá Món */}
              <Form.Item
                name="giaMonAn"
                label="Giá món (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá món!" },
                  {
                    type: "number",
                    min: 0,
                    message: "Giá món phải là số dương!",
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <Input placeholder="Nhập giá món" type="number" min="0" />
              </Form.Item>
            </Col>
          </Row>

          {/* Mô Tả */}
          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[
              { required: false },
              { max: 200, message: "Mô tả không vượt quá 200 ký tự!" },
            ]}
          >
            <Input.TextArea placeholder="VD: Tương cà + Tương ớt" rows={4} />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DishItemComponent;
