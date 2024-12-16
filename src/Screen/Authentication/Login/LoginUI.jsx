import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

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
            await user.confirm(otp);
            console.log("Login success");
            navigate("/");
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

                                {user == null ? (
                                    <Form layout="vertical">
                                        <Form.Item>
                                            <Title
                                                level={2}
                                                style={{
                                                    marginBottom: "16px",
                                                    fontSize: "24px",
                                                }}
                                            >
                                                Đăng nhập
                                            </Title>
                                            <div className="phone-content">
                                                <PhoneInput
                                                    country={"vn"}
                                                    size="large"
                                                    placeholder="Số điện thoại"
                                                    onChange={(phoneNumber) =>
                                                        setPhoneNumber("+" + phoneNumber)
                                                    }
                                                    inputStyle={{
                                                        width: "100%",
                                                        height: "48px",
                                                        fontSize: "16px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #d9d9d9",
                                                    }}
                                                    buttonStyle={{
                                                        borderRadius: "8px 0 0 8px",
                                                        border: "1px solid #d9d9d9",
                                                    }}
                                                />
                                            </div>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                size="large"
                                                block
                                                style={{
                                                    backgroundColor: "#009A49",
                                                    border: "none",
                                                    height: "48px",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    borderRadius: "8px",
                                                    color: "#fff",
                                                    transition: "background-color 0.3s ease, transform 0.2s ease",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.backgroundColor = "#00793a")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.backgroundColor = "#009A49")
                                                }
                                                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                                                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                                            <Title
                                                level={2}
                                                style={{
                                                    marginBottom: "16px",
                                                    fontSize: "24px",
                                                }}
                                            >
                                                Nhập mã OTP
                                            </Title>
                                            <OTPInput
                                                size="large"
                                                value={otp}
                                                onChange={setOtp}
                                                OTPLength={6}
                                                disable={false}
                                                autoFocus
                                                className={"opt-container"}
                                                inputStyle={{
                                                    width: "48px",
                                                    height: "48px",
                                                    fontSize: "18px",
                                                    borderRadius: "8px",
                                                    border: "1px solid #d9d9d9",
                                                    margin: "0 8px",
                                                }}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                size="large"
                                                block
                                                style={{
                                                    backgroundColor: "#009A49",
                                                    border: "none",
                                                    height: "48px",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    borderRadius: "8px",
                                                    color: "#fff",
                                                    transition: "background-color 0.3s ease, transform 0.2s ease",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.backgroundColor = "#00793a")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.backgroundColor = "#009A49")
                                                }
                                                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                                                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                                onClick={verifyOtp}
                                            >
                                                Xác nhận OTP
                                            </Button>
                                            <Button
                                                type="default"
                                                size="large"
                                                block
                                                style={{
                                                    marginTop: "10px",
                                                    height: "48px",
                                                    fontSize: "18px",
                                                    borderRadius: "8px",
                                                    fontWeight: "bold",
                                                }}
                                                onClick={() => setUser(null)}
                                            >
                                                Quay lại
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                )}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "10px",
                                        left: "10px",
                                    }}
                                >
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: "14px",
                                        }}
                                    >
                                        © 2024 TCE RESTAURANT. All Rights Reserved
                                    </Text>
                                </div>
                            </Col>

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
