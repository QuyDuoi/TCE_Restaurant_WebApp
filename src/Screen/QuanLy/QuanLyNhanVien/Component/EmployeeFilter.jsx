import React, { useState, useEffect } from "react";
import { Select, Button, Modal, Checkbox } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

const EmployeeFilter = ({ employees, setFilteredEmployees }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State for filters in modal
  const [modalSelectedStatus, setModalSelectedStatus] = useState([]);
  const [modalSelectedPosition, setModalSelectedPosition] = useState([]);

  // State for external filters
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([]);

  // Filter employees based on external filters
  useEffect(() => {
    let filtered = [...employees];

    if (selectedStatus.length > 0 && !selectedStatus.includes("all")) {
      filtered = filtered.filter((emp) =>
        selectedStatus.includes(emp.trangThai ? "active" : "inactive")
      );
    }

    if (selectedPosition.length > 0 && !selectedPosition.includes("all")) {
      filtered = filtered.filter((emp) =>
        selectedPosition.includes(emp.vaiTro)
      );
    }

    setFilteredEmployees(filtered);
  }, [selectedStatus, selectedPosition, employees]);

  // Apply filters from modal
  const handleApplyFilters = () => {
    setSelectedStatus(modalSelectedStatus);
    setSelectedPosition(modalSelectedPosition);
    setIsModalVisible(false);
  };

  const showModal = () => {
    setModalSelectedStatus(selectedStatus); // Sync modal state with external state
    setModalSelectedPosition(selectedPosition);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      style={{
        marginBottom: "0px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0px",
      }}
    >
      <Button
        icon={<FilterOutlined />}
        size="small"
        type="primary"
        onClick={showModal}
        style={{ display: "flex", alignItems: "center" }}
      >
        Lọc
      </Button>

      <Select
        value={selectedStatus.length > 0 ? selectedStatus[0] : "all"}
        size="small"
        style={{ width: 120 }}
        onChange={(value) => {
          setSelectedStatus(value === "all" ? [] : [value]);
        }}
      >
        <Option value="all">Tất cả</Option>
        <Option value="active">Đang hoạt động</Option>
        <Option value="inactive">Ngưng hoạt động</Option>
      </Select>

      <Select
        value={selectedPosition.length > 0 ? selectedPosition[0] : "all"}
        size="small"
        style={{ width: 120 }}
        onChange={(value) => {
          setSelectedPosition(value === "all" ? [] : [value]);
        }}
      >
        <Option value="all">Tất cả</Option>
        <Option value="Nhân viên phục vụ">Nhân viên phục vụ</Option>
        <Option value="Nhân viên thu ngân">Nhân viên thu ngân</Option>
        <Option value="Chủ quán">Chủ quán</Option>
        <Option value="Quản lý">Quản lý</Option>
      </Select>

      <Modal
        title="Lọc nhân viên"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="apply" type="primary" onClick={handleApplyFilters}>
            Áp dụng
          </Button>,
        ]}
      >
        <div style={{ marginBottom: "16px" }}>
          <strong>Trạng thái</strong>
          <Checkbox.Group
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "8px",
            }}
            onChange={(checkedValues) => setModalSelectedStatus(checkedValues)}
            value={modalSelectedStatus}
          >
            <Checkbox value="active">Đang hoạt động</Checkbox>
            <Checkbox value="inactive">Ngưng hoạt động</Checkbox>
          </Checkbox.Group>
        </div>
        <div>
          <strong>Vị trí</strong>
          <Checkbox.Group
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "8px",
            }}
            onChange={(checkedValues) =>
              setModalSelectedPosition(checkedValues)
            }
            value={modalSelectedPosition}
          >
            <Checkbox value="Nhân viên phục vụ">Nhân viên phục vụ</Checkbox>
            <Checkbox value="Nhân viên thu ngân">Nhân viên quầy</Checkbox>
            <Checkbox value="Chủ quán">Chủ quán</Checkbox>
            <Checkbox value="Quản lý">Quản lý</Checkbox>
          </Checkbox.Group>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeFilter;
