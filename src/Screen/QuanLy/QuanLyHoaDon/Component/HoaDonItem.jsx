import React from "react";
import { Card, Typography, Row, Col } from "antd";

const { Text } = Typography;

const HoaDonItem = ({ hoaDon, isSelected, onClick }) => {
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
                Khu vực: Bàn 4 - Tâng 1
            </Text>
            <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={12}>
                    <Text style={{fontWeight: 'bold'}}>Giờ vào:
                        <Text style={{fontWeight: 'normal'}}> {new Date(hoaDon.thoiGianVao).toLocaleTimeString()}</Text>
                    </Text>
                    <br/>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>Tổng tiền:
                        <Text style={{color: 'red', fontWeight: 'normal'}}> {hoaDon.tongGiaTri}</Text>
                    </Text>
                </Col>

                <Col span={12}>
                    {/*<Text>Thời gian đóng: {hoaDon.ketThuc ? new Date(hoaDon.ketThuc).toLocaleTimeString() :*/}
                    {/*    <Text style={{ color: "green", fontWeight: "bold", fontSize: "15px" }}>Đang mở</Text>*/}
                    {/*}</Text>*/}
                    <br />
                    <a style={{ color: "#1890ff" }}>Xem chi tiết &gt;&gt;&gt;</a>
                </Col>
            </Row>
        </Card>
    );
};

export default HoaDonItem;
