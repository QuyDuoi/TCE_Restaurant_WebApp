import React from "react";
import { Card, Typography, Row, Col } from "antd";

const { Text } = Typography;

const CaLamItem = ({ caLam, isSelected, onClick }) => {
    return (
        <Card
            onClick={onClick}
            style={{
                padding: "10px",
                marginBottom: "16px",
                cursor: "pointer",
                border: isSelected ? "2px solid #1890ff" : "1px solid #f0f0f0",
                backgroundColor: isSelected ? "#e6f7ff" : "#fff",
            }}
        >
            {/* Ngày với cỡ chữ lớn */}
            <Text strong style={{ fontSize: "18px" }}>
                Ngày: {new Date(caLam.batDau).toLocaleDateString()}
            </Text>
            <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={12}>
                    <Text>Thời gian mở: {new Date(caLam.batDau).toLocaleTimeString()}</Text>
                    <br />
                    <Text>Nhân viên mở: {caLam.id_nhanVien?.hoTen || "Không xác định"}</Text>
                </Col>

                <Col span={12}>
                    <Text>Thời gian đóng: {caLam.ketThuc ? new Date(caLam.ketThuc).toLocaleTimeString() :
                        <Text style={{ color: "green", fontWeight: "bold", fontSize: "15px" }}>Đang mở</Text>
                    }</Text>
                    <br />
                    <a style={{ color: "#1890ff" }}>Xem chi tiết &gt;&gt;&gt;</a>
                </Col>
            </Row>
        </Card>
    );
};

export default CaLamItem;
