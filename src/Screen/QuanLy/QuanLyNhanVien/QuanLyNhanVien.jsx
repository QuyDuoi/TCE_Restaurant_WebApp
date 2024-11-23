import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Row, Col, Card, Dropdown, Menu, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import HeaderBar from './Component/HeaderBar';
import EmployeeCard from './Component/EmployeeCard';
import EmployeeFilter from './Component/EmployeeFilter';
const { Content } = Layout;

const QuanLyNhanVien = () => {
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [nhanVien, setNhanVien] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('https://tce-restaurant-api.onrender.com/api/layDsNhanVien');
            console.log(response);
            
            setNhanVien(response.data);
            setFilteredEmployees(response.data); // Khởi tạo danh sách nhân viên đã lọc
        } catch (error) {
            console.error('Không thể lấy dữ liệu nhân viên:', error);
        } finally {
            setLoading(false); // Kết thúc trạng thái tải
        }
    };
    // Lấy dữ liệu nhân viên từ API
    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSearch = (value) => {
        const normalizedSearch = value.trim().toLowerCase();
        if (normalizedSearch) {
            const filtered = nhanVien.filter((nv) =>
                nv.hoTen.toLowerCase().includes(normalizedSearch)
            );
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

    // Hiển thị trạng thái đang tải
    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <Layout style={{ flex: 1 }}>
            <HeaderBar onSearch={handleSearch} onRefresh={fetchEmployees} />
            <Content
                style={{
                    margin: '16px',
                    padding: '16px',
                    background: '#f0f2f5',
                    flex: 1,
                    overflowY: 'auto',
                }}
            >
                <Card style={{ marginBottom: '16px' }}>
                    <EmployeeFilter
                        employees={nhanVien}
                        setFilteredEmployees={setFilteredEmployees}
                    />
                </Card>
                <div
                    style={{
                        maxHeight: 'calc(100vh - 200px)',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}
                >
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
