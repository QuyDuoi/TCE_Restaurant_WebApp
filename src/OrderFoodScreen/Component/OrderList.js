import React from "react";
import { Table, Button, Row } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const OrderList = ({ orderList, onRemoveItem, onIncreaseQuantity, onDecreaseQuantity }) => {
    const columns = [
        {
            title: "Tên món",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            render: (text, record) => (
                <Row justify="space-between" align="middle">
                    <Button icon={<MinusOutlined />} size="small" onClick={() => onDecreaseQuantity(record.id)} />
                    <span style={{ margin: "0 10px" }}>{text}</span>
                    <Button icon={<PlusOutlined />} size="small" onClick={() => onIncreaseQuantity(record.id)} />
                </Row>
            ),
        },
        {
            title: "Đơn giá",
            dataIndex: "price",
            key: "price",
            render: (text) => `${text.toLocaleString()}đ`,
        },
        {
            title: "Tổng giá",
            key: "total",
            render: (text, record) => `${(record.price * record.quantity).toLocaleString()}đ`,
        },
        {
            title: "",
            key: "action",
            render: (_, record) => (
                <Button danger icon={<DeleteOutlined />} onClick={() => onRemoveItem(record.id)} />
            ),
        },
    ];

    return <Table dataSource={orderList} columns={columns} pagination={{ pageSize: 6, showSizeChanger: false }} rowKey="id" />;
};

export default OrderList;