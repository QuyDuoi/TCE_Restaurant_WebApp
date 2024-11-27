import React, { useEffect, useState } from "react";
import { Layout, List, Spin } from "antd";
import HeaderBar from "./Component/HeaderBar";
import FilterBar from "./Component/FilterBar";
import CaLamItem from "./Component/CaLamItem";
import CaLamDetails from "./Component/CaLamDetails";
import { useDispatch, useSelector } from "react-redux";
import { fetchCaLam } from "../../../store/Slices/CaLamSlice.ts";

const { Sider, Content } = Layout;

const QuanLyCa = () => {
    const dispatch = useDispatch();
    const { caLams, status, error } = useSelector((state) => state.caLam);
    const [selectedCaLam, setSelectedCaLam] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        dispatch(fetchCaLam());
    }, [dispatch]);

    useEffect(() => {
        if (caLams.length > 0) {
            setSelectedCaLam(caLams[0]);
        }
    }, [caLams]);

    const handleCaLamClick = (caLam) => {
        setSelectedCaLam(caLam);
    };

    const filteredCaLams = selectedDate
        ? caLams.filter((caLam) => {
            const batDauDate = new Date(caLam.batDau).toISOString().slice(0, 10);
            return batDauDate === selectedDate;
        })
        : caLams;

    const sortedCaLamData = [...filteredCaLams].sort((a, b) => {
        const dateA = new Date(a.batDau).getTime();
        const dateB = new Date(b.batDau).getTime();
        return dateB - dateA; // Sắp xếp giảm dần
    });

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
                <p style={{ color: "red" }}>{error || "Đã xảy ra lỗi"}</p>
            </div>
        );
    }

    return (
        <Layout style={{ height: "100vh" }}>
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
                    <FilterBar onDateChange={setSelectedDate} />
                    <List
                        itemLayout="vertical"
                        dataSource={sortedCaLamData}
                        renderItem={(item) => (
                            <CaLamItem
                                caLam={item}
                                isSelected={selectedCaLam ? item._id === selectedCaLam._id : null}
                                onClick={() => handleCaLamClick(item)}
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
                    {selectedCaLam && <CaLamDetails caLam={selectedCaLam} />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default QuanLyCa;
