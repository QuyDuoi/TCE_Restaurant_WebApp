import React, { useState } from 'react';
import { Layout, Row, Col, Card, Dropdown, Menu, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import HeaderBar from './Component/HeaderBar';
import EmployeeCard from './Component/EmployeeCard';
import EmployeeFilter from './Component/EmployeeFilter';
import nhanVien from './Data/NhanVienData';
import { RemoveVietnameseAccents } from 'remove-vietnamese-accents';

const { Content } = Layout;

const QuanLyNhanVien = () => {
    const [filteredEmployees, setFilteredEmployees] = useState(nhanVien);


    const handleSearch = (value) => {
        const remover = new RemoveVietnameseAccents();
        const searchTerms = remover.remove(value.trim().toLowerCase()).split(/\s+/);

        if (searchTerms.length > 0 && searchTerms[0] !== "") {
            const filtered = nhanVien.filter((nv) => {
                // Kiểm tra tất cả các từ trong chuỗi tìm kiếm
                const normalizedHoTen = remover.remove(nv.hoTen.toLowerCase());
                return searchTerms.every(term => normalizedHoTen.includes(term));
            });
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees(nhanVien);
        }
    };

    const menu = (
        <Menu>
            <Menu.Item key="1">Chi tiết</Menu.Item>
            <Menu.Item key="2">Chỉnh sửa</Menu.Item>
            <Menu.Item key="3">Xóa</Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ flex: 1 }}>
            {/* Header với tìm kiếm */}
            <HeaderBar onSearch={handleSearch} />

            <Content
                style={{
                    margin: '16px',
                    padding: '16px',
                    background: '#f0f2f5',
                    flex: 1,
                    overflowY: 'auto',
                }}
            >
                {/* Employee Filter */}
                <Card style={{ marginBottom: '16px' }}>
                    <EmployeeFilter
                        employees={nhanVien}
                        setFilteredEmployees={setFilteredEmployees}
                    />
                </Card>

                {/* Scrollable Employee List */}
                <div style={{
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto', // Allow vertical scroll only
                    overflowX: 'hidden', // Disable horizontal scroll
                }}>
                    <Row gutter={[16, 16]} justify="start">
                        {filteredEmployees.map((nv, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    style={{
                                        position: 'relative',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <EmployeeCard
                                        hoTen={nv.hoTen}
                                        vaiTro={nv.vaiTro}
                                        trangThai={nv.trangThai}
                                        hinhAnh={nv.hinhAnh}
                                    />
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <Button
                                            icon={<SettingOutlined />}
                                            style={{
                                                position: 'absolute',
                                                bottom: '8px',
                                                right: '8px',
                                                border: 'none',
                                                background: 'transparent',
                                            }}
                                        />
                                    </Dropdown>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};

export default QuanLyNhanVien;
