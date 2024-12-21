import React, { useState, useEffect } from "react";
import { Modal, Table, Typography, Button, Spin, Alert } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import axios from "axios";
import { ipAddress } from "../services/api.ts";
import "./Style/ModalHoaDon.css";

const { Title, Text } = Typography;

const ModalHoaDon = ({ id_ban, thongTinBan }) => {
  const [visible, setVisible] = useState(false); // Hiển thị modal
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [thongTinHoaDon, setThongTinHoaDon] = useState(null); // Dữ liệu hóa đơn
  const [dsChiTietHoaDon, setDsChiTietHoaDon] = useState([]); // Danh sách chi tiết hóa đơn
  const [error, setError] = useState(false); // Lỗi khi fetch API

  // Fetch hóa đơn khi mở modal
  useEffect(() => {
    setThongTinHoaDon(thongTinBan?.hoaDon);
    if (visible && thongTinBan && thongTinBan?.hoaDon) {
      const fetchHoaDon = async () => {
        setLoading(true);
        setError(false);
        try {
          const response = await axios.post(`${ipAddress}layDsChiTietHoaDon`, {
            id_hoaDon: thongTinBan?.hoaDon._id,
          });
          setDsChiTietHoaDon(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchHoaDon();
    }
  }, [visible, thongTinBan]);

  // Định nghĩa cột Table
  const columns = [
    {
      title: "Món",
      dataIndex: ["monAn", "tenMon"],
      key: "mon",
      render: (text, record) => <span>{record.monAn.tenMon}</span>,
    },
    {
      title: "SL",
      dataIndex: "soLuongMon",
      key: "soLuongMon",
      align: "center",
    },
    {
      title: "TT",
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
    {
      title: "Giá",
      dataIndex: "giaTien",
      key: "giaTien",
      align: "right",
      render: (giaTien) => giaTien.toLocaleString("vi-VN"),
    },
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
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            <Title level={4} style={{ margin: 0, color: "red" }}>
              Thông tin hóa đơn
            </Title>
          </div>
        }
        open={visible}
        closable={false}
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
            <Text>{`${thongTinBan?.tenBan} | Khu vực ${thongTinBan?.tenKhuVuc}`}</Text>
            <br />
            <Text strong>Thời gian vào: </Text>
            <Text>
              {new Date(thongTinBan?.hoaDon.createdAt).toLocaleString("vi-VN")}
            </Text>
            <br />
            <Text strong>Trạng thái: </Text>
            <Text type="danger">{thongTinHoaDon?.trangThai}</Text>

            {/* Danh sách order */}
            <Title level={5} style={{ marginTop: 15 }}>
              Danh sách order:
            </Title>
            <Table
              columns={columns}
              dataSource={dsChiTietHoaDon}
              pagination={false}
              rowKey={(record, index) => index}
              bordered
              scroll={{ y: 300 }}
              className="table-order"
            />

            {/* Tổng tiền */}
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <Title level={4} style={{ margin: "5px 0" }}>
                Tổng tiền: {thongTinHoaDon?.tongGiaTri.toLocaleString("vi-VN")}đ
              </Title>
            </div>
          </>
        ) : (
          <Alert type="info" message="Hiện tại chưa có hóa đơn nào được tạo." />
        )}
      </Modal>
    </>
  );
};

export default ModalHoaDon;
