// src/components/Sidebar.jsx
import React from "react";
import { Menu, Typography, Divider } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Đừng quên import Link và useLocation
import {
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BarChartOutlined,
  PartitionOutlined,
  AlertOutlined,
  HddOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { auth } from "../../../firebase.config";
import { BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const location = useLocation(); // Khởi tạo useLocation để lấy đường dẫn hiện tại

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

  // Xác định key dựa trên đường dẫn hiện tại
  // Nếu đường dẫn có tham số (ví dụ: /orderFood/123), bạn cần lấy phần đầu tiên
  const path = location.pathname.split("/")[1];
  const selectedKey = path ? `/${path}` : "/quanLyNhanVien";

  return (
    <div>
      {/* Tiêu đề */}
      <div style={{ padding: "16px", textAlign: "center", color: "#fff" }}>
        <Typography.Title
          level={4}
          style={{
            color: "#fff",
            margin: 0,
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          TCE RESTAURANT
        </Typography.Title>
        <Typography.Text
          style={{
            color: "#d3d3d3",
            fontSize: "11px",
          }}
        >
          Ứng dụng quản lý nhà hàng chuyên nghiệp
        </Typography.Text>
      </div>
      {/* Divider */}
      <Divider style={{ borderColor: "#ffffff33", margin: "0 16px" }} />
      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]} // Sử dụng selectedKeys thay vì defaultSelectedKeys
        items={[
          {
            key: "/quanLyNhanVien",
            icon: <UserOutlined />,
            label: <Link to="/quanLyNhanVien">Quản lý nhân viên</Link>,
          },
          {
            key: "/quanLyThucDon",
            icon: <AppstoreOutlined />,
            label: <Link to="/quanLyThucDon">Quản lý thực đơn</Link>,
          },
          {
            key: "/quanLyCa",
            icon: <SettingOutlined />,
            label: <Link to="/quanLyCa">Quản lý ca</Link>,
          },
          {
            key: "/quanLyKhuVuc",
            icon: <PartitionOutlined />,
            label: <Link to="/quanLyKhuVuc">Quản lý khu vực</Link>,
          },
          {
            key: "/quanLyLenMon",
            icon: <AlertOutlined />,
            label: <Link to="/quanLyLenMon">Quản lý lên món</Link>,
          },
          {
            key: "/quetToanHoaDon",
            icon: <HddOutlined />,
            label: <Link to="/quetToanHoaDon">Quyết toán hóa đơn</Link>,
          },
          {
            key: "/thongKe",
            icon: <BarChartOutlined />,
            label: <Link to="/thongKe">Thống kê</Link>,
          },
          {
            key: "/quanLyTinNhan",
            icon: <MessageOutlined />,
            label: <Link to="/quanLyTinNhan">Chăm sóc khách hàng</Link>,
          },
          {
            key: "logout",
            icon: <BiLogOut />,
            label: (
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
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
