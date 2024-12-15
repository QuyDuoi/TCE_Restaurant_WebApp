import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Row, Col, Card, Dropdown, Menu, Button, Spin } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import HeaderBar from './Component/HeaderBar';
import EmployeeCard from './Component/EmployeeCard';
import EmployeeFilter from './Component/EmployeeFilter';
import DeleteEmployeeModal from './Modal/DeleteEmployeeModal'
import DetailEmployeeModal from './Modal/DetailEmployeeModal'
import EditEmployeeModal from './Modal/EditEmployeeModal'
import NotificationModal from './Modal/NotificationModal'
const { Content } = Layout;

const QuanLyNhanVien = () => {
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [nhanVien, setNhanVien] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('https://tce-restaurant-api.onrender.com/api/layDsNhanVien');
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

    //hàm xử lý bỏ dấu 
    const removeDiacritics = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
            .replace(/đ/g, "d") // Thay thế chữ "đ" thành "d"
            .replace(/Đ/g, "D"); // Thay thế chữ "Đ" thành "D"
    };
    
    //hàm search nhân viên không dấu
    const handleSearch = (value) => {
        const normalizedSearch = removeDiacritics(value.trim().toLowerCase());
        if (normalizedSearch) {
            const filtered = nhanVien.filter((nv) =>
                removeDiacritics(nv.hoTen.toLowerCase()).includes(normalizedSearch)
            );
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees(nhanVien);
        }
    };
    
    const handleMenuClick = (key, employee) => {
        setSelectedEmployee(employee);

        if (key === '1') {
            setDetailModalVisible(true);
        } else if (key === '2') {
            setEditModalVisible(true);
        } else if (key === '3') {
            setDeleteModalVisible(true);
        }
    };

    const handleDelete = async () => {
        if (!selectedEmployee) {
            console.error('Không có nhân viên nào được chọn để xóa');
            return;
        }

        try {
            await axios.delete(`https://tce-restaurant-api.onrender.com/api/xoaNhanVien/${selectedEmployee._id}`);
            fetchEmployees(); // Refresh danh sách nhân viên
            setDeleteModalVisible(false);

            // Hiển thị thông báo xóa thành công
            setNotificationMessage('Xóa nhân viên thành công!');
            setNotificationVisible(true);
        } catch (error) {
            console.error('Không thể xóa nhân viên:', error);
        }
    };
    const handleEdit = () => {
        try {
            fetchEmployees();
            setEditModalVisible(false)
            setNotificationMessage('Sửa nhân viên thành công!');
            setNotificationVisible(true);
        } catch (error) {
            console.error('Không thể sửa nhân viên:', error);
        }
    }
    const menu = (employee) => (
        <Menu onClick={({ key }) => handleMenuClick(key, employee)}>
            <Menu.Item key="1">Chi tiết</Menu.Item>
            <Menu.Item key="2">Chỉnh sửa</Menu.Item>
            <Menu.Item key="3">Xóa</Menu.Item>
        </Menu>
    );

    // Hiển thị trạng thái đang tải
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
                <div>Đang tải dữ liệu...</div>
            </div>
        );
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
                                    <Dropdown overlay={menu(nv)} trigger={['click']}>
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

            <DetailEmployeeModal
                visible={isDetailModalVisible}
                onClose={() => setDetailModalVisible(false)}
                employee={selectedEmployee}
            />

            <EditEmployeeModal
                visible={isEditModalVisible}
                onClose={() => setEditModalVisible(false)} // Giữ selectedEmployee không thay đổi
                employee={selectedEmployee} // Đảm bảo truyền selectedEmployee vào
                onSave={() => handleEdit()}
            />
            <DeleteEmployeeModal
                visible={isDeleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onDelete={handleDelete}
            />
            <NotificationModal
                notificationMessage={notificationMessage}
                notificationVisible={notificationVisible}
                setNotificationVisible={() => setNotificationVisible()}

            />
        </Layout>
    );
};

export default QuanLyNhanVien;
