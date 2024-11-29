import React, { useEffect, useState } from "react";
import { Layout, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchKhuVucVaBan } from '../../../store/Thunks/khuVucThunks.ts';
import HeaderBar from "./Component/HeaderBar";
import NavigationTab from "./Component/NavigationTab";
import ItemTable from "./Component/ItemTable"; // Import component bàn
import TableModal from "./Modal/TableModal"; // Import modal
import hoaDon from "./Data/hoaDon";
import chiTietHoaDon from "./Data/chiTietHoaDon";

const { Content } = Layout;

const QuanLyKhuVuc = () => {
  const dispatch = useDispatch();
  const { khuVucs, status } = useSelector((state) => state.khuVuc); // Sửa đổi ở đây

  const [filteredTables, setFilteredTables] = useState([]); // Dữ liệu lọc
  const [activeTab, setActiveTab] = useState("all"); // Tab hiện tại
  const [selectedTable, setSelectedTable] = useState(null); // Bàn được chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal

  const id_nhaHang = '66fab50fa28ec489c7137537';

  useEffect(() => {
    dispatch(fetchKhuVucVaBan(id_nhaHang));
  }, [dispatch]);
  

  useEffect(() => {
    if (status === 'succeeded' && khuVucs) { // Kiểm tra xem khuVuc có tồn tại
      const allTables = khuVucs.flatMap(khuVuc => khuVuc.bans || []
      );
      console.log(allTables);
      
      setFilteredTables(allTables);
    }
  }, [khuVucs, status]);


  // Xử lý khi chọn tab (lọc dữ liệu theo trạng thái)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      setFilteredTables(khuVucs.flatMap(khuVuc => khuVuc.bans || []));
    } else {
      setFilteredTables(
        khuVucs.flatMap(khuVuc => khuVuc.bans || []).filter(ban => ban.trangThai === tab)
      );
    }
  };
  const handleUpdateStatus = (tableId, newStatus) => {
    setFilteredTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, trangThai: newStatus } : table
      )
    );
  };
  // Xử lý khi nhấn vào bàn
  const handleItemClick = (table) => {
    setSelectedTable(table);
    setIsModalVisible(true);
  };

  return (
    <Layout style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Thanh header với tìm kiếm */}
      <HeaderBar />

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
          flex: 1, // Chiếm toàn bộ chiều cao còn lại
          margin: "10px 5px 10px 20px",
          padding: 10,
          backgroundColor: "white",
          overflowY: "auto", // Cho phép cuộn dọc
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={[16, 16]} justify="start">
          {filteredTables.map((table) => (
            <Col
              key={table.id}
              xs={12} // Chiếm toàn bộ chiều ngang ở màn hình nhỏ
              sm={24} // Chia đôi ở màn hình vừa
              md={12}  // Chia ba ở màn hình lớn hơn
              lg={8}  // Chia bốn ở màn hình lớn
              style={{
                display: "flex",
                justifyContent: "center", // Căn giữa item
              }}
            >
              <ItemTable
                ban={table}
                id_khuVuc={table.id_khuVuc}
                khuVucs = {khuVucs}
                onClick={() => {
                  setSelectedTable(table);
                  setIsModalVisible(true);
                }}
              />
            </Col>
          ))}
        </Row>
      </Content>


      {/* Modal */}
      {selectedTable && (
        <TableModal
          table={selectedTable}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          hoaDonData={hoaDon} // Dữ liệu hóa đơn
          chiTietHoaDonData={chiTietHoaDon} // Dữ liệu chi tiết hóa đơn
          onUpdateStatus={handleUpdateStatus}

        />
      )}
    </Layout>
  );
};

export default QuanLyKhuVuc;
