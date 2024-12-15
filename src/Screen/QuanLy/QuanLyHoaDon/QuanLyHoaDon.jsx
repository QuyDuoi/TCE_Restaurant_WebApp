import React, { useEffect, useState } from 'react';
import { Layout, List, Spin, Empty } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { fetchHoaDonTheoCaLam, fetchHoaDonTheoNhaHang } from "../../../store/Slices/HoaDonSlice.ts";
import HeaderBar from './Component/HeaderBar';
import HoaDonItem from "./Component/HoaDonItem";
import HoaDonDetails from "./Component/HoaDonDetails";
import { RootState } from "@reduxjs/toolkit/query";

const { Sider, Content } = Layout;

const QuanLyHoaDon = () => {

    const id_nhaHang = "66fab50fa28ec489c7137537";
    const dispatch = useDispatch();

    const hoaDons = useSelector((state: RootState) => state.hoaDon.hoaDons || []);
    const status = useSelector((state: RootState) => state.hoaDon.status);

    const [selectedHoaDon, setSelectedHoaDon] = useState(null);

    useEffect(() => {
        if (id_nhaHang) {
            dispatch(fetchHoaDonTheoNhaHang(id_nhaHang));
        }
    }, [id_nhaHang, dispatch]);

    useEffect(() => {
        if (hoaDons.length > 0) {
            setSelectedHoaDon(hoaDons[0]);
        }
    }, [hoaDons]);

    const handleHoaDonClick = (hoaDon) => {
        setSelectedHoaDon(hoaDon);
    };

    if (status === "loading") {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <div>Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <p style={{ color: "red" }}>Đã xảy ra lỗi</p>
            </div>
        );
    }

    return (
        <Layout>
            <HeaderBar />
            <Layout>
                <Sider
                    width="50%"
                    theme="light"
                    style={{
                        padding: "20px",
                        borderRight: "1px solid #f0f0f0",
                        overflow: "auto",
                        maxHeight: "calc(100vh - 64px)",
                    }}
                >
                    {hoaDons.length > 0 ? (
                        <List
                            itemLayout="vertical"
                            dataSource={hoaDons}
                            renderItem={(item) => (
                                <HoaDonItem
                                    hoaDon={item}
                                    isSelected={selectedHoaDon ? item._id === selectedHoaDon._id : null}
                                    onClick={() => handleHoaDonClick(item)}
                                />
                            )}
                        />
                    ) : (
                        <Empty description="Không có hóa đơn nào trong ca làm hiện tại"

                        />
                    )}
                </Sider>
                <Content
                    style={{
                        width: "50%",
                        padding: "20px",
                        backgroundColor: "#fff",
                        overflow: "auto",
                    }}
                >
                    {selectedHoaDon ? <HoaDonDetails hoaDon={selectedHoaDon} /> : <Empty description="Chọn một hóa đơn để xem chi tiết" />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default QuanLyHoaDon;
