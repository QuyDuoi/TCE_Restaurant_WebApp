import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import Sidebar from './Component/Sidebar';
import HeaderBar from '../QuanLy/QuanLyNhanVien/Component/HeaderBar';
import EmployeeCard from '../QuanLy/QuanLyNhanVien/Component/EmployeeCard';
import EmployeeFilter from '../QuanLy/QuanLyNhanVien/Component/EmployeeFilter';
import {Outlet} from "react-router-dom";

const { Sider, Content } = Layout;

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
