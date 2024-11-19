import React, { useState } from "react";
import { List, Card, Row, Col, Button } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons"; // Import biểu tượng dấu cộng

const MenuList = ({ data, onAddItem }) => {
    return (
        <List
            dataSource={data}
            renderItem={(item) => <MenuItem item={item} onAddItem={onAddItem} />}
        />
    );
};

const MenuItem = ({ item, onAddItem }) => {
    const [quantity, setQuantity] = useState(0); // Quản lý số lượng
    const [totalPrice, setTotalPrice] = useState(0); // Quản lý tổng giá

    const handleQuantityChange = (type) => {
        let newQuantity = quantity;
        if (type === "increase") newQuantity++;
        if (type === "decrease" && quantity > 0) newQuantity--;
        setQuantity(newQuantity);
        setTotalPrice(newQuantity * item.price);
    };

    return (
        <List.Item>
            <Card style={{ width: "100%" }} className="card-content">
                <Row align="middle" style={{ textAlign: "left" }}>
                    {/* Cột 1: Hình ảnh */}
                    <Col span={6} style={{ textAlign: "center" }}>
                        <img
                            src={item.image}
                            alt={item.name}
                            style={{
                                height: "auto",
                                objectFit: "cover",
                            }}
                        />
                    </Col>
                    {/* Cột 2: Tên và giá */}
                    <Col span={12}>
                        <h4
                            style={{
                                margin: 0,
                                width: "100%",
                                maxWidth: "80%",
                                height: "auto",
                                objectFit: "cover",
                                color: "orange",
                            }}
                        >
                            {item.name}
                        </h4>
                        <p style={{ fontWeight: "bold", color: "blue" }}>
                            {item.price.toLocaleString()}đ
                        </p>
                        <p style={{ width: "100%", wordBreak: "break-word" }}>
                            lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
                        </p>
                    </Col>
                    {/* Cột 3: Nút bấm */}
                    <Col span={6} style={{ textAlign: "center" }}>
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
