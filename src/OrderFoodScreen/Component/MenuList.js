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
    const [soLuongMon, setsoLuongMon] = useState(0); // Quản lý số lượng
    const [totalPrice, setTotalPrice] = useState(0); // Quản lý tổng giá

    const handlesoLuongMonChange = (type) => {
        let newsoLuongMon = soLuongMon;
        if (type === "increase") newsoLuongMon++;
        if (type === "decrease" && soLuongMon > 0) newsoLuongMon--;
        setsoLuongMon(newsoLuongMon);
        setTotalPrice(newsoLuongMon * item.price);
    };

    return (
        <List.Item>
            <Card style={{ width: "100%" }} className="card-content">
                <Row align="middle" style={{ textAlign: "left" }}>
                    {/* Cột 1: Hình ảnh */}
                    <Col span={6} style={{ textAlign: "center" }}>
                        <img
                            src={item.anhMonAn}
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
                            {item.tenMon}
                        </h4>
                        <p style={{ fontWeight: "bold", color: "blue" }}>
                            {item.giaMonAn}đ
                        </p>
                        <p style={{ width: "100%", wordBreak: "break-word" }}>
                            {item.moTa}
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
