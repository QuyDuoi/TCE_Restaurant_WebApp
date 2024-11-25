import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import HeaderBar from './Component/HeaderBar';
import RevenueStatistics from './Component/RevenueStatistics ';
import StatisticsCard from './Component/RevenueStatistics ';
import { DataTop5, ThongKeData } from './Data/ThongKeData';
import TopProducts from './Component/TopProduct';


const { Sider, Content } = Layout;


const ThongKe = () => {
  return (
    <Layout>
      <HeaderBar />
      
      <div
        style={{
          marginLeft: "20px",
          display: "flex",
          justifyContent: "space-around",
          width: "95%",
          paddingLeft: "10px",
        }}
      >
        {ThongKeData.map((section, index) => (
          <StatisticsCard key={index} title={section.title} items={section.items} />
        ))}
      </div>
      <div style={{ paddingLeft: "20px", marginTop: "-20px", display: "flex", justifyContent: "center" }}>
        <TopProducts data={DataTop5[0]} />
      </div>
    </Layout>
  );
};

export default ThongKe;
