import React, { useState, useEffect } from "react";
import { Modal, Table, Typography, Button, Spin, Alert } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import axios from "axios";
import { ipAddress } from "../services/api.ts";

const { Title, Text } = Typography;

const ModalHoaDon = ({ id_ban }) => {
  const [visible, setVisible] = useState(false); // Hiển thị modal
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [thongTinHoaDon, setThongTinHoaDon] = useState(null); // Dữ liệu hóa đơn
  const [error, setError] = useState(false); // Lỗi khi fetch API

  // Fetch hóa đơn khi mở modal
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!visible || !id_ban) return;

      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(`${ipAddress}layThongTinHoaDon`, {
          params: { id_ban },
        });

        if (response.data) {
          setThongTinHoaDon(response.data);
        } else {
          setThongTinHoaDon(null); // Không có hóa đơn
        }
      } catch (err) {
        console.error("Lỗi tải hóa đơn:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [visible, id_ban]);

  // Định nghĩa cột Table
  const columns = [
    { title: "Món", dataIndex: "mon", key: "mon" },
    { title: "SL", dataIndex: "soLuong", key: "soLuong", align: "center" },
    {
      title: "TT", // Trạng thái món
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai) =>
        trangThai ? (
          <span style={{ color: "green" }}>✔</span>
        ) : (
          <span style={{ color: "red" }}>✖</span>
        ),
      align: "center",
    },
    { title: "Giá", dataIndex: "gia", key: "gia", align: "right" },
  ];

  return (
    <>
      {/* Button hóa đơn */}
      <div>
        <Button
          type="primary"
          shape="circle"
          icon={<FileTextOutlined />}
          size="small"
          onClick={() => setVisible(true)}
          style={{ backgroundColor: "#52c41a", color: "white" }}
        />
      </div>

      {/* Modal hóa đơn */}
      <Modal
        title={<Title level={4} style={{ color: "red", margin: 0 }}>Thông tin hóa đơn</Title>}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            Đóng
          </Button>,
        ]}
        centered
        width={600}
      >
        {loading ? (
          <Spin
            tip="Đang tải thông tin hóa đơn..."
            style={{ display: "block", textAlign: "center", margin: "20px 0" }}
          />
        ) : error ? (
          <Alert
            type="error"
            message="Có lỗi xảy ra khi tải hóa đơn. Vui lòng thử lại sau."
          />
        ) : thongTinHoaDon ? (
          <>
            <Text strong>Bàn ăn: </Text>
            <Text>{`Bàn: ${thongTinHoaDon.ban} | Tầng ${thongTinHoaDon.tang}`}</Text>
            <br />
            <Text strong>Thời gian vào: </Text>
            <Text>{thongTinHoaDon.thoiGian}</Text>
            <br />
            <Text strong>Trạng thái: </Text>
            <Text type="danger">Chưa Thanh Toán</Text>

            {/* Danh sách order */}
            <Title level={5} style={{ marginTop: 15 }}>Danh sách order:</Title>
            <Table
              columns={columns}
              dataSource={thongTinHoaDon.items}
              pagination={false}
              rowKey={(record, index) => index}
              bordered
            />

            {/* Tổng tiền */}
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <Text strong>Tổng bill: </Text>
              <Text>{thongTinHoaDon.tongBill.toLocaleString()}</Text>
              <br />
              <Title level={4} style={{ margin: "5px 0" }}>
                Tổng tiền: <Text strong>{thongTinHoaDon.tongTien.toLocaleString()}</Text>
              </Title>
            </div>
          </>
        ) : (
          <Alert
            type="info"
            message="Hiện tại chưa có hóa đơn nào được tạo."
          />
        )}
      </Modal>
    </>
  );
};

export default ModalHoaDon;
