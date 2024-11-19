import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import Sidebar from './Component/Sidebar';
import HeaderBar from '../QuanLy/QuanLyNhanVien/Component/HeaderBar';
import EmployeeCard from '../QuanLy/QuanLyNhanVien/Component/EmployeeCard';
import EmployeeFilter from '../QuanLy/QuanLyNhanVien/Component/EmployeeFilter';
import {Outlet} from "react-router-dom";

const { Sider, Content } = Layout;

const employees = [
    { name: 'Nguyễn Tiến Triển', role: 'Chủ quán', isActive: true },
    { name: 'Trần Thu Anh', role: 'Thu ngân', isActive: true },
    { name: 'Nguyễn Sỹ Quý', role: 'Chủ quán', isActive: false },
    { name: 'Ngô Đức Lâm', role: 'Chủ quán', isActive: true },
    { name: 'Thanh Hưng', role: 'Quản lý', isActive: true },
    { name: 'Lê Minh Đức', role: 'Chủ quán', isActive: false },
];

const Home = () => {
    return (
        <Layout style={{ height: '100vh' }}>
            {/* Sidebar */}
            <Sider width={250} style={{ background: '#001529' }}>
                <Sidebar />
            </Sider>
            <Layout>

                <Content >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
