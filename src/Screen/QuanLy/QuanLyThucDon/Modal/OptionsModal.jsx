import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, List, Row, Col } from 'antd';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDanhMucVaMonAn } from '../../../../store/Thunks/danhMucThunks.ts';

const { Option } = Select;

const OptionsModal = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [activeOption, setActiveOption] = useState('addDish');
    const [editingCategory, setEditingCategory] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [modalState, setModalState] = useState({});
    const id_nhaHang = "66fab50fa28ec489c7137537";
    const dsDanhMuc = useSelector((state) => state.danhMuc.danhMucs);
    const dispatch = useDispatch();

    const handleSaveDish = async (values) => {
        try {
            const newDish = {
                ...values,
                hinhAnh: modalState.uploadedImage,
            };
            // Gửi yêu cầu tới API
            await axios.post('https://tce-restaurant-api.onrender.com/api/themMonAn', newDish);
            message.success('Thêm món ăn thành công!');
            form.resetFields();
            onClose(); // Đóng modal
        } catch (error) {
            message.error('Thêm món ăn thất bại, vui lòng thử lại.');
        }
    };
    

    const handleSaveCategory = async (values) => {
        try {
            await axios.post('https://tce-restaurant-api.onrender.com/api/themDanhMuc', values);
            message.success('Thêm danh mục thành công!');
            form.resetFields();
            onClose();
        } catch (error) {
            message.error('Thêm danh mục thất bại, vui lòng thử lại.');
        }
    };
    

    const handleEditCategory = async (id, newName) => {
        try {
            await axios.put(`https://tce-restaurant-api.onrender.com/api/capNhatDanhMuc/${id}`, { tenDanhMuc: newName , id_nhaHang: id_nhaHang});
            dispatch(fetchDanhMucVaMonAn(id_nhaHang));
            message.success('Cập nhật danh mục thành công!');
            setEditingCategory(null);
        } catch (error) {
            if (error.response) {
            // Backend trả về lỗi
            message.error(`Lỗi: ${error.response.data.msg}`);
            } else if (error.request) {
            // Không nhận được phản hồi từ server
            message.error('Không thể kết nối đến server!');
            } else {
            // Lỗi khác (ví dụ cấu hình axios sai)
            message.error(`Lỗi: ${error.message}`);
            }
        }
    };

    const renderAddDishForm = () => (
        <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
            <Form form={form} layout="vertical" onFinish={handleSaveDish}>
                <Row gutter={16}>
                    {/* Cột bên trái: Tải hình ảnh */}
                    <Col span={8}>
                        <Form.Item
                            name="hinhAnh"
                            label="Hình ảnh"
                            rules={[{ required: true, message: 'Vui lòng tải hình ảnh lên!' }]}
                        >
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                showUploadList={{ showRemoveIcon: true }}
                                beforeUpload={(file) => {
                                    const isImage =
                                        file.type === 'image/jpeg' || file.type === 'image/png';
                                    if (!isImage) {
                                        message.error('Chỉ chấp nhận định dạng JPG/PNG!');
                                    }
                                    return isImage || Upload.LIST_IGNORE;
                                }}
                                onChange={(info) => {
                                    if (info.file.status === 'done' || info.file.originFileObj) {
                                        const file = info.file.originFileObj || info.file;
                                        const reader = new FileReader();
                                        reader.onload = (e) => setUploadedImage(e.target.result);
                                        reader.readAsDataURL(file);
                                    } else {
                                        setUploadedImage(null);
                                    }
                                }}
                            >
                                {uploadedImage ? (
                                    <img
                                        src={uploadedImage}
                                        alt="Hình ảnh tải lên"
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    <div>
                                        <InboxOutlined style={{ fontSize: 24 }} />
                                        <p>Tải hình ảnh lên</p>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>

                    {/* Cột bên phải: Các trường nhập liệu */}
                    <Col span={16}>
                        <Form.Item
                            name="danhMuc"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {dsDanhMuc.map((danhMuc) => (
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
                        <Form.Item name="moTa" label="Mô tả">
                            <Input.TextArea placeholder="VD: Tương cà + Tương ớt" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );

    const renderAddCategoryForm = () => (
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

    const renderEditCategoryList = () => (
        <List
            dataSource={dsDanhMuc}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Button
                            type="link"
                            onClick={() => setEditingCategory(item._id)} // Chuyển sang chế độ sửa
                        >
                            Sửa
                        </Button>,
                    ]}
                >
                    {editingCategory === item._id ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input
                                defaultValue={item.tenDanhMuc}
                                onChange={(e) => {
                                    // Cập nhật tên danh mục trong lúc nhập
                                    setModalState({ ...modalState, newCategoryName: e.target.value });
                                }}
                            />
                            <Button
                                type="primary"
                                onClick={() => handleEditCategory(item._id, modalState.newCategoryName)} // Cập nhật danh mục
                                style={{ marginLeft: '10px' }}
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
            case 'addDish':
                return renderAddDishForm();
            case 'addCategory':
                return renderAddCategoryForm();
            case 'editCategory':
                return renderEditCategoryList();
            default:
                return null;
        }
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
                        type={modalState.activeOption === 'addDish' ? 'primary' : 'default'}
                        block
                        style={{ marginBottom: '8px' }}
                        onClick={() => setModalState({ ...modalState, activeOption: 'addDish' })}
                    >
                        Thêm món
                    </Button>
                    <Button
                        type={modalState.activeOption === 'addCategory' ? 'primary' : 'default'}
                        block
                        style={{ marginBottom: '8px' }}
                        onClick={() => setModalState({ ...modalState, activeOption: 'addCategory' })}
                    >
                        Thêm danh mục
                    </Button>
                    <Button
                        type={modalState.activeOption === 'editCategory' ? 'primary' : 'default'}
                        block
                        style={{ marginBottom: '8px' }}
                        onClick={() => setModalState({ ...modalState, activeOption: 'editCategory' })}
                    >
                        Cập nhật danh mục
                    </Button>
                </Col>

                <Col span={16} style={{ paddingLeft: '16px', overflowY: 'auto' }}>
                    {renderContent()}
                </Col>
            </Row>
        </Modal>
    );
};

export default OptionsModal;