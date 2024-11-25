import React, { useEffect, useState } from 'react';
import { Layout, Tabs } from 'antd';
import HeaderBar from './Component/HeaderBar.jsx';
import TabViewComponent from './Component/TabViewComponent.jsx';
import { ipAddress } from '../../../services/api.ts';

const { Content } = Layout;

const QuanLyThucDon = () => {
    const [danhMucs, setDanhMucs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Trạng thái cho từ khóa tìm kiếm
    const [filteredDishes, setFilteredDishes] = useState([]); // Trạng thái cho món ăn đã lọc

    const id_nhaHang = "66fab50fa28ec489c7137537"; // Ví dụ về id_nhaHang

    useEffect(() => {
        const fetchDanhMucs = async () => {
            try {
                const response = await fetch(`${ipAddress}layDanhSachThucDon?id_nhaHang=${id_nhaHang}`);
                const data = await response.json(); // Chuyển dữ liệu JSON
                setDanhMucs(data); // Cập nhật danh sách
            } catch (error) {
                console.error('Error fetching danh muc:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDanhMucs();
    }, [id_nhaHang]); // Khi id_nhaHang thay đổi, useEffect sẽ chạy lại

    useEffect(() => {
        // Lọc món ăn khi từ khóa tìm kiếm thay đổi
        const allDishes = danhMucs.flatMap((danhMuc) => danhMuc.monAns || []);
        if (searchTerm.trim() === '') {
            setFilteredDishes(allDishes); // Hiển thị tất cả nếu không có từ khóa tìm kiếm
        } else {
            setFilteredDishes(
                allDishes.filter((monAn) =>
                    monAn.tenMon.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, danhMucs]); // Lọc khi từ khóa tìm kiếm hoặc danh sách món ăn thay đổi

    return (
        <Layout>
            {/* Truyền handleSearch vào HeaderBar */}
            <HeaderBar onSearch={setSearchTerm} />
            <Content
                style={{
                    margin: '16px',
                    background: '#f0f2f5',
                    flex: 1,
                    overflowY: 'auto',
                }}
            >
                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>Đang tải dữ liệu...</div>
                ) : (
                    <Tabs
                        defaultActiveKey="all"
                        tabBarStyle={{
                            marginLeft: '25px',
                        }}
                        style={{
                            background: 'white',
                            marginBottom: '10px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Tabs.TabPane
                            tab="Tất cả"
                            key="all"
                            style={{
                                borderRadius: '8px',
                            }}
                        >
                            <TabViewComponent
                                data={{ monAns: filteredDishes }} 
                                style={{
                                    background: 'white',
                                    borderRadius: '8px',
                                    padding: '16px',
                                }}
                            />
                        </Tabs.TabPane>
                        {danhMucs.map((danhMuc) => (
                            <Tabs.TabPane
                                tab={danhMuc.tenDanhMuc}
                                key={danhMuc._id}
                                style={{
                                    borderRadius: '8px',
                                }}
                            >
                                <TabViewComponent
                                    data={danhMuc}
                                    style={{
                                        background: 'white',
                                        borderRadius: '8px',
                                        padding: '16px',
                                    }}
                                />
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                )}
            </Content>
        </Layout>
    );
};

export default QuanLyThucDon;
