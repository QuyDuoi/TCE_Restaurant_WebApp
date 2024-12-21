import React, { useState } from "react";
import { List, Card, Row, Col, Button, Tag, Modal } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";

const MenuList = ({ data, onAddItem }) => {
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item for the modal

  // Function to open the modal and set the selected item
  const handleItemClick = (item) => {
    setSelectedItem(item); // Set the selected item to be shown in the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedItem(null); // Close the modal by setting selected item to null
  };

  return (
    <>
      <List
        dataSource={data}
        locale={{ emptyText: "Không có món ăn nào trong danh mục này" }}
        renderItem={(item) => (
          <MenuItem
            item={item}
            onAddItem={onAddItem}
            onItemClick={handleItemClick} // Pass the click handler
          />
        )}
      />

      {/* Modal to display the detailed information */}
      {selectedItem && (
        <Modal
          title={"Mô tả chi tiết món ăn"}
          open={true}
          onCancel={handleCloseModal}
          footer={null}
          width={500}
          centered
        >
          <div style={{ textAlign: "left" }}>
            <img
              src={selectedItem.anhMonAn}
              alt={selectedItem.tenMon}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            <h4 style={{ margin: 0 }}>
              Tên món: <span>{selectedItem.tenMon}</span>
            </h4>
            <p>Giá món ăn: {selectedItem.giaMonAn}đ</p>
            <p>Thông tin về món: {selectedItem.moTa}</p>
            {selectedItem.trangThai === false && (
              <Tag color="red" style={{ marginLeft: "5px" }}>
                Ngưng phục vụ
              </Tag>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

const MenuItem = ({ item, onAddItem, onItemClick }) => {
  const [soLuongMon, setsoLuongMon] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handlesoLuongMonChange = (type) => {
    let newsoLuongMon = soLuongMon;
    if (type === "increase") newsoLuongMon++;
    if (type === "decrease" && soLuongMon > 0) newsoLuongMon--;
    setsoLuongMon(newsoLuongMon);
    setTotalPrice(newsoLuongMon * item.giaMonAn);
  };

  return (
    <List.Item>
      <Card style={{ width: "98%" }} className="card-content">
        <Row align="middle" style={{ textAlign: "left" }}>
          {/* Cột 1: Hình ảnh */}
          <Col span={6} style={{ textAlign: "center" }}>
            <img
              src={item.anhMonAn}
              alt={item.tenMon}
              style={{
                objectFit: "cover",
                display: "block",
                padding: "6px",
                borderRadius: "10px",
              }}
            />
          </Col>
          {/* Cột 2: Tên, giá, và trạng thái */}
          <Col span={15}>
            <h4
              style={{
                margin: 0,
                color: "orange",
                paddingLeft: "5px",
              }}
            >
              {item.tenMon}
            </h4>
            <p
              style={{
                fontWeight: "bold",
                color: "blue",
                paddingLeft: "5px",
              }}
            >
              {item.giaMonAn}đ
            </p>
            <Button onClick={() => onItemClick(item)}>Xem chi tiết</Button>
            {/* Hiển thị trạng thái món ăn */}
            {item.trangThai === false && (
              <Tag color="red" style={{ marginLeft: "5px" }}>
                Ngưng phục vụ
              </Tag>
            )}
          </Col>
          {/* Cột 3: Nút bấm */}
          <Col span={3} style={{ textAlign: "center" }}>
            <Row
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
              }}
              className="btn-add"
            >
              <Button
                type="primary"
                disabled={!item.trangThai} // Disable if item is not available
                style={{
                  width: "30px",
                  height: "30px",
                  color: "white",
                }}
                icon={<PlusSquareOutlined />}
                onClick={() => onAddItem(item)}
              ></Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </List.Item>
  );
};

export default MenuList;
