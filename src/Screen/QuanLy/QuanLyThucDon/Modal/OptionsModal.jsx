import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, List, Row, Col } from 'antd';
import ThucDonData from '../Data/ThucDonData';
import NhomToppingData from '../Data/NhomToppingData';

const { Option } = Select;

const OptionsModal = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [activeOption, setActiveOption] = useState('addDish');
    const [editingCategory, setEditingCategory] = useState(null);

    const renderForm = () => {
        switch (activeOption) {
            case 'addDish':
                return (
                    <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
                        <Form form={form} layout="vertical" onFinish={handleSaveDish}>
                            <Form.Item
                                name="danhMuc"
                                label="Danh mục"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục">
                                    {ThucDonData.map((danhMuc) => (
                                        <Option key={danhMuc._id} value={danhMuc.tenDanhMuc}>
                                            {danhMuc.tenDanhMuc}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="tenMon"
                                label="Tên món"
                                rules={[{ required: true, message: 'Vui lòng nhập tên món!' }]}
                            >
                                <Input placeholder="VD: Khoai lang nướng" />
                            </Form.Item>
                            <Form.Item
                                name="giaMon"
                                label="Giá món (VNĐ)"
                                rules={[{ required: true, message: 'Vui lòng nhập giá món!' }]}
                            >
                                <Input placeholder="Nhập giá món" type="number" />
                            </Form.Item>
                            <Form.Item name="nhomTopping" label="Nhóm topping">
                                <Select placeholder="Chọn nhóm topping">
                                    {NhomToppingData.map((topping) => (
                                        <Option key={topping._id} value={topping.tenNhom}>
                                            {topping.tenNhom}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="moTa" label="Mô tả">
                                <Input.TextArea placeholder="VD: Tương cà + Tương ớt" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form>
                    </div>
                );

            case 'addCategory':
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <Form form={form} layout="vertical" onFinish={handleSaveCategory}>
                            <Form.Item
                                name="tenDanhMuc"
                                label="Tên danh mục"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên danh mục!' },
                                ]}
                            >
                                <Input placeholder="VD: Tráng miệng" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form>
                    </div>
                );

            case 'editCategory':
                return (
                    <List
                        dataSource={ThucDonData}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="link"
                                        onClick={() => setEditingCategory(item._id)}
                                    >
                                        Sửa
                                    </Button>,
                                ]}
                            >
                                {editingCategory === item._id ? (
                                    <Input
                                        defaultValue={item.tenDanhMuc}
                                        onPressEnter={(e) =>
                                            handleEditCategory(item._id, e.target.value)
                                        }
                                    />
                                ) : (
                                    item.tenDanhMuc
                                )}
                            </List.Item>
                        )}
                    />
                );

            default:
                return null;
        }
    };

    const handleSaveDish = (values) => {
        console.log('Thêm món:', values);
        form.resetFields();
    };

    const handleSaveCategory = (values) => {
        console.log('Thêm danh mục:', values);
        form.resetFields();
    };

    const handleEditCategory = (id, newName) => {
        console.log(`Cập nhật danh mục ID ${id} thành tên mới: ${newName}`);
        setEditingCategory(null);
    };

    return (
        <Modal
            title="Quản lý thực đơn"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width="50vw"
            bodyStyle={{
                minHeight: '60vh',
                maxHeight: '80vh',
                padding: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Row gutter={16} style={{ flexGrow: 1 }}>
                <Col
                    span={8}
                    style={{
                        borderRight: '1px solid #ddd',
                        paddingRight: '16px',
                    }}
                >
                    <Button
                        type={activeOption === 'addDish' ? 'primary' : 'default'}
                        block
                        style={{ marginBottom: '8px' }}
                        onClick={() => setActiveOption('addDish')}
                    >
                        Thêm món
                    </Button>
                    <Button
                        type={activeOption === 'addCategory' ? 'primary' : 'default'}
                        block
                        style={{ marginBottom: '8px' }}
                        onClick={() => setActiveOption('addCategory')}
                    >
                        Thêm danh mục
                    </Button>
                    <Button
                        type={activeOption === 'editCategory' ? 'primary' : 'default'}
                        block
                        style={{ marginBottom: '8px' }}
                        onClick={() => setActiveOption('editCategory')}
                    >
                        Cập nhật danh mục
                    </Button>
                </Col>

                <Col span={16} style={{ paddingLeft: '16px', overflowY: 'auto' }}>
                    {renderForm()}
                </Col>
            </Row>
        </Modal>
    );
};

export default OptionsModal;
