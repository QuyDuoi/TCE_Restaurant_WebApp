import React, { useState } from 'react';
import { Input, Button, Row, Col, DatePicker, Dropdown, Menu } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';

const HeaderBar = ({ onFilter }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('Hôm nay');

    const filterOptions = [
        { title: 'Hôm nay', type: 'today' },
        { title: 'Hôm qua', type: 'yesterday' },
        { title: '7 ngày trước', type: '7days' },
        { title: '30 ngày trước', type: '30days' },
        { title: 'Tháng trước', type: 'lastMonth' },
    ];

    const menu = (
        <Menu
            onClick={(e) => {
                const filter = filterOptions.find((item) => item.type === e.key);
                setSelectedFilter(filter.title);
                onFilter({ date: selectedDate, type: filter.type });
            }}
        >
            {filterOptions.map((item) => (
                <Menu.Item key={item.type}>{item.title}</Menu.Item>
            ))}
        </Menu>
    );

    const handleDateChange = (date, dateString) => {
        setSelectedDate(dateString);
        // Gửi thông tin ngày với type "choiceDay"
        onFilter({ date: dateString, type: 'choiceDay' });
        console.log(dateString);
        
    };

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
                            <DatePicker
                                placeholder="Chọn ngày"
                                onChange={handleDateChange}
                            />
                        </Col>

                        {/* Nút lọc */}
                        <Col>
                            <Dropdown overlay={menu}>
                                <Button type="primary" icon={<FilterOutlined />}>
                                    {selectedFilter}
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default HeaderBar;
