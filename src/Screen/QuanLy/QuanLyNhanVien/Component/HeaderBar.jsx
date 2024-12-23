import React, { useState } from "react";
import { Input, Button, Row, Col, message, Spin } from "antd";
import AddEmployeeModal from "../Modal/AddEmployeeModel.jsx"; // Ensure correct path
import axios from "axios";
import { ipAddress } from "../../../../services/api.ts";
import { SearchOutlined } from "@ant-design/icons";

const HeaderBar = ({ onSearch, onRefresh }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setloading] = useState(false);

  const handleAddEmployee = async (formData) => {
    setloading(true);

    try {
      const response = await axios.post(`${ipAddress}themNhanVien`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setloading(false);
        message.success("Nhân viên được thêm thành công!");
        onRefresh();
        setIsModalVisible(false); // Close the modal upon success
      } else {
        setloading(false);
        message.error("Đã xảy ra lỗi khi thêm nhân viên!");
      }
    } catch (error) {
      console.error("Error adding employee:", error.message);
      message.error("Không thể thêm nhân viên, vui lòng thử lại!");
      setloading(false);
    }
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Spin size="large" style={{ color: "white" }} />
        </div>
      )}
      <div
        style={{
          background: "#fff",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "100%",
          fontSize: "1.5em",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col style={{ width: "50%" }}>
            <h2 style={{ margin: 0, fontSize: "2vw" }}>Quản lý nhân viên</h2>
          </Col>
          <Col style={{ width: "50%" }}>
          <Input
              placeholder="Tìm kiếm nhân viên"
              style={{ width: "60%", marginRight: "16px" }}
              onChange={(e) => onSearch(e.target.value)}
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} // Added Search Icon
            />
            <Button
              type="primary"
              style={{ width: "30%", fontSize: "1vw" }}
              onClick={() => setIsModalVisible(true)}
            >
              Thêm nhân viên mới
            </Button>
          </Col>
        </Row>
        <AddEmployeeModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAddEmployee={handleAddEmployee}
        />
      </div>
    </>
  );
};

export default HeaderBar;
