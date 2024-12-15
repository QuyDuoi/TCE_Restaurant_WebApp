import React, { useState } from 'react';
import { Input, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const HeaderBar = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
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
                    <h2 style={{ margin: 0, fontSize: '2vw' }}>Quản Lý Lên Món</h2>
                </Col>
                <Col style={{ width: '50%' }}>
                    <Input
                        placeholder="Tìm kiếm món ăn"
                        style={{ width: '60%', marginRight: '16px' }}

                    />
                    
                </Col>
            </Row>
            {/* <OptionsModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            /> */}
        </div>
    );
};

export default HeaderBar;
