import React from 'react';
import { Menu, Typography, Divider } from 'antd';
import {Link, useNavigate} from 'react-router-dom'; // Đừng quên import Link
import {
    UserOutlined,
    AppstoreOutlined,
    SettingOutlined,
    BarChartOutlined,
    PartitionOutlined,
    AlertOutlined,
    HddOutlined,
} from '@ant-design/icons';

import {auth} from "../../../firebase.config";
import {BiLogOut} from "react-icons/bi";

const Sidebar = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log("Đăng xuất thành công");
            // Chuyển người dùng về màn hình đăng nhập
            navigate("/login"); // Thay navigate bằng phương pháp điều hướng của bạn
        } catch (err) {
            console.error("Đăng xuất thất bại: ", err);
        }
    };

    return (
        <div>
            {/* Tiêu đề */}
            <div style={{ padding: '16px', textAlign: 'center', color: '#fff' }}>
                <Typography.Title
                    level={4}
                    style={{
                        color: '#fff',
                        margin: 0,
                        fontSize: '22px',
                        fontWeight: 'bold',
                    }}
                >
                    TCE RESTAURANT
                </Typography.Title>
                <Typography.Text
                    style={{
                        color: '#d3d3d3',
                        fontSize: '11px',
                    }}
                >
                    Ứng dụng quản lý nhà hàng chuyên nghiệp
                </Typography.Text>
            </div>
            {/* Divider */}
            <Divider style={{ borderColor: '#ffffff33', margin: '0 16px' }} />
            {/* Menu */}
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                    {
                        key: '1',
                        icon: <UserOutlined />,
                        label: <Link to="/quanLyNhanVien">Quản lý nhân viên</Link>,
                    },
                    {
                        key: '2',
                        icon: <AppstoreOutlined />,
                        label: <Link to="/quanLyThucDon">Quản lý thực đơn</Link>,
                    },
                    {
                        key: '3',
                        icon: <SettingOutlined />,
                        label: <Link to="/quanLyCa">Quản lý ca</Link>,
                    },
                    {
                        key: '4',
                        icon: <PartitionOutlined />,
                        label: <Link to="/quanLyKhuVuc">Quản lý khu vực</Link>,
                    },
                    {
                        key: '5',
                        icon: <AlertOutlined />,
                        label: <Link to="/quanLyLenMon">Quản lý lên món</Link>,
                    },
                    {
                        key: '6',
                        icon: <HddOutlined />,
                        label: <Link to="/quetToanHoaDon">Quyết toán hóa đơn</Link>,
                    },
                    {
                        key: '7',
                        icon: <BarChartOutlined />,
                        label: <Link to="/thongKe">Thống kê</Link>,
                    },
                    {
                        key: '8',
                        icon: <BarChartOutlined />,
                        label: <Link to="/quanLyTinNhan">Chăm sóc khách hàng</Link>,
                    },
                    {
                        key: '9',
                        icon: <BiLogOut />,
                        label: (
                            <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                Đăng xuất
                            </span>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default Sidebar;
