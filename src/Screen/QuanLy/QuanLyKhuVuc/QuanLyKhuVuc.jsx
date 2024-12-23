import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchKhuVucVaBan } from "../../../store/Thunks/khuVucThunks.ts";
import HeaderBar from "./Component/HeaderBar";
import NavigationTab from "./Component/NavigationTab";
import ItemTable from "./Component/ItemTable"; // Import component bàn
import TableModal from "./Modal/TableModal"; // Import modal
import { fetchHoaDonTheoNhaHang } from "../../../store/Thunks/hoaDonThunks.ts";
import { searchBanThunk } from "../../../store/Slices/BanSlice.ts";

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

  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;

  const handleLoading = async () => {
    setLoading2(true); // Bắt đầu loading
    await dispatch(fetchKhuVucVaBan(id_nhaHang));
    await dispatch(fetchHoaDonTheoNhaHang(id_nhaHang));
    setLoading2(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      await dispatch(fetchKhuVucVaBan(id_nhaHang));
      await dispatch(fetchHoaDonTheoNhaHang(id_nhaHang));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, id_nhaHang]);

  useEffect(() => {
    if (status === "succeeded" && khuVucs) {
      // Kiểm tra xem khuVuc có tồn tại
      const allTables = khuVucs.flatMap((khuVuc) => khuVuc.bans || []);
      console.log(`Tổng số bàn khi fetch data: ${allTables.length}`);
      setFilteredTables(allTables);
    }
  }, [khuVucs, status]);

  // Xử lý khi chọn tab (lọc dữ liệu theo trạng thái)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`Đã chọn tab: ${tab}`);

    if (tab === "all") {
      const allTables = khuVucs.flatMap((khuVuc) => khuVuc.bans || []);
      console.log(`Tổng số bàn: ${allTables.length}`);
      setFilteredTables(allTables);
    } else {
      const filtered = khuVucs
        .flatMap((khuVuc) => khuVuc.bans || [])
        .filter((ban) => ban.trangThai === tab);
      console.log(`Số bàn sau khi lọc (${tab}): ${filtered.length}`);
      setFilteredTables(filtered);
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
      <div style={{ textAlign: "center", padding: "20px" }}>
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
      handleTabChange(activeTab);
      return;
    }

    // Gọi API tìm kiếm qua Redux thunk
    const result = await dispatch(searchBanThunk(searchValue));

    // Cập nhật danh sách bàn dựa trên kết quả và tab hiện tại
    if (result.payload) {
      const searchedTables = result.payload;
      if (activeTab === "all") {
        setFilteredTables(searchedTables);
      } else {
        const filtered = searchedTables.filter(
          (ban) => ban.trangThai === activeTab
        );
        setFilteredTables(filtered);
      }
      console.log(
        `Kết quả tìm kiếm (${searchValue}): ${searchedTables.length}`
      );
    } else {
      setFilteredTables([]); // Nếu không tìm thấy bàn
      console.log("Không tìm thấy bàn với từ khóa:", searchValue);
    }
  };

  return (
    <Layout
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <HeaderBar onSearch={handleSearch} />

      {/* Tabs Nằm Ngang */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 0",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          height: 50,
          marginLeft: "2%",
          marginRight: "2%",
          borderRadius: "8px",
        }}
      >
        <NavigationTab activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

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
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
            <div>Đang tải dữ liệu...</div>
          </div>
        ) : (
          <Row gutter={[16, 16]} justify="start">
            {filteredTables.length > 0 ? (
              filteredTables.map((table) => (
                <Col
                  key={table.id} // Đảm bảo table.id là duy nhất
                  xs={12} // Chiếm toàn bộ chiều ngang ở màn hình nhỏ
                  sm={24} // Chia đôi ở màn hình vừa
                  md={12} // Chia ba ở màn hình lớn hơn
                  lg={8} // Chia bốn ở màn hình lớn
                  style={{
                    display: "flex",
                    justifyContent: "center", // Căn giữa item
                  }}
                >
                  <ItemTable
                    ban={table}
                    id_khuVuc={table.id_khuVuc}
                    khuVucs={khuVucs}
                    onClick={() => handleItemClick(table)}
                  />
                </Col>
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                Không tìm thấy bàn nào theo tiêu chí đã chọn.
              </div>
            )}
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
