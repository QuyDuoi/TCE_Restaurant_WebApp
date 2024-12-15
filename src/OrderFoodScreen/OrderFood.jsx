import React, { useEffect, useState } from "react";
import { Row, Col, Input, Button, Tabs, Badge, Modal, List } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import MenuList from "./Component/MenuList";
import OrderList from "./Component/OrderList";
import axios from "axios";
import "./OrderFood.css";
import {ipAddress} from "../services/api.ts"
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const OrderFood = () => {
  const { idBan } = useParams();
  const [orderList, setOrderList] = useState([]); // Danh sách món trong giỏ
  const [activeTab, setActiveTab] = useState("all"); // Tab hiện tại
  const [isCartModalVisible, setCartModalVisible] = useState(false); // Hiển thị giỏ hàng
  const [listMonAn, setListMonAn] = useState([]); // Danh sách thực đơn từ API
  const [filteredMonAn, setFilteredMonAn] = useState([]); // Danh sách thực đơn đã lọc
  const [searchText, setSearchText] = useState(""); // Từ khóa tìm kiếm

  // Lấy danh sách thực đơn từ API
  useEffect(() => {
    const layDanhSachThucDon = async () => {
      try {
        const id_nhaHang = "66fab50fa28ec489c7137537"; // ID nhà hàng
        const response = await axios.get(
          `${ipAddress}layDanhSachThucDon`,
          { params: { id_nhaHang } }
        );
        setListMonAn(response.data);
        setFilteredMonAn(response.data); // Gán mặc định danh sách đã lọc
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    };
    layDanhSachThucDon();
  }, []);

  // Tìm kiếm món ăn (Debounce 1 giây)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText.trim() === "") {
        setFilteredMonAn(listMonAn); // Nếu không có từ khóa thì trả lại toàn bộ
      } else {
        const filtered = listMonAn.map((category) => ({
          ...category,
          monAns: category.monAns.filter((item) =>
            item.tenMon.toLowerCase().includes(searchText.toLowerCase())
          ),
        })).filter((category) => category.monAns.length > 0);
        setFilteredMonAn(filtered);
      }
    }, 1000);

    return () => clearTimeout(timeoutId); // Clear timeout khi nhập mới
  }, [searchText, listMonAn]);

  // Thêm món vào giỏ hàng
  const handleAddItem = (item) => {
    const existingItem = orderList.find((order) => order._id === item._id);
    if (existingItem) {
      existingItem.soLuongMon += 1;
      setOrderList([...orderList]);
    } else {
      setOrderList([...orderList, { ...item, soLuongMon: 1 }]);
    }
  };

  // Xóa món khỏi giỏ hàng
  const handleRemoveItem = (id) => {
    setOrderList(orderList.filter((order) => order._id !== id));
  };

  // Tăng số lượng món
  const handleIncreasesoLuongMon = (id) => {
    setOrderList(
      orderList.map((order) =>
        order._id === id ? { ...order, soLuongMon: order.soLuongMon + 1 } : order
      )
    );
  };

  // Giảm số lượng món
  const handleDecreasesoLuongMon = (id) => {
    setOrderList(
      orderList
        .map((order) =>
          order._id === id ? { ...order, soLuongMon: Math.max(order.soLuongMon - 1, 1) } : order
        )
        .filter((order) => order.soLuongMon > 0)
    );
  };

  // Lọc danh sách món theo tab hiện tại
  const getFilteredMenu = () => {
    if (activeTab === "all") {
      return filteredMonAn.flatMap((category) => category.monAns);
    }
    const category = filteredMonAn.find((cat) => cat._id === activeTab);
    return category ? category.monAns : [];
  };

  return (
    <Row gutter={16} style={{ padding: "10px" , height: "calc(100vh - 10px)"}}>
      {/* Danh sách món ăn */}
      <Col xs={24} sm={24} md={14} style={{ marginBottom: "20px" }}>
        <h3>Danh sách món ăn</h3>
        <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
          <Col flex="1">
            <Input.Search
              placeholder="Tìm món ăn"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col style={{ marginLeft: "10px" }}>
            <Badge count={orderList.length} offset={[5, 0]}>
              <ShoppingCartOutlined
                className="cart-icon"
                style={{ fontSize: "24px", cursor: "pointer", color: "#1890ff" }}
                onClick={() => setCartModalVisible(true)}
              />
            </Badge>
          </Col>
        </Row>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} type="card">
          <TabPane tab="Tất cả" key="all">
            <div className="menu-list-container">
              <MenuList data={getFilteredMenu()} onAddItem={handleAddItem} />
            </div>
          </TabPane>
          {filteredMonAn.map((category) => (
            <TabPane tab={category.tenDanhMuc} key={category._id}>
              <div className="menu-list-container">
                <MenuList data={category.monAns} onAddItem={handleAddItem} />
              </div>
            </TabPane>
          ))}
        </Tabs>
      </Col>

      {/* Danh sách order */}
      <Col xs={24} sm={24} md={10} className="order-list-container">
        <h3>Danh sách order</h3>
        <OrderList
          orderList={orderList}
          onRemoveItem={handleRemoveItem}
          onIncreasesoLuongMon={handleIncreasesoLuongMon}
          onDecreasesoLuongMon={handleDecreasesoLuongMon}
        />
        <Row justify="space-between" style={{ marginTop: "20px" }}>
          <Button danger onClick={() => setOrderList([])}>
            Hủy thông tin
          </Button>
          <Button type="primary">Xác nhận gọi món</Button>
        </Row>
      </Col>

      {/* Modal giỏ hàng */}
      <Modal
        title="Giỏ hàng của bạn"
        visible={isCartModalVisible}
        onCancel={() => setCartModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCartModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="confirm" type="primary">
            Xác nhận gọi món
          </Button>,
        ]}
      >
        {orderList.length > 0 ? (
          <List
            dataSource={orderList}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    size="small"
                    onClick={() => handleIncreasesoLuongMon(item._id)}
                  >
                    +
                  </Button>,
                  <Button
                    size="small"
                    onClick={() => handleDecreasesoLuongMon(item._id)}
                  >
                    -
                  </Button>,
                  <Button size="small" danger onClick={() => handleRemoveItem(item._id)}>
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.tenMon}
                  description={`Số lượng: ${item.soLuongMon} | Giá: ${(item.giaMonAn * item.soLuongMon)}đ`}
                />
              </List.Item>
            )}
          />
        ) : (
          <p>Giỏ hàng trống</p>
        )}
      </Modal>
    </Row>
  );
};

export default OrderFood;
