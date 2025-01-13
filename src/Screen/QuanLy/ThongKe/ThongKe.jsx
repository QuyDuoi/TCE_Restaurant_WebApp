// ThongKe.js
import React, { useEffect, useState } from "react";
import { Layout, Spin } from "antd"; // Spin để hiển thị loading
import HeaderBar from "./Component/HeaderBar";
import StatisticsCard from "./Component/RevenueStatistics";
import TopProducts from "./Component/TopProduct";
import { fetchData } from "./Data/ThongKeData";
import { useSelector } from "react-redux";

const ThongKe = () => {
  const [thongKeData, setThongKeData] = useState([]); // Dữ liệu thống kê
  const [dataTop5, setDataTop5] = useState([]); // Dữ liệu top 5 sản phẩm
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang?._id;
  const [filterData, setFilterData] = useState({
    type: "today",
    date: null,
    startDate: null,
    endDate: null,
    id_nhaHang: id_nhaHang,
  });

  useEffect(() => {
    // Fetch dữ liệu khi filterData thay đổi
    const fetchThongKeData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const { ThongKeData, DataTop5 } = await fetchData(filterData);
        setThongKeData(ThongKeData); // Lưu thống kê vào state
        setDataTop5(DataTop5); // Lưu top 5 sản phẩm vào state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Dừng loading
      }
    };

    fetchThongKeData();
  }, [filterData]);

  const handleFilter = (filter) => {
    console.log("Filter Data:", filter);
    setFilterData(filter); // Cập nhật filter để trigger useEffect
  };

  return (
    <Layout>
      <HeaderBar onFilter={handleFilter} />
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        {" "}
        {/* Hiển thị loading */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          {!loading &&
            thongKeData.map((section, index) => (
              <StatisticsCard
                key={index}
                title={section.title}
                items={section.items}
              />
            ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!loading && dataTop5.length > 0 && (
            <TopProducts data={dataTop5[0]} />
          )}
        </div>
      </Spin>
    </Layout>
  );
};

export default ThongKe;
