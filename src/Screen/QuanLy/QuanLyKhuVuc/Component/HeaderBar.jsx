import React, { useEffect, useState } from "react";
import { Input, Row, Col, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModalOption from "../Modal/ModalOption/ModalOption";

const HeaderBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

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
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            style={{ marginLeft: "10px", width: "100px" }}
          >
            Tùy chọn
          </Button>
        </Col>
      </Row>
      <ModalOption
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default HeaderBar;
