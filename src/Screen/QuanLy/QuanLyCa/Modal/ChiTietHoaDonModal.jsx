import React, { useEffect } from "react";
import { Modal, Typography, Table, Button, Row, Col, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchChiTietHoaDon } from "../../../../store/Slices/ChiTietHoaDonSlice.ts";
import { RootState } from "@reduxjs/toolkit/query";

const { Title, Text } = Typography;

const ChiTietHoaDonModal = ({ visible, onCancel, hoaDon }) => {
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
    }, [hoaDon, dispatch]);

    const columns = [
        {
            title: "Món",
            dataIndex: "tenMon",
            key: "tenMon",
        },
        {
            title: "SL",
            dataIndex: "soLuong",
            key: "soLuong",
        },
        {
            title: "Giá",
            dataIndex: "gia",
            key: "gia",
            render: (gia) => `${gia.toLocaleString()} đ`,
        },
    ];

    const dataSource =
        chiTietHoaDons.map((mon, index) => ({
            key: index,
            tenMon: mon.id_monAn?.tenMon || "Không xác định",
            soLuong: mon.soLuongMon || 0,
            gia: mon.giaTien || 0,
        })) || [];

    return (
        <Modal
            title={
                <Title
                    level={3}
                    style={{ textAlign: "center", color: "red" }}
                >
                    Thông tin hóa đơn
                </Title>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
            style={{ top: "10%" }}
        >
            <Spin spinning={statusChiTietHoaDon === "loading"} tip="Đang tải...">
                <Row style={{ marginBottom: "16px" }}>
                    <Col span={12}>
                        <Text strong>Bàn ăn: </Text>
                        {hoaDon?.tenBan || "Không xác định"}
                    </Col>
                    <Col span={12}>
                        <Text strong>Thời gian vào: </Text>
                        {hoaDon?.thoiGianVao
                            ? new Date(hoaDon.thoiGianVao).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                            )
                            : "Không xác định"}
                    </Col>
                </Row>
                <Row style={{ marginBottom: "16px" }}>
                    <Col span={12}>
                        <Text strong>Trạng thái thanh toán: </Text>
                        {hoaDon?.trangThai ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Col>
                    <Col span={12}>
                        <Text strong>Giảm giá: </Text>
                        {hoaDon?.tienGiamGia?.toLocaleString()} đ
                    </Col>
                </Row>
                <Title level={5}>Danh sách order</Title>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    bordered
                    summary={(pageData) => {
                        let total = 0;
                        pageData.forEach(({ gia }) => {
                            total += gia;
                        });
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={2}>
                                        <Text strong>Tổng bill:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <Text strong>
                                            {total.toLocaleString()} đ
                                        </Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={2}>
                                        <Text strong>Giảm giá:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <Text strong style={{ color: "red" }}>
                                            -{" "}
                                            {hoaDon?.tienGiamGia?.toLocaleString() ||
                                                0}{" "}
                                            đ
                                        </Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={2}>
                                        <Text
                                            strong
                                            style={{ fontSize: "16px" }}
                                        >
                                            Tổng tiền:
                                        </Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <Text
                                            strong
                                            style={{
                                                fontSize: "16px",
                                                color: "green",
                                            }}
                                        >
                                            {(
                                                total -
                                                (hoaDon?.tienGiamGia || 0)
                                            ).toLocaleString()}{" "}
                                            đ
                                        </Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </>
                        );
                    }}
                />
                <Row justify="end" style={{ marginTop: "16px" }}>
                    {/*<Button*/}
                    {/*    type="primary"*/}
                    {/*    style={{ marginRight: "8px" }}*/}
                    {/*>*/}
                    {/*    Thanh toán*/}
                    {/*</Button>*/}
                    <Button onClick={onCancel}>Đóng</Button>
                </Row>
            </Spin>
        </Modal>
    );
};

export default ChiTietHoaDonModal;
