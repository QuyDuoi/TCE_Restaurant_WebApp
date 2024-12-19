import React, { useState, useEffect, useRef } from "react";
import {
  MessageOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Modal, Input, Button, List, Tooltip } from "antd";
import axios from "axios";
import { io } from "socket.io-client";
import { ipAddress, ipIO } from "../services/api.ts";
import Picker from "@emoji-mart/react"; // Import Picker from @emoji-mart/react
import data from "@emoji-mart/data"; // Import emoji data

const { TextArea } = Input;

const ChatBox = ({ id_ban }) => {
  // Ensure id_nhanVien is passed as a prop
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
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
          const response = await axios.get(
            `${ipAddress}layDsTinNhan?id_ban=${id_ban}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
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

  // Listen for incoming messages
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("tinNhanMoiCuaNv", (messageData) => {
        setMessages((prev) => [...prev, messageData]);
      });
    }

    // Cleanup listener on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("tinNhanMoiCuaNv");
      }
    };
  }, []);

  // Cuộn xuống cuối cùng mỗi khi messages thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Open and close modal
  const handleOpenChat = () => setVisible(true);
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

  // Determine whether to show timestamp
  const shouldShowTimestamp = (currentIndex) => {
    if (currentIndex === 0) return true;
    const currentMessage = messages[currentIndex];
    const previousMessage = messages[currentIndex - 1];
    const currentTime = new Date(currentMessage.createdAt).getTime();
    const previousTime = new Date(previousMessage.createdAt).getTime();
    const timeDifference = currentTime - previousTime; // in milliseconds
    const threshold = 5 * 60 * 1000; // 5 minutes

    return timeDifference > threshold;
  };

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
        title="Nhắn tin đến nhân viên"
        visible={visible}
        onCancel={handleCloseChat}
        centered
        footer={null}
        width={400}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          height: "60vh",
        }}
        className="chat-modal"
      >
        {/* Messages Display */}
        <div className="messages-container">
          <List
            dataSource={messages}
            locale={{ emptyText: "Hãy bắt đầu cuộc hội thoại!" }}
            renderItem={(item, index) => (
              <List.Item
                key={item._id}
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
                  {shouldShowTimestamp(index) && (
                    <div className="message-timestamp">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
          {/* Phần tử ẩn để cuộn xuống */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
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
                <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
              </div>
            )}
          </div>

          {/* Message Input */}
          <TextArea
            autoSize={{ minRows: 1, maxRows: 3 }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="ant-input-textarea"
            onPressEnter={(e) => {
              e.preventDefault();
              sendMessage();
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
              />
            </Tooltip>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export default ChatBox;
