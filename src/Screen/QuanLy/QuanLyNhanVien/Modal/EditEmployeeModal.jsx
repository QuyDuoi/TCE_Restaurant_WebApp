import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  message,
  Select,
  Switch,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { ipAddress } from "../../../../services/api.ts";
import { useSelector } from "react-redux";
import "./EditEmployeeModal.css"; // Ensure this path is correct

const { Option } = Select;

const EditEmployeeModal = ({ visible, onClose, employee, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();

    // Append employee information to formData
    formData.append("hoTen", values.hoTen);
    formData.append("soDienThoai", values.soDienThoai);
    formData.append("cccd", values.cccd);
    formData.append("vaiTro", values.vaiTro);
    formData.append("trangThai", values.trangThai);
    formData.append("id_nhaHang", id_nhaHang);

    // Append image file if provided
    if (values.hinhAnh && values.hinhAnh.length > 0) {
      formData.append("hinhAnh", values.hinhAnh[0].originFileObj);
    }

    try {
      // Send PUT request to update employee
      const response = await axios.put(
        `${ipAddress}capNhatNhanVien/${employee._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        message.success("Cập nhật nhân viên thành công!");
        form.resetFields();
        onSave(); // Refresh employee list in parent component
        onClose(); // Close the modal
      } else {
        message.error("Đã xảy ra lỗi khi cập nhật nhân viên!");
      }
    } catch (error) {
      console.error("Không thể cập nhật nhân viên:", error);
      message.error("Không thể cập nhật nhân viên, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (info) => {
    if (info.file.status === "removed") {
      message.info("Đã xóa ảnh.");
    } else if (info.file.status === "done" || info.file.status === "uploading") {
      message.success("Chọn ảnh thành công!");
    }
  };

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        hoTen: employee.hoTen,
        soDienThoai: employee.soDienThoai,
        cccd: employee.cccd,
        vaiTro: employee.vaiTro,
        trangThai: employee.trangThai,
        hinhAnh: employee.hinhAnh
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: employee.hinhAnh, // Assuming hinhAnh contains the URL
              },
            ]
          : [],
      });
    }
  }, [employee, form]);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Spin size="large" style={{ color: "white" }} />
        </div>
      )}
      <Modal
        title="Cập nhật thông tin nhân viên"
        visible={visible}
        onCancel={onClose}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          validateMessages={{
            required: "${label} là bắt buộc!",
          }}
          className="edit-employee-form" // Apply custom class
        >
          {/* Họ Tên */}
          <Form.Item
            name="hoTen"
            label="Họ Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          {/* Số Điện Thoại */}
          <Form.Item
            name="soDienThoai"
            label="Số Điện Thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(03|05|07|08|09)\d{8}$/,
                message:
                  "Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam)!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          {/* Số CCCD */}
          <Form.Item
            name="cccd"
            label="Số CCCD"
            rules={[
              { required: true, message: "Vui lòng nhập số CCCD!" },
              {
                pattern: /^[0-9]{12}$/,
                message: "Số CCCD phải có 12 chữ số!",
              },
            ]}
          >
            <Input placeholder="Nhập số CCCD" />
          </Form.Item>

          {/* Vai Trò */}
          <Form.Item
            name="vaiTro"
            label="Vai Trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="Quản lý">Quản lý</Option>
              <Option value="Nhân viên thu ngân">Nhân viên thu ngân</Option>
              <Option value="Nhân viên phục vụ">Nhân viên phục vụ</Option>
              <Option value="Đầu bếp">Đầu bếp</Option>
            </Select>
          </Form.Item>

          {/* Hình Ảnh */}
          <Form.Item
            name="hinhAnh"
            label="Hình Ảnh"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
          >
            <Upload
              name="file"
              maxCount={1}
              listType="picture"
              accept=".png,.jpg,.jpeg"
              beforeUpload={() => false}
              onChange={handleImageChange}
              onRemove={() => message.info("Đã xóa ảnh.")}
            >
              <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
            </Upload>
          </Form.Item>

          {/* Trạng Thái */}
          <Form.Item
            name="trangThai"
            label="Trạng Thái"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Ngừng hoạt động"
            />
          </Form.Item>

          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu thông tin
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EditEmployeeModal;
