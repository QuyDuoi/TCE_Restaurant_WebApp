import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, List, Row, Col } from 'antd';
import ThucDonData from '../Data/ThucDonData';
import NhomToppingData from '../Data/NhomToppingData';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const OptionsModal = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [activeOption, setActiveOption] = useState('addDish');
    const [editingCategory, setEditingCategory] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [modalState, setModalState] = useState({});

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
            await axios.put(`https://tce-restaurant-api.onrender.com/api/capNhatDanhMuc/${id}`, { tenDanhMuc: newName });
            message.success('Cập nhật danh mục thành công!');
            setEditingCategory(null);
        } catch (error) {
            message.error('Cập nhật danh mục thất bại, vui lòng thử lại.');
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
    

    // const renderForm = () => {
    //     switch (activeOption) {
    //         case 'addDish':
    //     return (
    //     <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
    //         <Form form={form} layout="vertical" onFinish={handleSaveDish}>
    //             <Row gutter={16}>
    //                 {/* Cột bên trái: Tải hình ảnh */}
    //                 <Col span={8}>
    //                     <Form.Item
    //                         name="hinhAnh"
    //                         label="Hình ảnh"
    //                         rules={[{ required: true, message: 'Vui lòng tải hình ảnh lên!' }]}
    //                     >
    //                         <Upload
    //                             listType="picture-card"
    //                             maxCount={1}
    //                             showUploadList={{ showRemoveIcon: true }}
    //                             beforeUpload={(file) => {
    //                                 const isImage =
    //                                     file.type === 'image/jpeg' || file.type === 'image/png';
    //                                 if (!isImage) {
    //                                     message.error('Chỉ chấp nhận định dạng JPG/PNG!');
    //                                 }
    //                                 return isImage || Upload.LIST_IGNORE;
    //                             }}
    //                             onChange={(info) => {
    //                                 if (info.file.status === 'done' || info.file.originFileObj) {
    //                                     const file = info.file.originFileObj || info.file;
    //                                     const reader = new FileReader();
    //                                     reader.onload = (e) => setUploadedImage(e.target.result);
    //                                     reader.readAsDataURL(file);
    //                                 } else {
    //                                     setUploadedImage(null);
    //                                 }
    //                             }}
    //                         >
    //                             {uploadedImage ? (
    //                                 <img
    //                                     src={uploadedImage}
    //                                     alt="Hình ảnh tải lên"
    //                                     style={{ width: '100%' }}
    //                                 />
    //                             ) : (
    //                                 <div>
    //                                     <InboxOutlined style={{ fontSize: 24 }} />
    //                                     <p>Tải hình ảnh lên</p>
    //                                 </div>
    //                             )}
    //                         </Upload>
    //                     </Form.Item>
    //                 </Col>

    //                 {/* Cột bên phải: Các trường nhập liệu */}
    //                 <Col span={16}>
    //                     <Form.Item
    //                         name="danhMuc"
    //                         label="Danh mục"
    //                         rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
    //                     >
    //                         <Select placeholder="Chọn danh mục">
    //                             {ThucDonData.map((danhMuc) => (
    //                                 <Option key={danhMuc._id} value={danhMuc.tenDanhMuc}>
    //                                     {danhMuc.tenDanhMuc}
    //                                 </Option>
    //                             ))}
    //                         </Select>
    //                     </Form.Item>
    //                     <Form.Item
    //                         name="tenMon"
    //                         label="Tên món"
    //                         rules={[{ required: true, message: 'Vui lòng nhập tên món!' }]}
    //                     >
    //                         <Input placeholder="VD: Khoai lang nướng" />
    //                     </Form.Item>
    //                     <Form.Item
    //                         name="giaMon"
    //                         label="Giá món (VNĐ)"
    //                         rules={[{ required: true, message: 'Vui lòng nhập giá món!' }]}
    //                     >
    //                         <Input placeholder="Nhập giá món" type="number" />
    //                     </Form.Item>
    //                     <Form.Item name="nhomTopping" label="Nhóm topping">
    //                         <Select placeholder="Chọn nhóm topping">
    //                             {NhomToppingData.map((topping) => (
    //                                 <Option key={topping._id} value={topping.tenNhom}>
    //                                     {topping.tenNhom}
    //                                 </Option>
    //                             ))}
    //                         </Select>
    //                     </Form.Item>
    //                     <Form.Item name="moTa" label="Mô tả">
    //                         <Input.TextArea placeholder="VD: Tương cà + Tương ớt" />
    //                     </Form.Item>
    //                     <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
    //                         Lưu
    //                     </Button>
    //                 </Col>
    //             </Row>
    //         </Form>
    //     </div>
    // );


    //         case 'addCategory':
    //             return (
    //                 <div
    //                     style={{
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         height: '100%',
    //                     }}
    //                 >
    //                     <Form form={form} layout="vertical" onFinish={handleSaveCategory}>
    //                         <Form.Item
    //                             name="tenDanhMuc"
    //                             label="Tên danh mục"
    //                             rules={[
    //                                 { required: true, message: 'Vui lòng nhập tên danh mục!' },
    //                             ]}
    //                         >
    //                             <Input placeholder="VD: Tráng miệng" />
    //                         </Form.Item>
    //                         <Button type="primary" htmlType="submit">
    //                             Lưu
    //                         </Button>
    //                     </Form>
    //                 </div>
    //             );

    //         case 'editCategory':
    //             return (
    //                 <List
    //                     dataSource={ThucDonData}
    //                     renderItem={(item) => (
    //                         <List.Item
    //                             actions={[
    //                                 <Button
    //                                     type="link"
    //                                     onClick={() => setEditingCategory(item._id)}
    //                                 >
    //                                     Sửa
    //                                 </Button>,
    //                             ]}
    //                         >
    //                             {editingCategory === item._id ? (
    //                                 <Input
    //                                     defaultValue={item.tenDanhMuc}
    //                                     onPressEnter={(e) =>
    //                                         handleEditCategory(item._id, e.target.value)
    //                                     }
    //                                 />
    //                             ) : (
    //                                 item.tenDanhMuc
    //                             )}
    //                         </List.Item>
    //                     )}
    //                 />
    //             );

    //         default:
    //             return null;
    //     }
    // };

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