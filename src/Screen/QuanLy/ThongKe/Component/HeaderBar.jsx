import React from 'react';
import { Input, Button, Row, Col,DatePicker } from 'antd';
import { PlusOutlined, FilterOutlined} from '@ant-design/icons';

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
                    <h2 style={{ margin: 0 }}>Quản lý thống kê</h2>
                </Col>
                <Col>
                    <Row gutter={8}>
                        {/* Nút chọn ngày */}
                        <Col>
                            <DatePicker placeholder="Chọn ngày" />
                        </Col>

                        {/* Nút lọc */}
                        <Col>
                            <Button type="primary" icon={<FilterOutlined />}>
                                Lọc
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default HeaderBar;
