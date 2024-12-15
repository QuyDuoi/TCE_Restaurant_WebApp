import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchKhuVucVaBan } from '../../../store/Thunks/khuVucThunks.ts';
import HeaderBar from "./Component/HeaderBar";
import NavigationTab from "./Component/NavigationTab";
import ItemTable from "./Component/ItemTable"; // Import component bàn
import TableModal from "./Modal/TableModal"; // Import modal
import chiTietHoaDon from "./Data/chiTietHoaDon";
import { fetchHoaDonTheoNhaHang } from "../../../store/Thunks/hoaDonThunks.ts";
import { resetStatus, searchBanThunk } from "../../../store/Slices/BanSlice.ts";

const { Content } = Layout;

const QuanLyKhuVuc = () => {
  const dispatch = useDispatch();
  const { khuVucs, status } = useSelector((state) => state.khuVuc);
  const { hoaDons, statusHoaDon } = useSelector((state) => state.hoaDon);
  const [filteredTables, setFilteredTables] = useState([]); // Dữ liệu lọc
  const [activeTab, setActiveTab] = useState("all"); // Tab hiện tại
  const [selectedTable, setSelectedTable] = useState(null); // Bàn được chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [loading2, setLoading2] = useState(false); // Trạng thái loading

  const id_nhaHang = '66fab50fa28ec489c7137537';

  const handleLoading = async () => {
    setLoading2(true); // Bắt đầu loading
    await dispatch(fetchKhuVucVaBan(id_nhaHang));
    await dispatch(fetchHoaDonTheoNhaHang(id_nhaHang));
    setLoading2(false)
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      await dispatch(fetchKhuVucVaBan(id_nhaHang));
      await dispatch(fetchHoaDonTheoNhaHang(id_nhaHang));
      setLoading(false)
    };
    fetchData();
  }, [dispatch]);


  useEffect(() => {
    if (status === 'succeeded' && khuVucs) { // Kiểm tra xem khuVuc có tồn tại
      const allTables = khuVucs.flatMap(khuVuc => khuVuc.bans || []
      );

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
  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }
  // Xử lý khi nhấn vào bàn
  const handleItemClick = (table) => {
    setSelectedTable(table);
    setIsModalVisible(true);
  };

  // Xử lý tìm kiếm
  const handleSearch = async (searchValue) => {
    if (!searchValue) {
      // Hiển thị tất cả bàn nếu không có tìm kiếm
      const allTables = khuVucs.flatMap((khuVuc) => khuVuc.bans || []);
      setFilteredTables(allTables);
      return;
    }

    // Gọi API tìm kiếm qua Redux thunk
    const result = await dispatch(searchBanThunk(searchValue));
    
    // Cập nhật danh sách bàn dựa trên kết quả
    if (result.payload) {
      setFilteredTables(result.payload); // Hiển thị kết quả tìm kiếm 

    } else {
      setFilteredTables([]); // Nếu không tìm thấy bàn
    }
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
          flex: 1, // Chiếm toàn bộ chiều cao còn lại
          margin: "10px 5px 10px 20px",
          padding: 10,
          backgroundColor: "white",
          overflowY: "auto", // Cho phép cuộn dọc
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {loading2 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>Đang tải dữ liệu...</div>
        ) : (
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
                  khuVucs={khuVucs}
                  onClick={() => {
                    setSelectedTable(table);
                    setIsModalVisible(true);
                  }}
                />
              </Col>
            ))}
          </Row>
        )}

      </Content>


      {/* Modal */}
      {selectedTable && (
        <TableModal
          area={khuVucs}
          table={selectedTable}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          hoaDonData={hoaDons} // Dữ liệu hóa đơn
          onUpdateStatus={handleUpdateStatus}
          onLoading={handleLoading}
        />
      )}
    </Layout>
  );
};

export default QuanLyKhuVuc;
