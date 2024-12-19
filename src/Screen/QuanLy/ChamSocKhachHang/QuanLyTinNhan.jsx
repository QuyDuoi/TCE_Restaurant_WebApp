// src/components/EmployeeChat.js
import React, { useEffect, useState, useRef } from "react";
import { Layout, Menu, Badge, Spin, Button, Input, List, Tooltip } from "antd";
import {
  MessageOutlined,
  SendOutlined,
  SmileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { io } from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./QuanLyTinNhan.css";
import { useSelector } from "react-redux";
import { ipAddress, ipIO } from "../../../services/api.ts";

const { Sider, Content, Header } = Layout;
const { TextArea } = Input;

const QuanLyTinNhan = () => {
  const [khuVucList, setKhuVucList] = useState([]);
  const [selectedBan, setSelectedBan] = useState(null);
  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang._id;
  // const id_nhaHang = "66fab50fa28ec489c7137537";

  useEffect(() => {
    console.log("co du lieu khong",user);

    const fetchKhuVuc = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${ipAddress}layDsKhuVuc?id_nhaHang=${id_nhaHang}`
        );
        setKhuVucList(response.data);
      } catch (error) {
        console.error("Error fetching KhuVuc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKhuVuc();
  }, []);

  // Initialize Socket.io
  useEffect(() => {
    socketRef.current = io(ipIO);

    // Join the room when the selected table changes
    if (selectedBan) {
      socketRef.current.emit("NhanDien", {
        role: "NhanVien",
        id_ban: selectedBan._id,
      });

      socketRef.current.emit("docTinNhan", {
        id_ban: selectedBan._id,
        id_nhanVien: user._id,
      });

      socketRef.current.emit("joinRoom", selectedBan._id);
      setVisible(true);
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await axios.get(
          `${ipAddress}layDsTinNhan?id_ban=${selectedBan._id}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedBan]);

  // Listen for incoming messages
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("tinNhanMoiCuaKhach", (messageData) => {
        if (selectedBan && messageData.id_ban === selectedBan._id) {
          setMessages((prev) => [...prev, messageData]);
        } else {
          // Increase unread count for the specific table
          setUnreadCounts((prev) => ({
            ...prev,
            [messageData.id_ban]: prev[messageData.id_ban]
              ? prev[messageData.id_ban] + 1
              : 1,
          }));
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("tinNhanMoiCuaKhach");
      }
    };
  }, [selectedBan]);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedBan) return;

    const messageData = {
      noiDung: messageInput,
      nguoiGui: false,
      id_ban: selectedBan._id,
      id_nhanVien: user._id,
      createdAt: new Date().toISOString(),
    };

    setSending(true);
    try {
      socketRef.current.emit("nhanVienGuiTin", messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessageInput("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Thêm emoji vào input
  const addEmoji = (emoji) => {
    setMessageInput((prev) => prev + emoji.native);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar chứa danh sách khu vực và bàn */}
      <Sider width={300} className="sider">
        <h2 style={{ marginLeft: "30px" }}>Khu Vực</h2>
        <Menu
          mode="inline"
          style={{ height: "100%", borderRight: 0 }}
          defaultOpenKeys={khuVucList.map((khuVuc) => khuVuc._id)}
          selectedKeys={selectedBan ? [selectedBan._id] : []}
        >
          {khuVucList.map((khuVuc) => (
            <Menu.SubMenu
              key={khuVuc._id}
              icon={<TeamOutlined />}
              title={khuVuc.tenKhuVuc}
            >
              {khuVuc.bans.map((ban) => (
                <Menu.Item key={ban._id} onClick={() => setSelectedBan(ban)}>
                  <span>Bàn: {ban.tenBan}</span>
                  {unreadCounts[ban._id] > 0 && (
                    <Badge
                      count={unreadCounts[ban._id]}
                      style={{ backgroundColor: "#f5222d", marginLeft: "10px" }}
                    />
                  )}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </Sider>

      {/* Content chứa giao diện chat */}
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <h2 style={{ marginLeft: "20px" }}>Chat với khách hàng</h2>
        </Header>
        <Content style={{ margin: "20px" }}>
          {!selectedBan ? (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <MessageOutlined style={{ fontSize: "50px", color: "#ccc" }} />
              <p>Chọn một bàn để bắt đầu trò chuyện</p>
            </div>
          ) : (
            <Spin spinning={loadingMessages} tip="Đang tải tin nhắn...">
              <div className="chat-container">
                {/* Tiêu đề chat */}
                <div className="chat-header">
                  <h3>Bàn {selectedBan.tenBan}</h3>
                  <Button onClick={() => setVisible(false)}>Đóng</Button>
                </div>

                {/* Danh sách tin nhắn */}
                <div className="messages-container">
                  <List
                    dataSource={messages}
                    renderItem={(item) => (
                      <List.Item
                        key={item._id}
                        style={{
                          justifyContent:
                            item.nguoiGui === "nhanVien"
                              ? "flex-end"
                              : "flex-start",
                          padding: "5px 0",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor:
                              item.nguoiGui === false ? "#DBEBFF" : "#f0f0f0",
                            color: "#000",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            maxWidth: "70%",
                            wordBreak: "break-word",
                            position: "relative",
                          }}
                        >
                          {item.noiDung}
                          <div className="message-timestamp">
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                  <div ref={messagesEndRef} />
                </div>

                {/* Khu vực nhập tin nhắn */}
                <div className="input-area">
                  {/* Emoji Picker */}
                  <div className="emoji-picker">
                    <Tooltip title="Chọn biểu cảm">
                      <Button
                        shape="circle"
                        icon={<SmileOutlined />}
                        onClick={() => setShowEmojiPicker((val) => !val)}
                        style={{ marginRight: "8px" }}
                      />
                    </Tooltip>
                    {showEmojiPicker && (
                      <div className="emoji-picker-wrapper">
                        <Picker
                          data={data}
                          onEmojiSelect={addEmoji}
                          theme="light"
                        />
                      </div>
                    )}
                  </div>

                  {/* Input tin nhắn */}
                  <TextArea
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="ant-input-textarea"
                    onPressEnter={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                  />

                  {/* Nút gửi */}
                  {messageInput.trim() && (
                    <Tooltip title="Gửi tin nhắn">
                      <Button
                        shape="circle"
                        icon={<SendOutlined />}
                        type="primary"
                        onClick={sendMessage}
                        loading={sending}
                        className="send-button"
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </Spin>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default QuanLyTinNhan;
