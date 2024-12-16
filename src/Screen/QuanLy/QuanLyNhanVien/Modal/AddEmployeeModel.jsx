import React from "react";
import { Modal, Form, Input, Button, Upload, message, Select, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const AddEmployeeModal = ({ visible, onClose, onAddEmployee }) => {
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        const formData = new FormData();

        // Thêm các trường thông tin nhân viên vào formData
        formData.append("hoTen", values.hoTen);
        formData.append("soDienThoai", values.soDienThoai);
        formData.append("cccd", values.cccd);
        formData.append("vaiTro", values.vaiTro);
        formData.append("id_nhaHang", "66fab50fa28ec489c7137537"); // ID nhà hàng cố định


        // Thêm file ảnh vào formData
        if (values.hinhAnh && values.hinhAnh.file) {
            formData.append("hinhAnh", values.hinhAnh.fileList[0].originFileObj);

        } else {
            message.error("Vui lòng chọn hình ảnh hợp lệ!");
            return;
        }
        try {
            await onAddEmployee(formData); // Gửi formData tới API
            form.resetFields();
            onClose();
        } catch (error) {

        }
    };

    const handleImageChange = (info) => {
        if (info.file.status === "removed") {
            message.error(`Chọn ảnh không thành công.`);
        } else {
            message.success(`Chọn ảnh thành công!`);
        }
    };

    return (
        <Modal
            title="Thêm Nhân Viên"
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                validateMessages={{
                    required: "${label} là bắt buộc!",
                }}
            >
                <Form.Item
                    name="hoTen"
                    label="Họ Tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                    <Input placeholder="Nhập họ tên" />
                </Form.Item>
                <Form.Item
                    name="vaiTro"
                    label="Vai Trò"
                    style={{ width: '40%' }}
                    rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                >
                    <Select placeholder="Chọn vai trò">
                        <Option value="Quản lý">Quản lý</Option>
                        <Option value="Nhân viên thu ngân">Nhân viên thu ngân</Option>
                        <Option value="Nhân viên phục vụ">Nhân viên phục vụ</Option>
                        <Option value="Đầu bếp">Đầu bếp</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="hinhAnh"
                    label="Hình Ảnh"
                    rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
                >
                    <Upload
                        name="file"
                        maxCount={1}
                        listType="picture"
                        beforeUpload={() => false} // Ngăn Upload tự động
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="soDienThoai"
                    label="Số Điện Thoại"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                        {
                            pattern: /^(03|05|07|08|09)\d{8}$/,
                            message: "Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam)!",
                        },
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    name="cccd"
                    label="Số CCCD"
                    rules={[
                        { required: true, message: "Vui lòng nhập số CCCD!" },
                        { pattern: /^[0-9]{12}$/, message: "Số CCCD phải có 12 chữ số!" },
                    ]}
                >
                    <Input placeholder="Nhập số CCCD" />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit">
                        Thêm Nhân Viên
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddEmployeeModal;
