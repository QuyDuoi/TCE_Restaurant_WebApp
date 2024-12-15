import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Switch, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditModal = ({ visible, onClose, employee, onSave }) => {
    const [form] = Form.useForm();
    const [loading,setLoading] = useState(false);
    const handleFinish = async (values) => {
        setLoading(true);
        try {
            // Gửi PUT request để cập nhật thông tin nhân viên
            await axios.put(`https://tce-restaurant-api.onrender.com/api/capNhatNhanVien/${employee._id}`, values);
            onSave(); // Gọi hàm onSave để cập nhật danh sách nhân viên
            form.resetFields(); // Đặt lại form
        } catch (error) {
            console.error('Không thể cập nhật nhân viên:', error);
        }finally{
            setLoading(false);
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
       <> {loading && (
        <div style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
        }}>
            <Spin size="large" style={{ color: 'white' }} />
        </div>
    )}
       
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
        </>
    );
};

export default EditModal;