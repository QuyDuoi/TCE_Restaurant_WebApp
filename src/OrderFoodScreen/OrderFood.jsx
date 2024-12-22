import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Tabs,
  Badge,
  Modal,
  List,
  Spin,
  message,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import MenuList from "./Component/MenuList";
import OrderList from "./Component/OrderList";
import axios from "axios";
import "./Style/OrderFood.css";
import { ipAddress, searchMonAn } from "../services/api.ts";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import ChatBox from "./ChatBox.jsx";
import ModalHoaDon from "./ModalHoaDon.jsx";
import OtpInput from "react-otp-input";

const { TabPane } = Tabs;

const OrderFood = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [thongTinBan, setThongTinBan] = useState(null);
  const [orderList, setOrderList] = useState([]); // Danh sách món trong giỏ
  const [activeTab, setActiveTab] = useState("all"); // Tab hiện tại
  const [isCartModalVisible, setCartModalVisible] = useState(false); // Hiển thị giỏ hàng
  const [listMonAn, setListMonAn] = useState([]); // Danh sách thực đơn từ API
  const [filteredMonAn, setFilteredMonAn] = useState([]); // Danh sách thực đơn đã lọc
  const [searchText, setSearchText] = useState(""); // Từ khóa tìm kiếm
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(true); // Hiển thị modal mật khẩu
  const [password, setPassword] = useState(""); // Lưu mật khẩu nhập vào
  const socket = io("https://tce-restaurant-api.onrender.com");
  const id_nhaHang = thongTinBan?.id_nhaHang;
  const [failedAttempts, setFailedAttempts] = useState(0); // Số lần nhập mật khẩu sai
  const [lockoutTime, setLockoutTime] = useState(0); // Thời gian khóa (5 phút)
  const [isLocked, setIsLocked] = useState(false); // Trạng thái khóa nút xác nhận

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Gọi API để lấy thông tin bàn
      const banResponse = await axios.get(
        `${ipAddress}layThongTinBanVaHoaDon`,
        {
          params: { id_ban: id },
        }
      );
      setThongTinBan(banResponse.data);

      // 2. Lấy id_nhaHang từ phản hồi của API
      const id_nhaHang = banResponse.data.id_nhaHang;

      // Kiểm tra id_nhaHang có hợp lệ không
      if (!id_nhaHang) {
        throw new Error("Không tìm thấy id_nhaHang từ thông tin bàn.");
      }

      // 3. Gọi API để lấy danh sách thực đơn dựa trên id_nhaHang
      const monAnResponse = await axios.get(`${ipAddress}layDanhSachThucDon`, {
        params: { id_nhaHang },
      });
      setListMonAn(monAnResponse.data);
      setFilteredMonAn(monAnResponse.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      message.error("Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách thực đơn từ API
  useEffect(() => {
    if (!isPasswordModalVisible) {
      fetchData();
    }
  }, [isPasswordModalVisible]);

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
      if (data.id_ban === id) {
        message.warning(data.msg);
      }
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
    const timeoutId = setTimeout(async () => {
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
        order._id === id
          ? { ...order, soLuongMon: order.soLuongMon + 1 }
          : order
      )
    );
  };

  // Giảm số lượng món
  const handleDecreasesoLuongMon = (id) => {
    setOrderList(
      orderList
        .map((order) =>
          order._id === id
            ? { ...order, soLuongMon: Math.max(order.soLuongMon - 1, 1) }
            : order
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
      await axios
        .post(`${ipAddress}datMonAn`, {
          id: id,
          danhSachMon: orderList,
          id_nhaHang: id_nhaHang,
        })
        .then((response) => {
          message.success(response.data.msg);
          setOrderList([]); // Xóa giỏ hàng sau khi gửi thông tin thành công
        });
    } catch (error) {
      if (error.response) {
        // Lỗi trả về từ server (status code không phải 2xx)
        console.error("Lỗi từ backend:", error.response.data);
        message.error(
          error.response.data.msg ||
            "Gửi thông tin thất bại, vui lòng liên hệ nhân viên!"
        );
      } else if (error.request) {
        // Lỗi khi không nhận được phản hồi từ server
        console.error("Không có phản hồi từ server:", error.request);
        message.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!"
        );
      } else {
        // Lỗi khác xảy ra
        console.error("Lỗi hệ thống:", error.message);
        message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    }
  };

  // Xử lý xác nhận gọi món
  const handleConfirmOrder = () => {
    if (orderList.length === 0) {
      message.error("Giỏ hàng đang trống, thêm món trước khi xác nhận!");
      return; // Dừng xử lý nếu giỏ hàng trống
    } else {
      guiThongTinMonAn();
    }
  };

  const startLockoutTimer = () => {
    setLockoutTime(5 * 60); // Set lockout time to 5 minutes (in seconds)
    const timer = setInterval(() => {
      setLockoutTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          setFailedAttempts(0); // Reset failed attempts after lockout
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Decrease time every second
  };

  // Format lockout time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    // When lockout time reaches 0, reset everything
    if (lockoutTime === 0) {
      setIsLocked(false);
      setFailedAttempts(0);
    }
  }, [lockoutTime]);

  // Hàm kiểm tra mật khẩu và gửi thông tin
  const handlePasswordSubmit = async () => {
    try {
      console.log(password);

      const response = await axios.post(`${ipAddress}kiemTraMatKhau`, {
        matKhau: password,
        id_ban: id,
      });

      const status = response.data;

      if (status) {
        setPasswordModalVisible(false);
        setFailedAttempts(0); // Reset attempts if correct password
      } else {
        setFailedAttempts(failedAttempts + 1);
        if (failedAttempts + 1 > 3) {
          setIsLocked(true);
          message.error(
            "Bạn đã nhập sai quá 3 lần. Ngưng truy cập trong 5 phút."
          );
          startLockoutTimer();
        } else {
          message.error("Sai mật khẩu! Vui lòng thử lại.");
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Lỗi từ backend:", error.response.data);
        message.error(error.response.data.msg);
      } else if (error.request) {
        // Lỗi khi không nhận được phản hồi từ server
        console.error("Không có phản hồi từ server:", error.request);
        message.error("Vui lòng kiểm tra kết nối mạng!");
      } else {
        // Lỗi khác xảy ra
        console.error("Lỗi hệ thống:", error.message);
        message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
        <div>Đang lấy thông tin bàn...</div>
      </div>
    );
  }

  return (
    <div>
      <Modal
        title="Liên hệ nhân viên để nhận được mật khẩu"
        open={isPasswordModalVisible}
        closable={false}
        footer={null}
        centered
        style={{ padding: "0px", textAlign: "center" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <OtpInput
            value={password}
            onChange={setPassword}
            numInputs={4}
            renderInput={(props) => <input {...props} />}
            separator={<span>-</span>}
            isInputNum={true}
            shouldAutoFocus
            inputStyle={{
              width: "3rem",
              height: "3rem",
              margin: "0 0.5rem",
              fontSize: "2rem",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
          <Button
            type="primary"
            size="large"
            style={{ marginTop: "20px" }}
            onClick={handlePasswordSubmit}
            disabled={isLocked}
          >
            {isLocked
              ? `Bạn đã bị khóa. Thử lại sau ${formatTime(lockoutTime)}`
              : "Xác nhận"}
          </Button>
        </div>
      </Modal>
      {!isPasswordModalVisible && (
        <Row
          gutter={16}
          style={{ padding: "10px", height: "calc(100vh - 10px)" }}
        >
          {/* Danh sách món ăn */}
          <Col xs={24} sm={24} md={14} style={{ marginBottom: "10px" }}>
            <h3>Danh sách thực đơn</h3>
            <h4 style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "10px" }}>
                Khu vực: {thongTinBan?.tenKhuVuc} - Bàn: {thongTinBan?.tenBan}
              </span>
              <ModalHoaDon id_ban={id} thongTinBan={thongTinBan} />
            </h4>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: "10px" }}
            >
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
                    style={{
                      fontSize: "24px",
                      cursor: "pointer",
                      color: "#1890ff",
                    }}
                    onClick={() => setCartModalVisible(true)}
                  />
                </Badge>
              </Col>
            </Row>
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              type="card"
            >
              <TabPane tab="Tất cả" key="all">
                <div className="menu-list-container">
                  <MenuList
                    data={getFilteredMenu()}
                    onAddItem={handleAddItem}
                  />
                </div>
              </TabPane>
              {filteredMonAn.map((category) => (
                <TabPane tab={category?.tenDanhMuc} key={category._id}>
                  <div className="menu-list-container">
                    <MenuList
                      data={category?.monAns}
                      onAddItem={handleAddItem}
                    />
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
            open={isCartModalVisible}
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
                      <Button
                        size="small"
                        danger
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Xóa
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.tenMon}
                      description={`Số lượng: ${item.soLuongMon} | Giá: ${
                        item.giaMonAn * item.soLuongMon
                      }đ`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <p>Giỏ hàng trống</p>
            )}
          </Modal>
          {/* Modal nhập mật khẩu */}
          <ChatBox id_ban={id} />
        </Row>
      )}
    </div>
  );
};

export default OrderFood;
