import React, { useState } from "react";
import { List, Card, Row, Col, Button, Tag } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";

const MenuList = ({ data, onAddItem }) => {
  return (
    <List
      dataSource={data}
      locale={{ emptyText: "Không có món ăn nào trong danh mục này" }}
      renderItem={(item) => <MenuItem item={item} onAddItem={onAddItem} />}
    />
  );
};

const MenuItem = ({ item, onAddItem }) => {
  const [soLuongMon, setsoLuongMon] = useState(0); // Quản lý số lượng
  const [totalPrice, setTotalPrice] = useState(0); // Quản lý tổng giá

  const handlesoLuongMonChange = (type) => {
    let newsoLuongMon = soLuongMon;
    if (type === "increase") newsoLuongMon++;
    if (type === "decrease" && soLuongMon > 0) newsoLuongMon--;
    setsoLuongMon(newsoLuongMon);
    setTotalPrice(newsoLuongMon * item.giaMonAn);
  };

  return (
    <List.Item>
      <Card style={{ width: "98%" }} className="card-content">
        <Row align="middle" style={{ textAlign: "left" }}>
          {/* Cột 1: Hình ảnh */}
          <Col span={6} style={{ textAlign: "center" }}>
            <img
              src={item.anhMonAn}
              alt={item.tenMon}
              style={{
                objectFit: "cover",
                display: "block",
                padding: "6px",
                borderRadius: "10px",
              }}
            />
          </Col>
          {/* Cột 2: Tên, giá, và trạng thái */}
          <Col span={15}>
            <h4
              style={{
                margin: 0,
                color: "orange",
                paddingLeft: "5px",
              }}
            >
              {item.tenMon}
            </h4>
            <p
              style={{
                fontWeight: "bold",
                color: "blue",
                paddingLeft: "5px",
              }}
            >
              {item.giaMonAn}đ
            </p>
            <p
              style={{
                wordBreak: "break-word",
                paddingLeft: "5px",
              }}
            >
              {item.moTa}
            </p>
            {/* Hiển thị trạng thái món ăn */}
            {item.trangThai === false && (
              <Tag color="red" style={{ marginLeft: "5px" }}>
                Ngưng phục vụ
              </Tag>
            )}
          </Col>
          {/* Cột 3: Nút bấm */}
          <Col span={3} style={{ textAlign: "center" }}>
            <Row
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
              }}
              className="btn-add"
            >
              <Button
                type="primary"
                disabled={!item.trangThai} // Vô hiệu hóa nút nếu món không khả dụng
                style={{
                  width: "30px",
                  height: "30px",
                  color: "white",
                }}
                icon={<PlusSquareOutlined />}
                onClick={() => onAddItem(item)}
              ></Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </List.Item>
  );
};

export default MenuList;
