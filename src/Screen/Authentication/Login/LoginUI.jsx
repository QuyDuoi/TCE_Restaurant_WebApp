import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
    Button,
    Input,
    Typography,
    Layout,
    Row,
    Col,
    Form,
} from "antd";
import { toast, Toaster } from "react-hot-toast";
import OTPInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../../firebase.config";

const { Title, Text } = Typography;
const { Content } = Layout;

const LoginUI = () => {
    const [otp, setOtp] = useState("");
    const [user, setUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const senOtp = async () => {
        try {
            const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
            const confirmation = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                recaptcha
            );
            setUser(confirmation);
            console.log(user);
        } catch (err) {
            console.error(err);
        }
    };

    const verifyOtp = async () => {
        try {
            await user.confirm(otp); // Xác thực OTP thành công
            console.log("Login success");
            navigate("/"); // Chuyển hướng đến trang Home
        } catch (err) {
            console.error(err);
            toast.error("OTP không hợp lệ!");
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#D3FDE1" }}>
            <Content>
                <Toaster toastOptions={{ duration: 4000 }} />
                <Row
                    justify="center"
                    align="middle"
                    style={{
                        minHeight: "100vh",
                        backgroundColor: "#D3FDE1",
                    }}
                >
                    <Col
                        xs={24}
                        sm={22}
                        md={20}
                        lg={18}
                        xl={16}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                        }}
                    >
                        <Row>
                            {/* Phần Form */}
                            <Col
                                span={16}
                                style={{
                                    padding: "80px",
                                    position: "relative",
                                }}
                            >
                                <Title
                                    level={3}
                                    style={{
                                        color: "#009A49",
                                        fontSize: "28px",
                                        margin: 0,
                                        position: "absolute",
                                        top: "10px",
                                        left: "10px",
                                    }}
                                >
                                    TCE RESTAURANT
                                </Title>

                                <div
                                    style={{
                                        marginBottom: "20px",
                                        textAlign: "center",
                                    }}
                                >
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo TCE"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>
                                <Title
                                    level={2}
                                    style={{
                                        marginBottom: "16px",
                                        fontSize: "24px",
                                    }}
                                >
                                    Đăng nhập
                                </Title>
                                {user == null ? (
                                    <Form layout="vertical">
                                        <Form.Item>
                                            <div className="phone-content">
                                                <PhoneInput
                                                    country={"vn"}
                                                    size="large"
                                                    placeholder="Số điện thoại"
                                                    onChange={(phoneNumber) =>
                                                        setPhoneNumber("+" + phoneNumber)
                                                    }
                                                />
                                            </div>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                size="large"
                                                block
                                                style={{
                                                    backgroundColor: "#7A7A7A",
                                                    border: "none",
                                                    height: "40px",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    borderRadius: "8px",
                                                }}
                                                onClick={senOtp}
                                            >
                                                Gửi mã OTP
                                            </Button>
                                            <div id="recaptcha" style={{ marginTop: "10px" }}></div>
                                        </Form.Item>
                                    </Form>
                                ) : (
                                    <Form layout="vertical">
                                        <Form.Item>
                                            <OTPInput
                                                size="large"
                                                value={otp}
                                                onChange={setOtp}
                                                OTPLength={6}
                                                disable={false}
                                                autoFocus
                                                className={"opt-container"}
                                                style={{
                                                    height: "48px",
                                                    fontSize: "18px",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                size="large"
                                                block
                                                style={{
                                                    backgroundColor: "#7A7A7A",
                                                    border: "none",
                                                    height: "40px",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    borderRadius: "8px",
                                                }}
                                                onClick={verifyOtp}
                                            >
                                                Xác nhận OTP
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                )}
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: "14px",
                                    }}
                                >
                                    © 2024 TCE RESTAURANT. All Rights Reserved
                                </Text>
                            </Col>

                            {/* Phần Hình ảnh */}
                            <Col
                                span={8}
                                style={{
                                    padding: "10px",
                                }}
                            >
                                <img
                                    src="/images/banner.png"
                                    alt="TCE Restaurant Dish"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default LoginUI;
