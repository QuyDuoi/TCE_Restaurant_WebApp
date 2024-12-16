import React, { useEffect, useState } from "react";
import { Row, Col, Input, Button, Tabs, Badge, Modal, List, Spin, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import MenuList from "./Component/MenuList";
import OrderList from "./Component/OrderList";
import axios from "axios";
import "./OrderFood.css";
import {ipAddress, searchMonAn} from "../services/api.ts"
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const OrderFood = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]); // Danh sách món trong giỏ
  const [activeTab, setActiveTab] = useState("all"); // Tab hiện tại
  const [isCartModalVisible, setCartModalVisible] = useState(false); // Hiển thị giỏ hàng
  const [listMonAn, setListMonAn] = useState([]); // Danh sách thực đơn từ API
  const [filteredMonAn, setFilteredMonAn] = useState([]); // Danh sách thực đơn đã lọc
  const [searchText, setSearchText] = useState(""); // Từ khóa tìm kiếm
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false); // Hiển thị modal mật khẩu
  const [password, setPassword] = useState(""); // Lưu mật khẩu nhập vào
  const [passwordResult, setPasswordResult] = useState(null); // Lưu kết quả backend
  const socket = io("https://tce-restaurant-api.onrender.com");
  const [isResultModalVisible, setResultModalVisible] = useState(false); // Hiển thị modal kết quả
  const id_nhaHang = "66fab50fa28ec489c7137537"; // ID nhà hàng

  // Lấy danh sách thực đơn từ API
  useEffect(() => {
    const layDanhSachThucDon = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${ipAddress}layDanhSachThucDon`,
          { params: { id_nhaHang } }
        );
        setListMonAn(response.data);
        setFilteredMonAn(response.data); // Gán mặc định danh sách đã lọc
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false)
      }
    };
    layDanhSachThucDon();
  }, []);

  useEffect(() => {
    // Kết nối và join vào room với id_ban
    if (id) {
      socket.emit("joinRoom", id);
      console.log(`Joined room: ${id}`);
    }
  
    // Cleanup: ngắt kết nối khi component unmount
    return () => {
      socket.disconnect();
      console.log("Disconnected from socket server");
    };
  }, [id]);

  useEffect(() => {
    // Lắng nghe sự kiện "huyDatMon" từ server
    socket.on("huyDatMon", (data) => {
      message.warning(`Order đã bị hủy bởi nhân viên: ${data.tenNhanVien}`);
    });

    socket.on("xacNhanOrder", (data) => {
      message.success(data.msg);
      setOrderList([]); // Xóa giỏ hàng khi có thông báo hủy món
    });
  
    // Cleanup: hủy lắng nghe sự kiện khi component unmount
    return () => {
      socket.off("huyDatMon");
    };
  }, []);

  // Tìm kiếm món ăn (Debounce 1 giây)
  useEffect(() => {
    const timeoutId = setTimeout( async () => {
      if (searchText.trim() === "") {
        setFilteredMonAn(listMonAn); // Nếu không có từ khóa thì trả lại toàn bộ
      } else {
        const data = await searchMonAn(searchText, id_nhaHang);
        setFilteredMonAn(data);
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

  const guiThongTinMonAn = async () => {
    try {
      const response = await axios.post(`${ipAddress}datMonAn`, { 
        id: id,
        danhSachMon: orderList,
        id_nhaHang: id_nhaHang,
      });

      if (response.data) {
        message.success(response.data.msg);
      }

    } catch (error) {
      if (error.response) {
        // Lỗi trả về từ server (status code không phải 2xx)
        console.error("Lỗi từ backend:", error.response.data);
        message.error(
          error.response.data.msg || "Gửi thông tin thất bại, vui lòng liên hệ nhân viên!"
        );
      } else if (error.request) {
        // Lỗi khi không nhận được phản hồi từ server
        console.error("Không có phản hồi từ server:", error.request);
        message.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
      } else {
        // Lỗi khác xảy ra
        console.error("Lỗi hệ thống:", error.message);
        message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    }
  }

  // Xử lý xác nhận gọi món
  const handleConfirmOrder = () => {
    if (orderList.length === 0) {
      message.error("Giỏ hàng đang trống, thêm món trước khi xác nhận!");
      return; // Dừng xử lý nếu giỏ hàng trống
    }
    setPassword(""); // Reset mật khẩu
    setPasswordModalVisible(true); // Hiển thị modal nhập mật khẩu
  };

  // Hàm kiểm tra mật khẩu và gửi thông tin
  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post(`${ipAddress}kiemTraMatKhau`, { 
        matKhau: password, 
        id_ban: id 
      });
      
      const status = response.data;

      if (status) {
        setPasswordModalVisible(false); // Đóng modal nhập mật khẩu
        setResultModalVisible(true); // Hiển thị modal kết quả
        setPasswordResult(true);
        guiThongTinMonAn();
        console.log("Đúng");
      } else {
        message.error("Sai mật khẩu! Vui lòng liên hệ nhân viên.")
        setPasswordResult(false);
      }

    } catch (error) {
      // Kiểm tra lỗi từ phản hồi backend
    if (error.response) {
      // Lỗi trả về từ server (status code không phải 2xx)
      console.error("Lỗi từ backend:", error.response.data);
      message.error(
        error.response.data.msg || "Mật khẩu không chính xác, vui lòng thử lại!"
      );
    } else if (error.request) {
      // Lỗi khi không nhận được phản hồi từ server
      console.error("Không có phản hồi từ server:", error.request);
      message.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
    } else {
      // Lỗi khác xảy ra
      console.error("Lỗi hệ thống:", error.message);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
    }
  };

  if (loading) {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div>Đang lấy thông tin món ăn...</div>
        </div>
    );
}

  return (
    <Row gutter={16} style={{ padding: "20px" , height: "calc(100vh - 10px)"}}>
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
          <Button key="confirm" type="primary" onClick={handleConfirmOrder}>
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
      {/* Modal nhập mật khẩu */}
      <Modal
        title="Nhập mật khẩu bàn"
        visible={isPasswordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        style={{maxWidth: "80%"}}
        footer={[
          <Button key="cancel" onClick={() => setPasswordModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handlePasswordSubmit}>
            Xác nhận
          </Button>,
        ]}
      >
        <Input.Password
          placeholder="Nhập mật khẩu 4 số"
          maxLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={handlePasswordSubmit}
        />
      </Modal>
      <Modal
  title={passwordResult ? "Thành công!" : "Thất bại!"}
  visible={isResultModalVisible}
  onCancel={() => setResultModalVisible(false)}
  style={{maxWidth: "70%"}}
  footer={[
    <Button
      key="ok"
      type="primary"
      onClick={() => {
        setResultModalVisible(false); 
        if (passwordResult) {
          setCartModalVisible(false)
        } else {
          // Quay lại màn order nếu mật khẩu sai
          setPasswordModalVisible(true);
        }
      }}
    >
      OK
    </Button>,
  ]}
>
    <p>Mật khẩu chính xác. Đang gửi thông tin đặt món...</p>
</Modal>
    </Row>
  );
};

export default OrderFood;
