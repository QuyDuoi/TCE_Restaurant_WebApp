import React, { useState, useEffect } from "react";
import { Modal, Tabs, Button, Typography, Image, message } from "antd";
import { thanhToanHoaDon } from "../../../../services/CallApi/CallApiHoaDon.ts";

const { Title, Text } = Typography;

const PaymentModal = ({ visible, onClose, amount, id_hoaDon, tienGiamGia, id_nhanVien }) => {
    const [activeTab, setActiveTab] = useState("transfer");
    const [loading, setLoading] = useState(false);

    const bankInfo = {
        bankCode: "MB",
        accountNumber: "887788887878",
        description: `Thanh toán hóa đơn ${id_hoaDon}`,
    };

    const qrURL = `https://api.vietqr.io/image/970422-${bankInfo.accountNumber}-ITQkwGt.jpg?accountName=TRAN%20QUANG%20KHAI&amount=${amount}&addInfo=${encodeURIComponent(
        bankInfo.description
    )}`;

    useEffect(() => {
        if (!visible) {
            setActiveTab("transfer");
            setLoading(false);
        }
    }, [visible]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const thoiGianRa = new Date();
            const giamGia = tienGiamGia || 0;
            const hinhThucThanhToan = activeTab === "transfer";
            const idnv = id_nhanVien;

            const response = await thanhToanHoaDon(
                id_hoaDon,
                giamGia,
                hinhThucThanhToan,
                thoiGianRa,
                idnv
            );

            message.success("Thanh toán thành công!");
            console.log("Kết quả thanh toán: ", response);
            onClose();
        } catch (error) {
            message.error(error.message || "Thanh toán thất bại!");
            console.error("Lỗi thanh toán: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<Title level={3} style={{ textAlign: "center", color: "red" }}>Chọn hình thức thanh toán</Title>}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={500}
        >
            <Tabs
                defaultActiveKey="transfer"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                centered
            >
                <Tabs.TabPane tab="Chuyển khoản" key="transfer">
                    <div style={{ textAlign: "center" }}>
                        <Title level={5}>QR Thanh toán</Title>
                        <Image
                            src={qrURL}
                            alt="QR Thanh toán"
                            width={200}
                            height={200}
                            fallback="Không tải được QR"
                            onError={() => message.error("Không thể tải hình ảnh QR code")}
                        />
                        <Text>Tên nhà hàng: Buffet hải sản</Text>
                        <br />
                        <Text>Số tài khoản: {bankInfo.accountNumber}</Text>
                        <br />
                        <Text>Nội dung: {bankInfo.description}</Text>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Tiền mặt" key="cash">
                    <div style={{ textAlign: "center" }}>
                        <Title level={5}>Vui lòng thanh toán trực tiếp bằng tiền mặt</Title>
                    </div>
                </Tabs.TabPane>
            </Tabs>

            <div style={{ textAlign: "center", marginTop: 20 }}>
                <Title level={4} style={{ marginBottom: 10 }}>
                    Số tiền thanh toán: {amount.toLocaleString()} VND
                </Title>
                <Button
                    type="primary"
                    style={{ marginRight: 10, fontSize: "16px", height: "45px", width: "150px" }}
                    loading={loading}
                    onClick={handlePayment}
                >
                    Thanh toán
                </Button>
                <Button onClick={onClose} disabled={loading}>
                    Đóng
                </Button>
            </div>
        </Modal>
    );
};

export default PaymentModal;
