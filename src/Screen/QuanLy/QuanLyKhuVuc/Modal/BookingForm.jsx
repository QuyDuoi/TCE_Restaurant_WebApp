import React from "react";
import { Form, Input, DatePicker, TimePicker, Button, message } from "antd";

const BookingForm = ({ table, onSave, onUpdateStatus }) => {
    const [form] = Form.useForm();

    const handleSave = () => {
        form.validateFields()
            .then((values) => {
                console.log("Thông tin đặt bàn:", values);

                // Hiển thị thông báo thành công
                message.success("Đặt bàn thành công!");

                // Cập nhật trạng thái bàn thành "Đã đặt"
                onUpdateStatus(table.id, "Đã đặt");

                // Đóng modal
                onSave();
            })
            .catch((err) => console.error("Lỗi:", err));
    };

    const styles = {
        formWrapper: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            backgroundColor: "#fff",
            padding: "0px 24px",
            borderRadius: "8px",
        },
        title: {
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
        },
        formItem: {
            marginBottom: "16px",
        },
        label: {
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "6px",
            display: "block",
        },
        input: {
            borderRadius: "6px",
            height: "40px",
        },
        textArea: {
            borderRadius: "6px",
        },
        buttonWrapper: {
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
        },
        button: {
            width: "120px",
            height: "40px",
            borderRadius: "6px",
            fontWeight: "600",
        },
    };

    return (
        <Form
            form={form}
            style={styles.formWrapper}
        >
            <p style={styles.title}>Đặt bàn</p>

            {/* Vị trí bàn */}
            <Form.Item
                label={<span style={styles.label}>Vị trí bàn</span>}
                name="viTriBan"
                initialValue={table.tenBan}
                style={styles.formItem}
            >
                <Input disabled style={styles.input} />
            </Form.Item>

            {/* Ngày đặt bàn */}
            <Form.Item
                label={<span style={styles.label}>Ngày đặt bàn</span>}
                name="ngayDatBan"
                rules={[{ required: true, message: "Vui lòng chọn ngày đặt bàn!" }]}
                style={styles.formItem}
            >
                <DatePicker style={{ ...styles.input, width: "100%" }} />
            </Form.Item>

            {/* Giờ đặt bàn */}
            <Form.Item
                label={<span style={styles.label}>Giờ đặt bàn</span>}
                name="gioDatBan"
                rules={[{ required: true, message: "Vui lòng chọn giờ đặt bàn!" }]}
                style={styles.formItem}
            >
                <TimePicker style={{ ...styles.input, width: "100%" }} />
            </Form.Item>

            {/* Họ tên người đặt */}
            <Form.Item
                label={<span style={styles.label}>Họ tên người đặt</span>}
                name="hoTenNguoiDat"
                rules={[{ required: true, message: "Vui lòng nhập tên người đặt!" }]}
                style={styles.formItem}
            >
                <Input
                    placeholder="Nguyễn Văn A"
                    style={styles.input}
                />
            </Form.Item>

            {/* Ghi chú */}
            <Form.Item
                label={<span style={styles.label}>Ghi chú</span>}
                name="ghiChu"
                style={styles.formItem}
            >
                <Input.TextArea
                    rows={3}
                    placeholder="Đặt bàn 10 người ăn lẩu. Cọc trước 500k"
                    style={styles.textArea}
                />
            </Form.Item>

            {/* Nút Lưu */}
            <div style={styles.buttonWrapper}>
                <Button
                    type="primary"
                    onClick={handleSave}
                    style={styles.button}
                >
                    Lưu
                </Button>
            </div>
        </Form>
    );
};

export default BookingForm;
