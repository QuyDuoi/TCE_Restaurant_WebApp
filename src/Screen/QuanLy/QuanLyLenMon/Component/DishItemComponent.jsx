import React, { useState } from "react";
import { Row, Col, Button, Dropdown, Menu, Modal, message } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { ipAddress } from "../../../../services/api.ts";

const DishItemComponent = ({ dish, onDelete }) => {
  const [status, setStatus] = useState(dish.trangThai);

  const handleDelete = async () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa món ăn này?",
      onOk: async () => {
        try {
          const response = await fetch(`${ipAddress}/xoaChiTietHoaDon/${dish._id}`, {
            method: "DELETE",
          });

          const data = await response.json();
          if (data.success) {
            message.success("Xóa món ăn thành công!");
            onDelete(dish._id); // Giả sử onDelete được định nghĩa trong component cha
          } else {
            message.error("Xóa món ăn thất bại!");
          }
        } catch (error) {
          console.error("Error deleting dish:", error);
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">Chỉnh sửa</Menu.Item>
      <Menu.Item key="2" onClick={handleDelete}>
        Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        border: "1px solid #ddd",
        borderRadius: "8px",
        margin: "8px 0px",
        padding: "8px",
      }}
    >
      {/* Phần hình ảnh */}
      <div
        style={{
          width: "20%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={dish.anhMonAn}
          alt={dish.tenMon}
          style={{
            width: "90%",
            height: "90%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Phần giữa */}
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 12px",
        }}
      >
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          {dish.tenMon}
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            color: "gray",
            marginBottom: "4px",
            whiteSpace: "nowrap",
          }}
        >
          <span>Khu vực: {dish.khuVuc}</span>
          <span style={{ marginLeft: "60px" }}>Số lượng: {dish.soLuong}</span>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#555" }}>
          Ghi chú: {dish.ghiChu}
        </div>
      </div>

      {/* Phần trạng thái và hành động */}
      <div
        style={{
          width: "30%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: "0px",
          }}
        >
          <input
            type="checkbox"
            checked={status}
            onChange={() => setStatus(!status)}
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
              marginRight: "8px",
            }}
          />
          <span
            style={{
              fontSize: "1rem",
              color: status ? "green" : "red",
              whiteSpace: "nowrap",
            }}
          >
            {status ? "Hoàn Thành" : "Chưa Xong"}
          </span>
        </div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            icon={<SettingOutlined />}
            style={{
              position: "absolute",
              bottom: "1px",
              right: "5px",
              border: "none",
              background: "transparent",
            }}
          />
        </Dropdown>
      </div>
    </div>
  );
};

const CategoryComponent = ({ monAns }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "16px",
      }}
    >
      {/* Phần nội dung cuộn */}
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          paddingBottom: "8px",
          borderRadius: "8px",
        }}
      >
        <Row gutter={[16, 16]}>
          {monAns.map((mon) => (
            <Col xs={24} sm={12} md={12} lg={12} key={mon._id}>
              <DishItemComponent dish={mon} />
            </Col>
          ))}
        </Row>
      </div>
      <div style={{ flex: "0 0 60px", backgroundColor: "#f0f0f0" }}>
        Footer hoặc phần khác
      </div>
    </div>
  );
};

const TabViewComponent = ({ data }) => {
  return (
    <div>
      <CategoryComponent monAns={data.monAns} />
    </div>
  );
};

export default TabViewComponent;
