import React, { useEffect, useState } from "react";
import { Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { searchBanThunk } from "../../../../store/Slices/BanSlice.ts";

const HeaderBar = ({onSearch}) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Gọi callback sau khi người dùng dừng nhập
      onSearch(searchValue);
    }, 800); // 0.8 giây
    return () => clearTimeout(delayDebounceFn); // Xóa timeout khi người dùng tiếp tục nhập
  }, [searchValue, onSearch]);
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
            onChange={(e) => setSearchValue(e.target.value)} // Kích hoạt tìm kiếm khi nhập
          />
        </Col>
      </Row>
    </div>
  );
};

export default HeaderBar;
