import React from 'react';
import { Row, Col } from 'antd';
import DishItemComponent from './DishItemComponent';

const CategoryComponent = ({ monAns }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                padding: '16px',
            }}
        >
            {/* Phần nội dung cuộn */}
            <div
                style={{
                    flex: '1',
                    overflowY: 'auto',
                    paddingBottom: '8px',
                    borderRadius: '8px',
                }}
            >
                <Row gutter={[16, 16]}>
                    {monAns.map((mon) => (
                        <Col xs={24} sm={12} md={12} lg={12} key={mon._id}>
                            <DishItemComponent dish={mon} />
                        </Col>
                    ))}
                </Row>
            </div>
            <div style={{ flex: '0 0 60px', backgroundColor: '#f0f0f0' }}>
                Footer hoặc phần khác
            </div>
        </div>
    );
};

export default CategoryComponent;
