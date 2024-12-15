import React, {useEffect, useState} from "react";
import {Typography, Divider, Row, Col, Spin, Modal, List, Avatar} from "antd"; // Import thêm Spin
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { fetchHoaDonTheoCaLam } from "../../../../store/Slices/HoaDonSlice.ts";
import ChiTietHoaDonModal from "../Modal/ChiTietHoaDonModal";

const { Title, Text } = Typography;

const CaLamDetails = ({ caLam = {} }) => {
    const dispatch = useDispatch();
    const { _id, batDau, ketThuc, id_nhanVien } = caLam;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedHoaDon, setSelectedHoaDon] = useState(null);

    // Lấy danh sách hóa đơn từ Redux
    const hoaDons = useSelector((state: RootState) => state.hoaDon.hoaDons || []);

    // Lấy trạng thái từ Redux
    const status = useSelector((state: RootState) => state.hoaDon.status);

    useEffect(() => {
        if (_id) {
            dispatch(fetchHoaDonTheoCaLam(_id));
        }
    }, [_id, dispatch]);


    const openModal = (hoaDon) => {
        setSelectedHoaDon(hoaDon);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedHoaDon(null);
    };

    return (
        <div style={{ padding: "8px" }}>
            <Title level={5} style={{ fontSize: "24px" }}>Chi tiết ca làm</Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Text strong>Nhân viên mở ca: </Text>
                    {caLam.id_nhanVien.hoTen || "Không xác định"}
                    <br />
                    <Text strong>Ngày mở: </Text>
                    {caLam.batDau ? new Date(caLam.batDau).toLocaleDateString() : "Không xác định"}
                </Col>
                <Col span={12}>
                    <Text strong>Thời gian mở: </Text>
                    {caLam.batDau ? new Date(caLam.batDau).toLocaleTimeString() : "Không xác định"}
                    <br />
                    <Text strong>Thời gian đóng: </Text>
                    {caLam.ketThuc
                        ? new Date(caLam.ketThuc).toLocaleTimeString()
                        : <Text style={{ color: "green", fontWeight: "bold", fontSize: "15px" }}>Đang mở</Text>}
                </Col>
            </Row>
            <Divider />
            <Title level={5} style={{ fontSize: "24px" }}>Chi tiết doanh thu</Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Text strong>Số dư ban đầu: </Text>{caLam.soDuBanDau.toLocaleString()}đ
                    <br />
                    <Text strong>Tổng tiền mặt: </Text>{caLam.tongTienMat.toLocaleString()}đ
                    <br />
                    <Text strong>Tổng thu: </Text>{caLam.tongThu.toLocaleString()}đ
                </Col>
                <Col span={12}>
                    <Text strong>Số dư hiện tại: </Text>{caLam.soDuHienTai.toLocaleString()}đ
                    <br />
                    <Text strong>Tổng chuyển khoản: </Text>{caLam.tongChuyenKhoan.toLocaleString()}đ
                    <br />
                    <Text strong>Tổng chi: </Text>{caLam.tongChi.toLocaleString()}đ
                </Col>
            </Row>
            <Divider />
            <Title level={5}>Danh sách hóa đơn</Title>

            <Spin spinning={status === "loading"} tip="Đang tải...">
                {hoaDons.length > 0 ? (
                    hoaDons.map((hoaDon, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: "16px",
                                padding: "12px",
                                border: "2px solid #d9d9d9",
                                borderRadius: "6px",
                                backgroundColor: "#fafafa",
                                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Text strong>
                                {hoaDon.tenKhuVuc || "Không xác định"} - Bàn: {hoaDon.tenBan || "Không xác định"}
                            </Text>
                            <Divider style={{ margin: "8px 0" }} />
                            <Row>
                                <Col span={12}>
                                    <Text>Thời gian vào:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {hoaDon.thoiGianVao
                                                ? new Date(hoaDon.thoiGianVao).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : "Không xác định"}
                                        </Text>
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text>Thời gian ra:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {hoaDon.thoiGianRa
                                                ? new Date(hoaDon.thoiGianRa).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : "Không xác định"}
                                        </Text>
                                    </Text>
                                </Col>
                            </Row>
                            <Divider style={{ margin: "8px 0" }} />
                            <Row>
                                <Col span={12}>
                                    <Text>Trạng thái:{" "}
                                        <Text style={{
                                            color: hoaDon.trangThai === "Đã Thanh Toán" ? "green" : "red",
                                            fontWeight: "bold",
                                            fontSize: "15px"
                                        }}>
                                            {hoaDon.trangThai || "Không xác định"}
                                        </Text>
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text>Hình thức:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {hoaDon.hinhThucThanhToan ? "Chuyển khoản" : "Tiền mặt"}
                                        </Text>
                                    </Text>
                                </Col>
                            </Row>
                            <Divider style={{ margin: "8px 0" }} />
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Text strong style={{ fontSize: "16px" }}>
                                        Tổng hóa đơn: {hoaDon.tongGiaTri?.toLocaleString() || 0}đ
                                    </Text>
                                </Col>
                                <Col>
                                    <a
                                        style={{ color: "#1890ff" }}
                                        onClick={() => openModal(hoaDon)}
                                    >Xem chi tiết &gt;&gt;&gt;</a>
                                </Col>
                            </Row>
                        </div>
                    ))
                ) : (
                    <Text>Không có hóa đơn nào.</Text>
                )}
            </Spin>
            {selectedHoaDon && (
                <ChiTietHoaDonModal
                    visible={isModalVisible}
                    onCancel={closeModal}
                    hoaDon={selectedHoaDon}
                />
            )}
        </div>
    );
};

export default CaLamDetails;
