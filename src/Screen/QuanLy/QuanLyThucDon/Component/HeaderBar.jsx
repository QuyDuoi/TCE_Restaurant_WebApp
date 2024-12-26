import React, { useState } from "react";
import { Input, Button, Row, Col } from "antd";
import OptionsModal from "../Modal/OptionsModal";
import { SearchOutlined } from "@ant-design/icons";

const HeaderBar = ({ onSearch }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timer, setTimer] = useState(null); // State để lưu ID của setTimeout

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear timeout trước đó nếu có
    if (timer) {
      clearTimeout(timer);
    }

    // Thiết lập timeout mới
    const newTimer = setTimeout(() => {
      onSearch(value);
    }, 800);

    // Lưu ID của timeout vào state để clear khi cần
    setTimer(newTimer);
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "0px",
        width: "100%",
        fontSize: "1.5em",
      }}
    >
      <Row justify="space-between" align="middle">
        <Col style={{ width: "50%" }}>
          <h2 style={{ margin: 0, fontSize: "2vw" }}>Quản lý thực đơn</h2>
        </Col>
        <Col style={{ width: "50%" }}>
          <Input
            value={searchTerm} // Set value to controlled component
            placeholder="Tìm kiếm món ăn"
            style={{ width: "60%", marginRight: "16px" }}
            onChange={handleSearchChange}
            allowClear
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />} // Added Search Icon
          />
          <Button
            type="primary"
            style={{ width: "30%", fontSize: "1vw" }}
            onClick={() => setIsModalVisible(true)}
          >
            Tùy chọn
          </Button>
        </Col>
      </Row>
      <OptionsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default HeaderBar;
