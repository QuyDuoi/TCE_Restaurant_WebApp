import React, { useEffect, useState } from 'react';
import { Layout, Spin, Tabs } from 'antd';
import HeaderBar from './Component/HeaderBar.jsx';
import TabViewComponent from './Component/TabViewComponent.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDanhMucVaMonAn } from '../../../store/Thunks/danhMucThunks.ts';

const { Content } = Layout;

const QuanLyThucDon = () => {
    const [danhMucs, setDanhMucs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Trạng thái cho từ khóa tìm kiếm
    const [filteredDishes, setFilteredDishes] = useState([]); // Trạng thái cho món ăn đã lọc

    const id_nhaHang = "66fab50fa28ec489c7137537"; // Ví dụ về id_nhaHang
    const dispatch = useDispatch();
    const dsDanhMuc = useSelector((state) => state.danhMuc.danhMucs);
    const dsMonAn = useSelector((state) => state.monAn.monAns);

    useEffect(() => {
        const fetchDanhMucs = async () => {
            try {
                await dispatch(fetchDanhMucVaMonAn(id_nhaHang));
                setDanhMucs(dsDanhMuc); // Cập nhật danh sách
                setFilteredDishes(dsMonAn);
            } catch (error) {
                console.error('Error fetching danh muc:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDanhMucs();
    }, []);

    const removeDiacritics = (str) => {
        return str
            .normalize('NFD') // Chuyển đổi các ký tự có dấu thành tổ hợp ký tự.
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các ký tự tổ hợp (dấu).
            .toLowerCase(); // Chuyển về chữ thường.
    };

    useEffect(() => {
        // Lọc món ăn khi từ khóa tìm kiếm thay đổi
        const allDishes = dsMonAn;
        const normalizedSearchTerm = removeDiacritics(searchTerm.trim());
        if (normalizedSearchTerm === '') {
            setFilteredDishes(allDishes); // Hiển thị tất cả nếu không có từ khóa tìm kiếm
        } else {
            setFilteredDishes(
                allDishes.filter((monAn) =>
                    removeDiacritics(monAn.tenMon).includes(normalizedSearchTerm)
                )
            );
        }
    }, [searchTerm, danhMucs]); // Lọc khi từ khóa tìm kiếm hoặc danh sách món ăn thay đổi
    
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
                <div>Đang tải dữ liệu...</div>
            </div>
        );
    }

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
                        {dsDanhMuc.map((danhMuc) => {
                            // Lọc các món ăn thuộc danh mục
                            const monAnsByDanhMuc = dsMonAn.filter(
                                (monAn) => monAn.id_danhMuc === danhMuc._id // Giả sử `danhMucId` là trường tham chiếu đến danh mục
                            );
                            
                            return (
                                <Tabs.TabPane
                                    tab={danhMuc.tenDanhMuc}
                                    key={danhMuc._id}
                                    style={{
                                        borderRadius: '8px',
                                    }}
                                >
                                    <TabViewComponent
                                        data={{ monAns: monAnsByDanhMuc }} // Truyền danh sách món ăn của danh mục vào đây
                                        style={{
                                            background: 'white',
                                            borderRadius: '8px',
                                            padding: '16px',
                                        }}
                                    />
                                </Tabs.TabPane>
                            );
                        })}
                    </Tabs>
            </Content>
        </Layout>
    );
};

export default QuanLyThucDon;
