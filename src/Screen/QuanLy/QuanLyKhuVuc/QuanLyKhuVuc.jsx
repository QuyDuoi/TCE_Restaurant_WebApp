import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Layout, Row, Col, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchKhuVucVaBan } from "../../../store/Thunks/khuVucThunks.ts";
import HeaderBar from "./Component/HeaderBar";
import NavigationTab from "./Component/NavigationTab";
import ItemTable from "./Component/ItemTable";
import TableModal from "./Modal/TableModal";
import { fetchHoaDonTheoNhaHang } from "../../../store/Thunks/hoaDonThunks.ts";
import { searchBanThunk } from "../../../store/Slices/BanSlice.ts";

const { Content } = Layout;

const QuanLyKhuVuc = () => {
  const dispatch = useDispatch();
  const { khuVucs, status } = useSelector((state) => state.khuVuc);
  const { hoaDons } = useSelector((state) => state.hoaDon);
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang?._id;

  const [filteredTables, setFilteredTables] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);

  // Fetch data on mount or when id_nhaHang changes
  useEffect(() => {
    if (!id_nhaHang) return; // Chỉ fetch khi id_nhaHang có giá trị
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchKhuVucVaBan(id_nhaHang));
      await dispatch(fetchHoaDonTheoNhaHang(id_nhaHang));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, id_nhaHang]);

  // Memoize allTables to avoid tính toán lại không cần thiết
  const allTables = useMemo(() => {
    return khuVucs?.flatMap((khuVuc) => khuVuc.bans || []) || [];
  }, [khuVucs]);

  // Cập nhật filteredTables khi khuVucs hoặc status thay đổi
  useEffect(() => {
    if (status === "succeeded" && khuVucs) {
      console.log(`Tổng số bàn khi fetch data: ${allTables.length}`);
      setFilteredTables(allTables);
    }
  }, [allTables, status]);

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);
      console.log(`Đã chọn tab: ${tab}`);

      if (tab === "all") {
        console.log(`Tổng số bàn: ${allTables.length}`);
        setFilteredTables(allTables);
      } else {
        const filtered = allTables.filter((ban) => ban.trangThai === tab);
        console.log(`Số bàn sau khi lọc (${tab}): ${filtered.length}`);
        setFilteredTables(filtered);
      }
    },
    [allTables]
  );

  const handleUpdateStatus = useCallback((tableId, newStatus) => {
    setFilteredTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, trangThai: newStatus } : table
      )
    );
  }, []);

  const handleLoading = useCallback(async () => {
    setLoading2(true);
    await dispatch(fetchKhuVucVaBan(id_nhaHang));
    await dispatch(fetchHoaDonTheoNhaHang(id_nhaHang));
    setLoading2(false);
  }, [dispatch, id_nhaHang]);

  const handleItemClick = useCallback((table) => {
    setSelectedTable(table);
    setIsModalVisible(true);
  }, []);

  const handleSearch = useCallback(
    async (searchValue) => {
      if (!searchValue) {
        handleTabChange(activeTab);
        return;
      }

      const result = await dispatch(searchBanThunk(searchValue));

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
        setFilteredTables([]);
        console.log("Không tìm thấy bàn với từ khóa:", searchValue);
      }
    },
    [dispatch, activeTab, handleTabChange]
  );

  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

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
          flex: 1,
          margin: "10px 5px 10px 20px",
          padding: 10,
          backgroundColor: "white",
          overflowY: "auto",
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
                  key={table.id}
                  xs={12}
                  sm={24}
                  md={12}
                  lg={8}
                  style={{
                    display: "flex",
                    justifyContent: "center",
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
          onUpdateStatus={handleUpdateStatus}
          onLoading={handleLoading}
          thongTinHoaDons={hoaDons}
        />
      )}
    </Layout>
  );
};

export default QuanLyKhuVuc;
