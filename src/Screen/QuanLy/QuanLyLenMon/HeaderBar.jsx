import React, { useEffect, useState } from "react";
import { Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") // Tách các ký tự Unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
    .replace(/đ/g, "d") // Chuyển đổi ký tự đ
    .replace(/Đ/g, "D") // Chuyển đổi ký tự Đ
    .toLowerCase(); // Đưa về chữ thường
};

const HeaderBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Gọi callback sau khi người dùng dừng nhập
      onSearch(searchValue);
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, onSearch]);
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "8px",
      }}
    >
      <Row justify="space-between" align="middle">
        {/* Tiêu đề */}
        <Col>
          <h2 style={{ margin: 0, fontSize: "2vw" }}>Quản Lý Lên Món</h2>
        </Col>

        {/* Ô tìm kiếm */}
        <Col>
          <Input
            placeholder="Tìm kiếm món..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setSearchValue(e.target.value)} // Kích hoạt tìm kiếm khi nhập
          />
        </Col>
      </Row>
    </div>
  );
};

export default HeaderBar;
