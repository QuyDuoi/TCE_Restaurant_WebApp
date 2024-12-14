import React, {useEffect} from "react";
import { Col, Row, Typography, Divider, Button, InputNumber, Table } from "antd";
import {fetchChiTietHoaDon} from "../../../../store/Slices/ChiTietHoaDonSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import {RootState} from "@reduxjs/toolkit/query";

const { Title, Text } = Typography;

const HoaDonDetails = ({ hoaDon = {} }) => {
    const dispatch = useDispatch();

    const chiTietHoaDons = useSelector(
        (state: RootState) => state.chiTietHoaDon.chiTietHoaDons || []
    );
    const statusChiTietHoaDon = useSelector(
        (state: RootState) => state.chiTietHoaDon.status
    );

    useEffect(() => {
        if (hoaDon && hoaDon._id) {
            dispatch(fetchChiTietHoaDon(hoaDon._id));
        }
        console.log("abc ",chiTietHoaDons.monAn);
    }, [hoaDon, dispatch]);
    // Example data, replace with real props or state
    // const exampleData = {
    //     table: "Bàn 5 | Tầng 2",
    //     time: "12:00 | 20/10/2024",
    //     status: "Chưa thanh toán",
    //     discount: 500000,
    //     items: [
    //         { key: 1, name: "Cơm thập cẩm", quantity: 4, price: 100000 },
    //         { key: 2, name: "Thịt nướng giòn", quantity: 2, price: 120000 },
    //         { key: 3, name: "Tôm hùm Alaska", quantity: 1, price: 680000 },
    //         { key: 4, name: "Món phụ 1", quantity: 3, price: 50000 },
    //         { key: 5, name: "Món phụ 2", quantity: 2, price: 40000 },
    //         { key: 6, name: "Món phụ 3", quantity: 5, price: 60000 },
    //         { key: 7, name: "Món phụ 4", quantity: 1, price: 30000 },
    //         { key: 8, name: "Món phụ 5", quantity: 4, price: 70000 },
    //         { key: 9, name: "Món phụ 6", quantity: 2, price: 80000 },
    //         { key: 10, name: "Món phụ 7", quantity: 6, price: 90000 },
    //     ],
    // };
    //
    // const calculateTotal = (monAn) => {
    //     return monAn.reduce((total, item) => total + item.quantity * item.price, 0);
    // };
    //
    // const totalBill = calculateTotal(exampleData.items);
    // const finalAmount = totalBill - exampleData.discount;

    const columns = [
        {
            title: "Món",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "SL",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (text) => `${text} đ`,
        },
    ];

    const dataSource =
        chiTietHoaDons.map((mon, index) => ({
            key: index,
            tenMon: mon.monAn?.tenMon || "Không xác định",
            soLuong: mon.soLuongMon || 0,
            gia: mon.giaTien || 0,
        })) || [];

    return (
        <div style={{ padding: 0, background: "#fff", maxWidth: 600, margin: "0 auto", height: "88vh", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: "1 0 auto", overflowY: "auto" }}>
                <div style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10, paddingBottom: 10, paddingTop: 10 }}>
                    <Title level={3} style={{ textAlign: "center", color: "red" }}>
                        Thông tin hóa đơn
                    </Title>
                    <Row>
                        <Col span={12}>
                            <Text strong>Bàn ăn:</Text>
                            <br />
                            <Text>Bàn 1</Text>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Text strong>Thời gian vào:</Text>
                            <br />
                            <Text>{new Date(hoaDon.thoiGianVao).toLocaleTimeString()}</Text>
                        </Col>
                    </Row>

                    <Divider />

                    <Row>
                        <Col span={12}>
                            <Text strong>Trạng thái thanh toán:</Text>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Text>{hoaDon.trangThai}</Text>
                        </Col>
                    </Row>

                    <Divider />

                    <Row>
                        <Col span={12}>
                            <Text strong>Giảm giá:</Text>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <InputNumber
                                defaultValue={hoaDon.tienGiamGia}
                                formatter={(value) => `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value.replace(/\s?|(,*)/g, "")}
                                style={{ width: "100%" }}
                            />
                        </Col>
                    </Row>

                    <Divider />
                </div>

                <div>
                    <Title level={5} style={{ paddingLeft: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Danh sách order</span>
                        <Button type="link" style={{ padding: 0, marginRight: 20 }}>Chỉnh sửa</Button>
                    </Title>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                    />
                </div>

                <Divider />

                <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Col span={12}>
                        <Text strong>Tổng bill:</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Text>{hoaDon.tongGiaTri} đ</Text>
                    </Col>
                </Row>
                <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Col span={12}>
                        <Text strong>Giảm giá:</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Text>- {hoaDon.tienGiamGia} đ</Text>
                    </Col>
                </Row>
                <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Col span={12}>
                        <Text strong>Tổng tiền:</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Text style={{ color: "green", fontWeight:'bold' }}>{hoaDon.tongGiaTri} đ</Text>
                    </Col>
                </Row>
            </div>

            <Divider />

            <div style={{ flexShrink: 0, paddingBottom: 20, position: "sticky", bottom: 0, background: "#fff", paddingTop: 10 }}>
                <Row justify="center" gutter={16}>
                    <Col>
                        <Button type="primary">Thanh toán</Button>
                    </Col>
                    <Col>
                        <Button>Đóng</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default HoaDonDetails;
