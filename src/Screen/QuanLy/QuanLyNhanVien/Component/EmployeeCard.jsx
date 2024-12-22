import React from "react";
import { Card } from "antd";

const EmployeeCard = ({ hoTen, vaiTro, trangThai, hinhAnh }) => {
return (
    <Card
        hoverable
        style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            position: "relative",
            padding: "0", 
            transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
        }}
    >
        {/* Phần Ảnh */}
        <div
            style={{
                width: "60px",
                height: "60px",
                backgroundImage: `url(${hinhAnh})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "50%",
                marginRight: "20px",
                border: "2px solid #f0f0f0",
            }}
        />

        {/* Phần Nội dung */}
        <div style={{ flex: 1 }}>
            <p
                style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    margin: "0",
                    color: "#333",
                }}
            >
                Họ tên: {hoTen}
            </p>
            <p style={{ margin: 0, color: "#666" }}>Chức vụ: {vaiTro}</p>
        </div>

        {/* Tùy chỉnh Chấm trạng thái */}
        <div
            style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "16px",
                height: "16px",
                backgroundColor: trangThai ? "#52c41a" : "#d9d9d9",
                borderRadius: "50%",
                border: "2px solid white",
            }}
        />
    </Card>
);
};

export default EmployeeCard;
