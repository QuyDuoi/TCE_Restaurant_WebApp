import React, { useState } from "react";
import { Layout, Row, Col } from "antd";
import HeaderBar from "./Component/HeaderBar";
import NavigationTab from "./Component/NavigationTab";
import ItemTable from "./Component/ItemTable"; // Import component bàn
import tableData from "./Data/tableData"; // Import dữ liệu bàn

const { Content } = Layout;

const QuanLyKhuVuc = () => {
  const [filteredTables, setFilteredTables] = useState(tableData); // Dữ liệu lọc
  const [activeTab, setActiveTab] = useState("all"); // Tab hiện tại

  // Xử lý khi chọn tab (lọc dữ liệu theo trạng thái)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      setFilteredTables(tableData);
    } else {
      setFilteredTables(
        tableData.filter((table) => table.trangThai === tab)
      );
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (searchText) => {
    const filteredData = tableData.filter((table) =>
      table.tenBan.toLowerCase().includes(searchText.toLowerCase()) // So khớp tên bàn
    );
    setFilteredTables(
      activeTab === "all"
        ? filteredData
        : filteredData.filter((table) => table.trangThai === activeTab)
    );
  };

  return (
    <Layout style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Thanh header với tìm kiếm */}
      <HeaderBar onSearch={handleSearch} />

      {/* Tabs Nằm Ngang */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 0",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          height: 50,
          marginLeft: "2%",
          marginRight: "2%",
          borderRadius: "8px",
        }}
      >
        <NavigationTab activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Nội dung danh sách bàn */}
      <Content
        style={{
          flex: 1, // Cho phép phần Content chiếm không gian còn lại
          margin: "10px 5px 10px 20px",
          padding: 10,
          backgroundColor: "white",
          overflowY: "auto", // Cho phép cuộn dọc
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={[12, 12]}>
          {filteredTables.map((table) => (
            <Col key={table.id}>
              <ItemTable
                tenBan={table.tenBan}
                id_khuVuc={table.id_khuVuc}
                trangThai={table.trangThai}
                onClick={() =>
                  alert(`Bạn đã chọn ${table.tenBan} - ${table.id_khuVuc}`)
                }
              />
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default QuanLyKhuVuc;
