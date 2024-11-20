import React from 'react';
import { Layout, Tabs } from 'antd';
import HeaderBar from './Component/HeaderBar';
import ThucDonData from './Data/ThucDonData';
import TabViewComponent from './Component/TabViewComponent';

const { Content } = Layout;

const QuanLyThucDon = () => {
    // Tổng hợp tất cả món ăn từ các danh mục
    const allDishes = ThucDonData.flatMap((danhMuc) => danhMuc.monAns);

    return (
        <Layout>
            <HeaderBar />
            <Content
                style={{
                    margin: '16px',
                    background: '#f0f2f5',
                    flex: 1,
                    overflowY: 'auto',
                }}
            >
                <div>
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
                                data={{ monAns: allDishes }}
                                style={{
                                    background: 'white',
                                    borderRadius: '8px',
                                    padding: '16px',
                                }}
                            />
                        </Tabs.TabPane>
                        {ThucDonData.map((danhMuc) => (
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
                </div>
            </Content>
        </Layout>
    );
};

export default QuanLyThucDon;
