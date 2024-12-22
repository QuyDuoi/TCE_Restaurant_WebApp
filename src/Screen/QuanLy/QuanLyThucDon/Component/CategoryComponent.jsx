import React from 'react';
import { Row, Col, Empty } from 'antd'; // Thêm Empty component từ antd
import DishItemComponent from './DishItemComponent';

const CategoryComponent = ({ monAns }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '78vh',
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
                {monAns && monAns.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {monAns.map((mon) => (
                            <Col xs={24} sm={12} md={12} lg={8} key={mon._id}>
                                <DishItemComponent dish={mon} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                        <Empty description="Danh mục này chưa có món ăn" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryComponent;
