import React, { useEffect, useState } from 'react';
import { Layout, List } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { fetchHoaDonTheoNhaHang } from "../../../store/Slices/HoaDonSlice.ts";
import HeaderBar from './Component/HeaderBar';
import HoaDonData from "./Data/HoaDonData";
import CaLamItem from "../QuanLyCa/Component/CaLamItem";
import HoaDonItem from "./Component/HoaDonItem";
import CaLamDetails from "../QuanLyCa/Component/CaLamDetails";
import HoaDonDetails from "./Component/HoaDonDetails";

const { Sider, Content } = Layout;

const QuanLyHoaDon = () => {

    const [selectedHoaDon, setSelectedHoaDon] = useState(null); // Hóa đơn được chọn
    const handleHoaDonClick = (hoaDon) => {
        console.log(hoaDon);
        setSelectedHoaDon(hoaDon);
    };
    useEffect(() => {
        if (HoaDonData.length > 0) {
            setSelectedHoaDon(HoaDonData[0]);
        }
    }, [HoaDonData]);

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
                    <List
                        itemLayout="vertical"
                        dataSource={HoaDonData} // Dữ liệu là danh sách hóa đơn
                        renderItem={(item) => ( // Sử dụng hoaDon thay cho item
                                <HoaDonItem
                                    hoaDon={item} // Sử dụng hoaDon thay cho item
                                    isSelected={selectedHoaDon ? item._id === selectedHoaDon._id : null} // Sử dụng hoaDon thay cho item
                                    onClick={() => handleHoaDonClick(item)} // Sử dụng hoaDon thay cho item
                                />
                        )}
                    />
                </Sider>
                <Content
                    style={{
                        width: "50%",
                        padding: "20px",
                        backgroundColor: "#fff",
                        overflow: "auto",
                    }}
                >
                    {selectedHoaDon && <HoaDonDetails hoaDon={selectedHoaDon} />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default QuanLyHoaDon;
