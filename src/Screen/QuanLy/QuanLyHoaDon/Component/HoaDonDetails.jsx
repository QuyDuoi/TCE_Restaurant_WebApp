import React, {useEffect, useState} from "react";
import {Col, Row, Typography, Divider, Button, InputNumber, Table, Spin} from "antd";
import {fetchChiTietHoaDon} from "../../../../store/Slices/ChiTietHoaDonSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import {RootState} from "@reduxjs/toolkit/query";

const { Title, Text } = Typography;

const HoaDonDetails = ({ hoaDon = {} }) => {
    const dispatch = useDispatch();

    const [selectedHoaDon, setSelectedHoaDon] = useState(null);

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
            console.log(chiTietHoaDons);
    }, [hoaDon._id, dispatch]);

    const columns = [
        {
            title: "Món",
            dataIndex: "tenMon", // Sửa thành "tenMon"
            key: "tenMon",
        },
        {
            title: "SL",
            dataIndex: "soLuong", // Sửa thành "soLuong"
            key: "soLuong",
            align: "center",
        },
        {
            title: "Giá",
            dataIndex: "gia", // Sửa thành "gia"
            key: "gia",
            align: "right",
            render: (text) => `${text.toLocaleString()} đ`,
        },
    ];

    const dataSource =
        chiTietHoaDons.map((mon, index) => ({
            key: index,
            tenMon: mon.monAn.tenMon || "Không xác định",
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
                    <Spin spinning={statusChiTietHoaDon === "loading"} tip="Đang tải...">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                    />
                    </Spin>
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
