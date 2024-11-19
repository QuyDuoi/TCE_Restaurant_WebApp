import React from 'react';
import { Input, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const HeaderBar = () => {
    return (
        <div
            style={{
                background: '#fff',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '16px',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <h2 style={{ margin: 0 }}>Quản Lý lên món</h2>
                </Col>
            </Row>
        </div>
    );
};

export default HeaderBar;
