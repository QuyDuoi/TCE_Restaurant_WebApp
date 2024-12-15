import React from "react";
import { Table, Button, Row } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const OrderList = ({ orderList, onRemoveItem, onIncreasesoLuongMon, onDecreasesoLuongMon }) => {
    const columns = [
        {
            title: "Tên món",
            dataIndex: "tenMon", // Sử dụng `tenMon` từ backend
            key: "tenMon",
        },
        {
            title: "Số lượng",
            dataIndex: "soLuongMon",
            key: "soLuongMon",
            render: (text, record) => (
                <Row justify="space-between" align="middle">
                    <Button
                        icon={<MinusOutlined />}
                        size="small"
                        onClick={() => onDecreasesoLuongMon(record._id)} // Sử dụng `_id` làm định danh
                    />
                    <span style={{ margin: "0 10px" }}>{text}</span>
                    <Button
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={() => onIncreasesoLuongMon(record._id)}
                    />
                </Row>
            ),
        },
        {
            title: "Đơn giá",
            dataIndex: "giaMonAn", // Sử dụng `giaMonAn` từ backend
            key: "giaMonAn",
            render: (text) => `${text}đ`, // Hiển thị đơn giá theo định dạng tiền tệ
        },
        {
            title: "Tổng giá",
            key: "total",
            render: (text, record) => `${(record.giaMonAn * record.soLuongMon)}đ`, // Tính tổng giá
        },
        {
            title: "",
            key: "action",
            render: (_, record) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemoveItem(record._id)} // Sử dụng `_id` để xóa
                />
            ),
        },
    ];

    return (
        <Table
            dataSource={orderList}
            columns={columns}
            pagination={{ pageSize: 6, showSizeChanger: false }}
            rowKey="_id" // Sử dụng `_id` từ backend làm khóa chính
        />
    );
};

export default OrderList;
