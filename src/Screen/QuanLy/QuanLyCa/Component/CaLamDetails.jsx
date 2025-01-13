import React, { useEffect, useState } from "react";
import { Typography, Divider, Row, Col, Spin, Button, Modal, notification } from "antd"; // Import Modal and notification
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { fetchHoaDonTheoCaLam } from "../../../../store/Slices/HoaDonSlice.ts";
import ChiTietHoaDonModal from "../Modal/ChiTietHoaDonModal";
import { fetchKhuVucVaBan } from "../../../../store/Thunks/khuVucThunks.ts";
import { checkDongCaLam } from "../CallApiCaLam.ts";

const { Title, Text } = Typography;

const CaLamDetails = ({ caLam = {} }) => {
  const dispatch = useDispatch();
  const { _id, batDau, ketThuc, id_nhanVien } = caLam;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false); // State for confirmation modal
  const [selectedHoaDon, setSelectedHoaDon] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const user = useSelector((state) => state.user);
  const id_nhaHang = user.id_nhaHang?._id;

  // Lấy danh sách hóa đơn từ Redux
  const hoaDons = useSelector((state: RootState) => state.hoaDon.hoaDons || []);
  const { khuVucs } = useSelector((state) => state.khuVuc);

  // Lấy trạng thái từ Redux
  const status = useSelector((state: RootState) => state.hoaDon.status);

  useEffect(() => {
    if (_id) {
      dispatch(fetchHoaDonTheoCaLam(_id));
      dispatch(fetchKhuVucVaBan(id_nhaHang));
    }
  }, [_id, dispatch, id_nhaHang]);

  const openModal = (hoaDon) => {
    setSelectedHoaDon(hoaDon);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedHoaDon(null);
  };

  const getKhuVucVaBan = (hoaDon, khuVucs) => {
    const { id_ban } = hoaDon;

    // Kiểm tra nếu không có id_ban
    if (!id_ban) {
      return { tenKhuVuc: "Hóa đơn: Bán mang đi", tenBan: "" };
    }

    for (const khuVuc of khuVucs) {
      const ban = khuVuc.bans.find((b) => b._id === id_ban);
      if (ban) {
        return {
          tenKhuVuc: `Khu vực: ${khuVuc.tenKhuVuc}` || "Không xác định",
          tenBan: `Bàn: ${ban.tenBan}` || "Không xác định",
        };
      }
    }

    return { tenKhuVuc: "Khu vực bị xóa", tenBan: "Bàn bị xóa" };
  };

  // Function to handle closing the shift
  const handleCloseShift = async () => {
    setIsConfirmModalVisible(false); // Close the confirmation modal
    setIsClosing(true); // Start the loading state

    try {
      const response = await checkDongCaLam(_id); // Call the API with shift ID

      // Success notification
      notification.success({
        message: "Đóng ca thành công",
        description: response.msg || "Ca làm việc đã được đóng thành công.",
      });

      // Optionally, refresh the shift details
      dispatch(fetchHoaDonTheoCaLam(_id));
      // You might also want to fetch other related data or update the local state
    } catch (error) {
      // Error notification
      notification.error({
        message: "Đóng ca thất bại",
        description: error.message || "Đã xảy ra lỗi khi đóng ca làm việc.",
      });
    } finally {
      setIsClosing(false); // End the loading state
    }
  };

  // Function to open the confirmation modal
  const showConfirmModal = () => {
    Modal.confirm({
      title: "Xác nhận đóng ca làm việc",
      content: "Bạn có chắc chắn muốn đóng ca làm việc này?",
      okText: "Đóng ca",
      cancelText: "Hủy",
      onOk: handleCloseShift,
      onCancel: () => {},
      okButtonProps: { loading: isClosing }, // Show loading on OK button if closing
    });
  };

  return (
    <div style={{ padding: "8px" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={5} style={{ fontSize: "24px", display: "inline" }}>
            Chi tiết ca làm
          </Title>
        </Col>
        <Col>
          {!ketThuc && (
            <Button
              type="primary"
              onClick={showConfirmModal} // Open confirmation modal
              loading={isClosing} // Show loading state
            >
              Đóng ca
            </Button>
          )}
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={12}>
          <Text strong>Nhân viên mở ca: </Text>
          {caLam.id_nhanVien?.hoTen || "Không xác định"}
          <br />
          <Text strong>Ngày mở: </Text>
          {caLam.batDau
            ? new Date(caLam.batDau).toLocaleDateString("vi-VN")
            : "Không xác định"}
        </Col>
        <Col span={12}>
          <Text strong>Thời gian mở: </Text>
          {caLam.batDau
            ? new Date(caLam.batDau).toLocaleTimeString()
            : "Không xác định"}
          <br />
          <Text strong>Thời gian đóng: </Text>
          {caLam.ketThuc ? (
            new Date(caLam.ketThuc).toLocaleTimeString()
          ) : (
            <Text
              style={{ color: "green", fontWeight: "bold", fontSize: "15px" }}
            >
              Đang mở
            </Text>
          )}
        </Col>
      </Row>
      <Divider />
      <Title level={5} style={{ fontSize: "24px" }}>
        Chi tiết doanh thu
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Text strong>Số dư ban đầu: </Text>
          {caLam.soDuBanDau?.toLocaleString("vi-VN")} đ
          <br />
          <Text strong>Tổng tiền mặt: </Text>
          {caLam.tongTienMat?.toLocaleString("vi-VN")} đ
          <br />
          <Text strong>Tổng thu: </Text>
          {caLam.tongThu?.toLocaleString("vi-VN")} đ
        </Col>
        <Col span={12}>
          <Text strong>Số dư hiện tại: </Text>
          {caLam.soDuHienTai?.toLocaleString("vi-VN")} đ
          <br />
          <Text strong>Tổng chuyển khoản: </Text>
          {caLam.tongChuyenKhoan?.toLocaleString("vi-VN")} đ
          <br />
          <Text strong>Tổng chi: </Text>
          {caLam.tongChi?.toLocaleString("vi-VN")}đ
        </Col>
      </Row>
      <Divider />
      <Title level={5}>Danh sách hóa đơn</Title>

      <Spin spinning={status === "loading"} tip="Đang tải...">
        {hoaDons.length > 0 ? (
          hoaDons.map((hoaDon, index) => {
            const { tenKhuVuc, tenBan } = getKhuVucVaBan(hoaDon, khuVucs);

            return (
              <div
                key={index}
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  border: "2px solid #d9d9d9",
                  borderRadius: "6px",
                  backgroundColor: "#fafafa",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Text strong>
                  {tenKhuVuc}
                  {tenBan && ` - ${tenBan}`}
                </Text>
                <Divider style={{ margin: "8px 0" }} />
                <Row>
                  <Col span={12}>
                    <Text>
                      Thời gian vào:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {hoaDon.thoiGianVao
                          ? new Date(hoaDon.thoiGianVao).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Không xác định"}
                      </Text>
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text>
                      Thời gian ra:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {hoaDon.thoiGianRa
                          ? new Date(hoaDon.thoiGianRa).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Không xác định"}
                      </Text>
                    </Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "8px 0" }} />
                <Row>
                  <Col span={12}>
                    <Text>
                      Trạng thái:{" "}
                      <Text
                        style={{
                          color:
                            hoaDon.trangThai === "Đã Thanh Toán"
                              ? "green"
                              : "red",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      >
                        {hoaDon.trangThai || "Không xác định"}
                      </Text>
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text>
                      Hình thức:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {hoaDon.hinhThucThanhToan ? "Chuyển khoản" : "Tiền mặt"}
                      </Text>
                    </Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "8px 0" }} />
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong style={{ fontSize: "16px" }}>
                      Tổng hóa đơn: {hoaDon.tongGiaTri?.toLocaleString() || 0}đ
                    </Text>
                  </Col>
                  <Col>
                    <a
                      style={{ color: "#1890ff" }}
                      onClick={() => openModal(hoaDon)}
                    >
                      Xem chi tiết &gt;&gt;&gt;
                    </a>
                  </Col>
                </Row>
              </div>
            );
          })
        ) : (
          <Text>Không có hóa đơn nào.</Text>
        )}
      </Spin>
      {selectedHoaDon && (
        <ChiTietHoaDonModal
          visible={isModalVisible}
          onCancel={closeModal}
          hoaDon={selectedHoaDon}
        />
      )}
    </div>
  );
};

export default CaLamDetails;
