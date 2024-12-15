import React, { useEffect, useState } from "react";
import { Layout, Tabs, Empty, Spin, Modal, Image, Button } from "antd";
import HeaderBar from "./Component/HeaderBar";
import DishItemComponent from "./Component/DishItemComponent"; // Đường dẫn phụ thuộc cấu trúc thư mục của bạn
import { ipAddress } from "../../../services/api.ts";

const { Content } = Layout;

const QuanLyLenMon = () => {
  const [danhMucs, setDanhMucs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null); // Món ăn được chọn để hiển thị chi tiết

  const id_nhaHang = "66fab50fa28ec489c7137537";

  useEffect(() => {
    const fetchDanhMucs = async () => {
      try {
        const response = await fetch(
          `${ipAddress}layDanhSach?id_nhaHang=${id_nhaHang}`
        );
        const data = await response.json();
        setDanhMucs(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDanhMucs();
  }, [id_nhaHang]);

  const removeDiacritics = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    const allDishes = danhMucs.flatMap((danhMuc) => danhMuc.monAns || []);
    const normalizedSearchTerm = removeDiacritics(searchTerm.trim());

    if (normalizedSearchTerm === "") {
      setFilteredDishes(allDishes);
    } else {
      setFilteredDishes(
        allDishes.filter((monAn) =>
          removeDiacritics(monAn.tenMon).includes(normalizedSearchTerm)
        )
      );
    }
  }, [searchTerm, danhMucs]);

  const renderTabContent = (data) => {
    if (!data || !Array.isArray(data.monAns) || data.monAns.length === 0) {
      return <Empty description="Không có món ăn nào" />;
    }

    return (
      <div>
        {data.monAns.map((dish) => (
          <DishItemComponent
            key={dish._id}
            dish={dish}
            onSelect={() => setSelectedDish(dish)} // Chọn món ăn để hiển thị chi tiết
          />
        ))}
      </div>
    );
  };

  const styles = {
    content: {
      margin: "16px",
      background: "#f0f2f5",
      flex: 1,
      overflowY: "auto",
    },
    tabs: {
      background: "white",
      marginBottom: "10px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    tabPane: {
      borderRadius: "8px",
      padding: "16px",
    },
    tabBar: {
      marginLeft: "25px",
    },
  };

  return (
    <Layout>
      <HeaderBar onSearch={setSearchTerm} />
      <Content style={styles.content}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <Tabs defaultActiveKey="all" tabBarStyle={styles.tabBar} style={styles.tabs}>
            <Tabs.TabPane tab="Tất cả" key="all" style={styles.tabPane}>
              {renderTabContent({ monAns: filteredDishes })}
            </Tabs.TabPane>
            {danhMucs.map((danhMuc) => (
              <Tabs.TabPane
                tab={danhMuc.tenDanhMuc}
                key={danhMuc._id}
                style={styles.tabPane}
              >
                {renderTabContent(danhMuc)}
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </Content>

      {/* Modal hiển thị chi tiết món ăn */}
      {selectedDish && (
        <Modal
          visible={!!selectedDish}
          title="Chi tiết món ăn"
          onCancel={() => setSelectedDish(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedDish(null)}>
              Đóng
            </Button>,
          ]}
        >
          <div style={{ textAlign: "center" }}>
            <Image
              src={selectedDish.anhMonAn}
              alt={selectedDish.tenMon}
              width={120}
              height={120}
              style={{ marginBottom: "10px", borderRadius: "8px" }}
            />
            <h3>{selectedDish.tenMon}</h3>
            <p>Giá: {selectedDish.gia?.toLocaleString()} VND</p>
            <p>Miêu tả: {selectedDish.moTa}</p>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default QuanLyLenMon;

// import React, { useEffect, useState } from "react";
// import { Layout, Tabs, Empty, Spin, Input, Modal, Image, Button } from "antd";
// import HeaderBar from "./Component/HeaderBar";
// import TabViewComponent from "./Component/DishItemComponent";
// import { ipAddress } from "../../../services/api.ts";

// const { Content } = Layout;

// const QuanLyLenMon = () => {
//   const [danhMucs, setDanhMucs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredDishes, setFilteredDishes] = useState([]);
//   const [selectedDish, setSelectedDish] = useState(null); // Món ăn được chọn để hiển thị chi tiết

//   const id_nhaHang = "66fab50fa28ec489c7137537";

//   useEffect(() => {
//     const fetchDanhMucs = async () => {
//       try {
//         const response = await fetch(
//           `${ipAddress}layDanhSach?id_nhaHang=${id_nhaHang}`
//         );
//         const data = await response.json();
//         setDanhMucs(data);
//       } catch (error) {
//         console.error("Lỗi khi tải danh mục:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDanhMucs();
//   }, [id_nhaHang]);

//   const removeDiacritics = (str) =>
//     str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

//   useEffect(() => {
//     const allDishes = danhMucs.flatMap((danhMuc) => danhMuc.monAns || []);
//     const normalizedSearchTerm = removeDiacritics(searchTerm.trim());

//     if (normalizedSearchTerm === "") {
//       setFilteredDishes(allDishes);
//     } else {
//       setFilteredDishes(
//         allDishes.filter((monAn) =>
//           removeDiacritics(monAn.tenMon).includes(normalizedSearchTerm)
//         )
//       );
//     }
//   }, [searchTerm, danhMucs]);

//   const renderTabContent = (data) => {
//     if (!data || !Array.isArray(data.monAns) || data.monAns.length === 0) {
//       return <Empty description="Không có món ăn nào" />;
//     }

//     return (
//       <div>
//         {data.monAns.map((dish) => (
//           <div
//             key={dish._id}
//             onClick={() => setSelectedDish(dish)}
//             style={{
//               padding: "10px",
//               borderBottom: "1px solid #f0f0f0",
//               cursor: "pointer",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <Image
//                 src={dish.anhMonAn}
//                 alt={dish.tenMon}
//                 width={50}
//                 height={50}
//                 style={{ marginRight: "10px", borderRadius: "8px" }}
//               />
//               <div>
//                 <h4 style={{ margin: 0 }}>{dish.tenMon}</h4>
//                 <p style={{ margin: 0, color: "#888" }}>
//                   Giá: {dish.gia?.toLocaleString()} VND
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const styles = {
//     content: {
//       margin: "16px",
//       background: "#f0f2f5",
//       flex: 1,
//       overflowY: "auto",
//     },
//     tabs: {
//       background: "white",
//       marginBottom: "10px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     },
//     tabPane: {
//       borderRadius: "8px",
//       padding: "16px",
//     },
//     tabBar: {
//       marginLeft: "25px",
//     },
//   };

//   return (
//     <Layout>
//       <HeaderBar onSearch={setSearchTerm} />
//       <Content style={styles.content}>
//         {loading ? (
//           <div style={{ textAlign: "center", marginTop: "20px" }}>
//             <Spin tip="Đang tải dữ liệu..." />
//           </div>
//         ) : (
//           <Tabs defaultActiveKey="all" tabBarStyle={styles.tabBar} style={styles.tabs}>
//             <Tabs.TabPane tab="Tất cả" key="all" style={styles.tabPane}>
//               {renderTabContent({ monAns: filteredDishes })}
//             </Tabs.TabPane>
//             {danhMucs.map((danhMuc) => (
//               <Tabs.TabPane
//                 tab={danhMuc.tenDanhMuc}
//                 key={danhMuc._id}
//                 style={styles.tabPane}
//               >
//                 {renderTabContent(danhMuc)}
//               </Tabs.TabPane>
//             ))}
//           </Tabs>
//         )}
//       </Content>

//       {/* Modal hiển thị chi tiết món ăn */}
//       {selectedDish && (
//         <Modal
//           visible={!!selectedDish}
//           title="Chi tiết món ăn"
//           onCancel={() => setSelectedDish(null)}
//           footer={[
//             <Button key="close" onClick={() => setSelectedDish(null)}>
//               Đóng
//             </Button>,
//           ]}
//         >
//           <div style={{ textAlign: "center" }}>
//             <Image
//               src={selectedDish.anhMonAn}
//               alt={selectedDish.tenMon}
//               width={120}
//               height={120}
//               style={{ marginBottom: "10px", borderRadius: "8px" }}
//             />
//             <h3>{selectedDish.tenMon}</h3>
//             <p>Giá: {selectedDish.gia?.toLocaleString()} VND</p>
//             <p>Miêu tả: {selectedDish.moTa}</p>
//           </div>
//         </Modal>
//       )}
//     </Layout>
//   );
// };

// export default QuanLyLenMon;
