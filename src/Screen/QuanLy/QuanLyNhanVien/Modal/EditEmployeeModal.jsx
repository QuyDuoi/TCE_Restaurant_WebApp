import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Switch } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditModal = ({ visible, onClose, employee, onSave }) => {
    const [form] = Form.useForm();
    
    const handleFinish = async (values) => {
        try {
            // Gửi PUT request để cập nhật thông tin nhân viên
            await axios.put(`https://tce-restaurant-api.onrender.com/api/capNhatNhanVien/${employee._id}`, values);
            onSave(); // Gọi hàm onSave để cập nhật danh sách nhân viên
            form.resetFields(); // Đặt lại form
        } catch (error) {
            console.error('Không thể cập nhật nhân viên:', error);
        }
    };

    // Cập nhật giá trị của form khi employee thay đổi
    useEffect(() => {
        if (employee) {
            form.setFieldsValue({
                ...employee,
                trangThai: employee?.trangThai || false, // Đảm bảo trạng thái có giá trị mặc định
            });      
        }
    }, [employee, form]);

    return (
        <Modal
            title="Chỉnh sửa nhân viên"
            width={350}
            visible={visible}
            onCancel={() => {
                onClose();
            }}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleFinish}
            >
                <Form.Item 
                    style={{marginTop:20}}
                    name="hoTen" 
                    label="Họ tên" 
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="vaiTro" 
                    label="Chức vụ" 
                    rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
                >
                    <Select placeholder="Chọn chức vụ">
                        <Option value="Quản lý">Quản lý</Option>
                        <Option value="Nhân viên thu ngân">Nhân viên thu ngân</Option>
                        <Option value="Nhân viên phục vụ">Nhân viên phục vụ</Option>
                        <Option value="Đầu bếp">Đầu bếp</Option>
                    </Select>
                </Form.Item>
                <Form.Item 
                    name="trangThai" 
                    label="Trạng thái"
                    valuePropName="checked"
                >
                    <Switch 
                        checkedChildren="Hoạt động" 
                        unCheckedChildren="Ngừng hoạt động" 
                    />
                </Form.Item>
               <div style={{display:'flex',justifyContent:'center'}}>
               <Form.Item>
                    <Button type="primary" htmlType="submit">Lưu</Button>
                </Form.Item>
               </div>
            </Form>
        </Modal>
    );
};

export default EditModal;