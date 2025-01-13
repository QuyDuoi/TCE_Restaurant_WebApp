import React, { useState } from "react";
import {
  Button,
  Row,
  Col,
  DatePicker,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import { useSelector } from "react-redux";

const HeaderBar = ({ onFilter }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Hôm nay");
  const [customRange, setCustomRange] = useState([null, null]);
  const [isCustom, setIsCustom] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const user = useSelector((state) => state.user);
  const id_nhaHang = user?.id_nhaHang?._id;

  const filterOptions = [
    { title: "Hôm nay", type: "today" },
    { title: "Hôm qua", type: "yesterday" },
    { title: "7 ngày trước", type: "7days" },
    { title: "30 ngày trước", type: "30days" },
    { title: "Tháng trước", type: "lastMonth" },
    { title: "Khoảng ngày", type: "custom" }, // Tùy chọn mới
  ];

  const menu = (
    <Menu
      onClick={(e) => {
        const filter = filterOptions.find((item) => item.type === e.key);
        setSelectedFilter(filter.title);
        if (filter.type === "custom") {
          setIsCustom(true);
          setIsModalVisible(true);
        } else {
          setIsCustom(false);
          onFilter({
            date: selectedDate,
            type: filter.type,
            id_nhaHang: id_nhaHang,
          });
        }
      }}
    >
      {filterOptions.map((item) => (
        <Menu.Item key={item.type}>
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    // Gửi thông tin ngày với type "choiceDay"
    onFilter({ date: dateString, type: "choiceDay", id_nhaHang: id_nhaHang });
    console.log(dateString);
  };

  const handleRangeChange = (dates, dateStrings) => {
    setCustomRange(dateStrings);
  };

  const handleOk = () => {
    if (customRange[0] && customRange[1]) {
      onFilter({
        startDate: customRange[0],
        endDate: customRange[1],
        type: "custom",
        id_nhaHang: id_nhaHang,
      });
      setSelectedFilter(`Khoảng ngày: ${customRange[0]} - ${customRange[1]}`);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "0px",
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <h2 style={{ margin: 0 }}>Quản lý thống kê</h2>
        </Col>
        <Col>
          <Row gutter={8}>
            {/* Nút chọn ngày */}
            <Col>
              {!isCustom && (
                <DatePicker
                  placeholder="Chọn ngày"
                  onChange={handleDateChange}
                  format="DD/MM/YYYY" // Định dạng ngày
                  allowClear
                />
              )}
            </Col>

            {/* Nút lọc */}
            <Col>
              <Dropdown overlay={menu}>
                <Button type="primary" icon={<FilterOutlined />}>
                  {selectedFilter}
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Modal cho chọn khoảng ngày */}
      <Modal
        title="Chọn khoảng ngày"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Áp dụng"
        cancelText="Hủy"
      >
        <DatePicker.RangePicker
          style={{ width: "100%" }}
          onChange={handleRangeChange}
          format="DD/MM/YYYY" // Định dạng ngày
          placeholder={["Từ ngày", "Đến ngày"]}
          value={
            customRange[0] && customRange[1]
              ? [
                  moment(customRange[0], "DD/MM/YYYY"),
                  moment(customRange[1], "DD/MM/YYYY"),
                ]
              : []
          }
          allowClear={true}
        />
      </Modal>
    </div>
  );
};

export default HeaderBar;
