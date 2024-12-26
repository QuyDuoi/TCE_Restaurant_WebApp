import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  message,
  Spin,
  Row,
  Col,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  resetStatus,
  updateBanThunk,
} from "../../../../store/Slices/BanSlice.ts";

const BookingForm = ({ table, area, onSave, onLoading, onUpdateStatus }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.ban.status);

  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const selectedArea = area.find((item) => item._id === table.id_khuVuc);

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true); // Hiển thị loading spinner
        console.log("Thông tin đặt bàn:", values);

        // Lấy giá trị các trường
        const ngayDatBan = values.ngayDatBan
          ? moment(values.ngayDatBan).format("DD/MM/YYYY")
          : null;
        const gioDatBan = values.gioDatBan
          ? values.gioDatBan.format("HH:mm")
          : null;

        const dataToPost = {
          trangThai: "Đã đặt",
          id_khuVuc: table.id_khuVuc,
          ghiChu: `${values.hoTenNguoiDat} - ${values.soDienThoai} - ${ngayDatBan || ""} - ${gioDatBan || ""} - ${values.ghiChu || ""}`,
        };

        await dispatch(
          updateBanThunk({
            id: table._id,
            formData: dataToPost,
          })
        );
        setLoading(false); // Tắt loading spinner khi hoàn thành
        // Đóng modal
        onSave();
      })
      .catch((err) => {
        setLoading(false); // Tắt loading spinner khi có lỗi
        console.error("Lỗi:", err);
      });
  };

  useEffect(() => {
    if (status === "succeeded") {
      message.success("Đặt bàn thành công!");
      dispatch(resetStatus());
      onLoading();
    }
  }, [status, dispatch, onLoading]);

  useEffect(() => {
    if (table) {
      form.resetFields();
      form.setFieldsValue({
        viTriBan: `Bàn: ${table.tenBan} - ${selectedArea.tenKhuVuc}`,
        ngayDatBan: moment(),
      });
    }
  }, [table, form, selectedArea]);

  return (
    <>
      {loading && (
        <div style={styles.loadingWrapper}>
          <Spin size="large" style={{ color: "white" }} />
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        style={styles.formWrapper}
      >
        <p style={styles.title}>Đặt bàn</p>

        <Row gutter={16}>
          {/* Vị trí bàn */}
          <Col xs={24} sm={8} md={8}>
            <Form.Item
              label="Vị trí bàn"
              name="viTriBan"
              initialValue={`Bàn: ${table.tenBan} - ${selectedArea.tenKhuVuc}`}
              style={styles.formItem}
            >
              <Input disabled />
            </Form.Item>
          </Col>

          {/* Ngày đặt bàn */}
          <Col xs={24} sm={8} md={8}>
            <Form.Item
              label="Ngày đặt bàn"
              name="ngayDatBan"
              initialValue={moment()}
              rules={[
                { required: true, message: "Vui lòng chọn ngày đặt bàn!" },
              ]}
              style={styles.formItem}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabled // Vô hiệu hóa DatePicker
              />
            </Form.Item>
          </Col>

          {/* Giờ đặt bàn */}
          <Col xs={24} sm={8} md={8}>
            <Form.Item
              label="Giờ đặt bàn"
              name="gioDatBan"
              rules={[
                { required: true, message: "Vui lòng chọn giờ đặt bàn!" },
                {
                  validator: (_, value) => {
                    if (value) {
                      const now = moment();
                      const selected = moment(value, "HH:mm");
                      if (selected.isSameOrBefore(now)) {
                        return Promise.reject(
                          new Error("Giờ đặt bàn phải lớn hơn giờ hiện tại!")
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              style={styles.formItem}
            >
              <TimePicker
                allowClear={false}
                format={"HH:mm"}
                style={{ width: "100%" }}
                placeholder="Thời gian đến"
              />
            </Form.Item>
          </Col>

          {/* Họ tên người đặt và Số điện thoại đặt */}
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              label="Họ tên người đặt"
              name="hoTenNguoiDat"
              rules={[
                { required: true, message: "Vui lòng nhập tên người đặt!" },
              ]}
              style={styles.formItem}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <Form.Item
              label="Số điện thoại liên hệ"
              name="soDienThoai"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại đặt!" },
                {
                  pattern: /^0\d{9}$/,
                  message: "Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số, bắt đầu bằng 0.",
                },
              ]}
              style={styles.formItem}
            >
              <Input placeholder="Số điện thoại của khách" />
            </Form.Item>
          </Col>

          {/* Ghi chú */}
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label="Ghi chú"
              name="ghiChu"
              style={styles.formItem}
            >
              <Input.TextArea
                rows={3}
                placeholder="Số lượng khách, có cọc trước tiền không, yêu cầu riêng..."
                style={styles.textArea}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Nút Lưu */}
        <Form.Item style={styles.buttonWrapper}>
          <Button type="primary" htmlType="submit" style={styles.button}>
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default BookingForm;

// Định nghĩa các style sử dụng Ant Design với hệ thống lưới
const styles = {
  formWrapper: {
    backgroundColor: "#fff",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
    margin: "0px",
    marginBottom: "16px",
  },
  formItem: {
    marginBottom: "16px",
  },
  textArea: {
    borderRadius: "6px",
  },
  buttonWrapper: {
    textAlign: "center",
    marginTop: "24px",
  },
  button: {
    width: "150px",
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
  },
};
