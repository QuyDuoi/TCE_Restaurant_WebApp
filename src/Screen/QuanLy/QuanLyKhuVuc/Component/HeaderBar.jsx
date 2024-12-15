import React from "react";
import { Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const HeaderBar = ({ onSearch }) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "16px",
      }}
    >
      <Row justify="space-between" align="middle">
        {/* Tiêu đề */}
        <Col>
          <h2 style={{ margin: 0 }}>Quản Lý Khu Vực</h2>
        </Col>

        {/* Ô tìm kiếm */}
        <Col>
          <Input
            placeholder="Tìm kiếm bàn..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => onSearch(e.target.value)} // Kích hoạt tìm kiếm khi nhập
          />
        </Col>
      </Row>
    </div>
  );
};

export default HeaderBar;
