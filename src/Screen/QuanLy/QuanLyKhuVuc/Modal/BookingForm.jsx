import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, TimePicker, Button, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { resetStatus, updateBanThunk } from "../../../../store/Slices/BanSlice.ts";

const BookingForm = ({ table, area, onSave,onLoading, onUpdateStatus }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const status = useSelector((state)=> state.ban.status);
   
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading

    const selectedArea = area.filter((item) => item._id === table.id_khuVuc);

    const handleSave = () => {
        form.validateFields()
            .then(async(values) => {
                setLoading(true); // Hiển thị loading spinner
                console.log("Thông tin đặt bàn:", values);

                form.resetFields();
                // Hiển thị thông báo thành công
                const ngayDatBan = values.ngayDatBan
                    ? moment(values.ngayDatBan).format("DD/MM/YYYY")
                    : null;
                const gioDatBan = values.gioDatBan
                    ? (values.gioDatBan).format("HH:mm")
                    : null;

                const dataToPost = {
                    trangThai: "Đã đặt",
                    id_khuVuc: table.id_khuVuc,
                    ghiChu: `${values.ghiChu} - ${ngayDatBan} - ${gioDatBan} - ${values.hoTenNguoiDat}`
                }
                
                await dispatch(updateBanThunk({
                    id:table._id,
                    formData:dataToPost
                }))
                setLoading(false); // Tắt loading spinner khi hoàn thành
                // Đóng modal
                onSave();
            })
            .catch((err) =>{
                setLoading(false); // Tắt loading spinner khi có lỗi
                console.error("Lỗi:", err)
            });
    };
    useEffect(() => {
        if (status === 'succeeded') {
            message.success('Đặt bàn thành công!');
            dispatch(resetStatus())
            onLoading();
        }
    }, [status]); // Theo dõi sự thay đổi của status

    useEffect(() => {
        if (table) {
            form.resetFields();
            form.setFieldsValue({
                ...table,
            });
        }
    }, [table, form]);
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
        loadingWrapper: {
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
        },
    };

    return (
        <>
        {loading && (
            <div style={styles.loadingWrapper}>
                <Spin size="large" style={{ color: 'white' }}/>
            </div>
        )}
        
        <Form
            form={form}
            style={styles.formWrapper}

        >
            <p style={styles.title}>Đặt bàn</p>

            {/* Vị trí bàn */}
            <Form.Item
                label={<span style={styles.label}>Vị trí bàn</span>}
                name="viTriBan"
                initialValue={`Bàn: ${table.tenBan} - ${selectedArea[0].tenKhuVuc}`}
                style={styles.formItem}
            >
                <Input disabled style={styles.input} />
            </Form.Item>

            {/* Ngày đặt bàn */}
            <Form.Item
                label={<span style={styles.label}>Ngày đặt bàn</span>}
                name="ngayDatBan"
                initialValue={moment()}
                rules={[{ required: true, message: "Vui lòng chọn ngày đặt bàn!" }]}
                style={styles.formItem}
            >
                <DatePicker disabled style={{ ...styles.input, width: "100%" }} />
            </Form.Item>

            {/* Giờ đặt bàn */}
            <Form.Item
                label={<span style={styles.label}>Giờ đặt bàn</span>}
                name="gioDatBan"
                rules={[
                    { required: true, message: "Vui lòng chọn giờ đặt bàn!" },
                    {
                        validator: (_, value) => {
                            const currentTime = moment().format('HH:mm');
                            const selectedTime = (value).format("HH:mm"); // Chuyển giá trị chọn vào moment để so sánh
                            
                            if (value && selectedTime <= currentTime) {
                                return Promise.reject(new Error('Giờ đặt bàn phải lớn hơn giờ hiện tại!'));
                            }
                            return Promise.resolve();
                        }
                    }
                ]}
                style={styles.formItem}

            >
                <TimePicker allowClear={false} format={'HH:mm'} style={{ ...styles.input, width: "100%" }} />
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
        </>
    );
};

export default BookingForm;
