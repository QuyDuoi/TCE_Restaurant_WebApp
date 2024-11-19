import React, { useState } from "react";
import { Row, Col, Input, Button, Tabs, Badge, Modal, List } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import MenuData from "./Data/MenuData";
import MenuList from "./Component/MenuList";
import OrderList from "./Component/OrderList";
import "./OrderFood.css";

const { TabPane } = Tabs;

const OrderFood = () => {
  const [orderList, setOrderList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isCartModalVisible, setCartModalVisible] = useState(false);

  const handleAddItem = (item) => {
    const existingItem = orderList.find((order) => order.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
      setOrderList([...orderList]);
    } else {
      setOrderList([...orderList, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (id) => {
    setOrderList(orderList.filter((order) => order.id !== id));
  };

  const handleIncreaseQuantity = (id) => {
    setOrderList(
      orderList.map((order) =>
        order.id === id ? { ...order, quantity: order.quantity + 1 } : order
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setOrderList(
      orderList
        .map((order) =>
          order.id === id ? { ...order, quantity: Math.max(order.quantity - 1, 1) } : order
        )
        .filter((order) => order.quantity > 0)
    );
  };

  const getFilteredMenu = () => {
    if (activeTab === "all") {
      return MenuData.flatMap((category) => category.monAn);
    }
    const category = MenuData.find((cat) => cat.id.toString() === activeTab);
    return category ? category.monAn : [];
  };

  return (
    <Row gutter={16} style={{ padding: "20px" }}>
      {/* Danh sách món ăn */}
      <Col xs={24} sm={24} md={14} style={{ marginBottom: "20px" }}>
        <h3>Danh sách món ăn</h3>
        <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
          <Col flex="1">
            <Input.Search placeholder="Tìm món ăn" allowClear />
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
              <MenuList
                data={getFilteredMenu()}
                onAddItem={handleAddItem}
                orderList={orderList}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
              />
            </div>
          </TabPane>
          {MenuData.map((category) => (
            <TabPane tab={category.danhMuc} key={category.id.toString()}>
              <div className="menu-list-container">
                <MenuList data={category.monAn} onAddItem={handleAddItem} />
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
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
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
                    onClick={() => handleIncreaseQuantity(item.id)}
                  >
                    +
                  </Button>,
                  <Button
                    size="small"
                    onClick={() => handleDecreaseQuantity(item.id)}
                  >
                    -
                  </Button>,
                  <Button size="small" danger onClick={() => handleRemoveItem(item.id)}>
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`Số lượng: ${item.quantity} | Giá: ${(item.price * item.quantity).toLocaleString()}đ`}
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
