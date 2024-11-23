import React, { useState } from 'react';
import { Input, Button, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddEmployeeModal from '../Modal/AddEmployeeModel'; // Import modal
import axios from 'axios';

const HeaderBar = ({ onSearch,onRefresh }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddEmployee = async (formData) => {
        try {
            const response = await axios.post(
                'https://tce-restaurant-api.onrender.com/api/themNhanVien',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Đặt header đúng để gửi file
                    },
                }
            );
    
            if (response.status === 201) {
                message.success('Nhân viên được thêm thành công!');
                onRefresh();
            } else {
                message.error('Đã xảy ra lỗi khi thêm nhân viên!');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            message.error('Không thể thêm nhân viên, vui lòng thử lại!');
        }
    };

    return (
        <div
            style={{
                background: '#fff',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '16px',
                width: "100%",
                fontSize: '1.5em'
            }}
        >
            <Row justify="space-between" align="middle">
                <Col style={{ width: '50%' }}>
                    <h2 style={{ margin: 0, fontSize: '2vw' }}>Quản lý nhân viên</h2>
                </Col>
                <Col style={{ width: '50%' }}>
                    <Input
                        placeholder="Tìm kiếm nhân viên"
                        style={{ width: '60%', marginRight: '16px' }}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        style={{ width: "30%", fontSize: '1vw' }} 
                        onClick={() => setIsModalVisible(true)}
                    > 
                        Thêm nhân viên mới
                    </Button>
                </Col>
            </Row>
            <AddEmployeeModal 
                visible={isModalVisible} 
                onClose={() => setIsModalVisible(false)} 
                onAddEmployee={handleAddEmployee} 
            />
        </div>
    );
};

export default HeaderBar;
