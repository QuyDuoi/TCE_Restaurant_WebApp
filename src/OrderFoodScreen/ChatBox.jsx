import React, { useState, useEffect, useRef } from "react";
import {
  MessageOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Modal, Input, Button, List, Tooltip, Spin } from "antd";
import axios from "axios";
import { io } from "socket.io-client";
import { ipAddress, ipIO } from "../services/api.ts";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const { TextArea } = Input;

const ChatBox = ({ id_ban }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [trangThaiTinNhan, setTrangThaiTinNhan] = useState("");
  const [position, setPosition] = useState({
    x: window.innerWidth - 70,
    y: window.innerHeight - 100,
  });
  const isDragging = useRef(false);
  const touchStartPosition = useRef({ x: 0, y: 0 });
  const socketRef = useRef(null);

  // Emoji picker visibility
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Ref để cuộn xuống cuối cùng
  const messagesEndRef = useRef(null);

  // Ref cho TextArea để quản lý focus
  const inputRef = useRef(null);

  // Hàm để cuộn xuống cuối cùng
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Initialize Socket
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(ipIO);
      socketRef.current.emit("NhanDien", {
        role: "KhachHang",
        id_ban: id_ban,
      });

      // Fetch initial messages
      const fetchMessages = async () => {
        try {
          setLoadingMessages(true);
          const response = await axios.get(
            `${ipAddress}layDsTinNhan?id_ban=${id_ban}`
          );
          // Ensure messages are sorted by createdAt in ascending order
          const sortedMessages = response.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setMessages(sortedMessages);
          const tinNhanCuoi = sortedMessages.at(-1);
          if (tinNhanCuoi.nguoiGui === true) {
            setTrangThaiTinNhan("Đã đọc");
          } else {
            setTrangThaiTinNhan("Đã gửi");
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoadingMessages(false);
        }
      };
      fetchMessages();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [id_ban]);

  useEffect(() => {
    if (visible && messages.length > 0) {
      // Adding a slight delay to ensure the modal has rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [visible, messages]);

  // Listen for incoming messages
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("tinNhanMoiCuaNv", (messageData) => {
        setMessages((prev) => [...prev, messageData]);
      });
      socketRef.current.on("nhanVienDaDoc", () => {
        setTrangThaiTinNhan("Đã đọc");
      });
    }

    // Cleanup listener on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("tinNhanMoiCuaNv");
        socketRef.current.off("nhanVienDaDoc");
      }
    };
  }, []);

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      id_ban: id_ban,
      noiDung: message,
      nguoiGui: true,
      createdAt: new Date().toISOString(),
    };

    setSending(true);
    try {
      // Emit sendMessage event to server
      socketRef.current.emit("khachGuiTin", messageData);

      setMessages((prev) => [...prev, messageData]);
      setMessage(""); // Clear message input
      setShowEmojiPicker(false); // Close emoji picker if open

      // Refocus vào Input sau khi gửi
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
      setTrangThaiTinNhan("Đã gửi");
    }
  };

  const handleOpenChat = () => {
    setVisible(true);
    // Focus the input when the chat modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseChat = () => setVisible(false);

  // Dragging handlers
  const handleTouchStart = (e) => {
    isDragging.current = true;
    touchStartPosition.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const newX = Math.min(
      Math.max(e.touches[0].clientX - touchStartPosition.current.x, 0),
      window.innerWidth - 40
    );
    const newY = Math.min(
      Math.max(e.touches[0].clientY - touchStartPosition.current.y, 0),
      window.innerHeight - 40
    );

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Handle emoji selection
  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    // Refocus vào Input sau khi chọn emoji
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEmojiToggle = () => {
    setShowEmojiPicker((prev) => !prev);

    // Focus the input field if emoji picker is toggled and the input exists
    inputRef.current.focus();
  };

  // Add global event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const newX = Math.min(
        Math.max(e.clientX - touchStartPosition.current.x, 0),
        window.innerWidth - 40
      );
      const newY = Math.min(
        Math.max(e.clientY - touchStartPosition.current.y, 0),
        window.innerHeight - 40
      );

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Chat Icon */}
      <div
        className="chat-button-container"
        style={{
          left: position.x,
          top: position.y,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => {
          isDragging.current = true;
          touchStartPosition.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
          };
        }}
      >
        <Button
          shape="circle"
          icon={<MessageOutlined />}
          size="large"
          onClick={handleOpenChat}
          className="chat-button"
        />
      </div>

      {/* Chat Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            <h3>Nhắn tin đến nhân viên</h3>
          </div>
        }
        open={visible}
        onCancel={handleCloseChat}
        footer={null}
        centered
        width={350}
        className="chat-modal"
        style={{ padding: "0px" }}
      >
        {/* Messages Display */}
        <div className="messages-container">
          {loadingMessages ? (
            <Spin spinning={true} tip="Đang tải tin nhắn...">
              <div style={{ height: "100%" }}></div>
            </Spin>
          ) : (
            <div>
              <List
                dataSource={messages}
                locale={{ emptyText: "Hãy bắt đầu cuộc hội thoại!" }}
                renderItem={(item, index) => {
                  // Determine if the timestamp should be shown for this message
                  const showTimestamp = () => {
                    const thresholdMinutes = 5; // Define the time gap threshold
                    const currentMessageTime = new Date(item.createdAt);
                    const nextMessage = messages[index + 1];
                    if (!nextMessage) {
                      // If this is the last message, show timestamp
                      return true;
                    }
                    const nextMessageTime = new Date(nextMessage.createdAt);
                    const timeDiff =
                      (nextMessageTime - currentMessageTime) / 1000 / 60; // Difference in minutes
                    const differentSender =
                      item.nguoiGui !== nextMessage.nguoiGui;
                    return differentSender || timeDiff > thresholdMinutes;
                  };

                  return (
                    <List.Item
                      key={item._id || index} // Use index as key if _id is not available
                      style={{
                        justifyContent:
                          item.nguoiGui === true ? "flex-end" : "flex-start",
                        padding: "5px 0",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            item.nguoiGui === true ? "#DBEBFF" : "#f0f0f0",
                          color: "#000",
                          padding: "8px 12px",
                          borderRadius: "10px",
                          maxWidth: "70%",
                          wordBreak: "break-word",
                          position: "relative",
                        }}
                      >
                        {item.noiDung}
                        {showTimestamp() && (
                          <div className="message-timestamp">
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </List.Item>
                  );
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "5px",
                }}
              >
                {messages.length > 0 &&
                  messages[messages.length - 1].nguoiGui === true && (
                    <>
                      {trangThaiTinNhan === "Đã gửi" && (
                        <Tooltip title="Đã gửi">
                          <span
                            style={{
                              color: "#FDFDFD",
                              fontSize: "12px",
                              backgroundColor: "#BCBDC0",
                              padding: "4px 6px",
                              borderRadius: "12px",
                            }}
                          >
                            &#10003; Đã gửi
                          </span>
                        </Tooltip>
                      )}
                      {trangThaiTinNhan === "Đã đọc" && (
                        <Tooltip title="Đã đọc">
                          <span
                            style={{
                              color: "#FDFDFD",
                              fontSize: "12px",
                              backgroundColor: "#BCBDC0",
                              padding: "4px 6px",
                              borderRadius: "12px",
                            }}
                          >
                            &#10003;&#10003; Đã đọc
                          </span>
                        </Tooltip>
                      )}
                    </>
                  )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          {/* Emoji Picker */}
          <div className="emoji-picker">
            <Tooltip title="Chọn biểu cảm">
              <Button
                shape="circle"
                icon={<SmileOutlined />}
                onClick={handleEmojiToggle}
                style={{ marginRight: "8px" }}
              />
            </Tooltip>
            {showEmojiPicker && (
              <div className="emoji-picker-wrapper">
                <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
              </div>
            )}
          </div>

          {/* Message Input */}
          <TextArea
            ref={inputRef}
            autoSize={{ minRows: 1, maxRows: 3 }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="ant-input-textarea"
            onPressEnter={(e) => {
              e.preventDefault();
              sendMessage();
              // Refocus after sending the message
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          />

          {/* Send Button */}
          {message.trim() ? (
            <Tooltip title="Gửi tin nhắn">
              <Button
                shape="circle"
                icon={<SendOutlined />}
                type="primary"
                onClick={sendMessage}
                loading={sending}
                className="send-button"
                htmlType="button"
                style={{ marginLeft: "8px" }}
              />
            </Tooltip>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export default ChatBox;
