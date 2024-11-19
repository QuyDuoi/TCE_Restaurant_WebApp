import React from 'react';
import { Input, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const HeaderBar = ({ onSearch }) => {
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
                    <Button type="primary" icon={<PlusOutlined />} style={{ width: "30%", fontSize: '1vw' }}>
                        Thêm nhân viên mới
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default HeaderBar;
