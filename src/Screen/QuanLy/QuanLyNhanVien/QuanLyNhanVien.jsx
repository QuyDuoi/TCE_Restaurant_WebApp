import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Row,
  Col,
  Card,
  Dropdown,
  Menu,
  Button,
  Spin,
  message,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import HeaderBar from "./Component/HeaderBar";
import EmployeeCard from "./Component/EmployeeCard";
import EmployeeFilter from "./Component/EmployeeFilter";
import DeleteEmployeeModal from "./Modal/DeleteEmployeeModal";
import DetailEmployeeModal from "./Modal/DetailEmployeeModal";
import EditEmployeeModal from "./Modal/EditEmployeeModal";
import { ipAddress } from "../../../services/api.ts";
import { useSelector } from "react-redux";

const { Content } = Layout;

const QuanLyNhanVien = () => {
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [nhanVien, setNhanVien] = useState([]);
  const [loading, setLoading] = useState(true); // Manages initial data fetch loading
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;

  const fetchEmployees = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await axios.get(
        `${ipAddress}layDsNhanVien?id_nhaHang=${id_nhaHang}`
      );
      setNhanVien(response.data);
      setFilteredEmployees(response.data); // Initialize filtered employees
    } catch (error) {
      console.error("Không thể lấy dữ liệu nhân viên:", error);
      message.error("Không thể lấy dữ liệu nhân viên!");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const removeDiacritics = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d") // Replace 'đ' with 'd'
      .replace(/Đ/g, "D"); // Replace 'Đ' with 'D'
  };

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

    if (key === "1") {
      setDetailModalVisible(true);
    } else if (key === "2") {
      setEditModalVisible(true);
    } else if (key === "3") {
      setDeleteModalVisible(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) {
      message.error("Không có nhân viên nào được chọn để xóa!");
      return;
    }
    try {
      await axios.delete(`${ipAddress}xoaNhanVien/${selectedEmployee._id}`);
      await fetchEmployees(false); // Refresh employee list without showing loading
      setDeleteModalVisible(false);
      message.success("Xóa nhân viên thành công!");
    } catch (error) {
      console.error("Không thể xóa nhân viên:", error);
      message.error("Không thể xóa nhân viên, vui lòng thử lại!");
    }
  };

  const handleEdit = async () => {
    try {
      await fetchEmployees(false);
      setEditModalVisible(false);
    } catch (error) {
      console.error("Không thể sửa nhân viên:", error);
      message.error("Không thể sửa nhân viên, vui lòng thử lại!");
    }
  };

  const menu = (employee) => (
    <Menu onClick={({ key }) => handleMenuClick(key, employee)}>
      <Menu.Item key="1">Chi tiết</Menu.Item>
      <Menu.Item key="2">Chỉnh sửa</Menu.Item>
      <Menu.Item key="3">Xóa</Menu.Item>
    </Menu>
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <Layout style={{ flex: 1 }}>

      <HeaderBar
        onSearch={handleSearch}
        onRefresh={() => fetchEmployees(false)}
      />

      <Content
        style={{
          padding: "16px",
          background: "#f0f2f5",
          flex: 1,
          minHeight: "60vh",
          overflowY: "auto",
        }}
      >

        <Card style={{ marginBottom: "16px", padding: "0px" }}>
          <EmployeeFilter
            employees={nhanVien}
            setFilteredEmployees={setFilteredEmployees}
          />
        </Card>

        <div
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Row gutter={[16, 16]} justify="start">
            {filteredEmployees.map((nv) => (
              <Col key={nv._id} xs={24} sm={12} md={8} lg={6}>
                <div
                  style={{
                    position: "relative",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    padding: "0px",
                    margin: "0px",
                  }}
                >
                  <EmployeeCard
                    hoTen={nv.hoTen}
                    vaiTro={nv.vaiTro}
                    trangThai={nv.trangThai}
                    hinhAnh={nv.hinhAnh}
                  />
                  <Dropdown overlay={menu(nv)} trigger={["click"]}>
                    <Button
                      icon={<SettingOutlined />}
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        border: "none",
                        background: "transparent",
                      }}
                    />
                  </Dropdown>
                </div>
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
        onClose={() => setEditModalVisible(false)}
        employee={selectedEmployee}
        onSave={handleEdit}
      />

      <DeleteEmployeeModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default QuanLyNhanVien;
