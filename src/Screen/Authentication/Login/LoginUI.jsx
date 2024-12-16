import React, {useState} from 'react';
import { Button, Input, Typography, Layout, Row, Col, Form } from 'antd';
import './LoginUI.css';
import {toast, Toaster} from "react-hot-toast";

import OTPInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import {signInWithPhoneNumber} from "firebase/auth";
import {auth} from "../../../firebase.config";

const { Title, Text } = Typography;
const { Content } = Layout;

const LoginUI = () => {

    const [otp, setOtp] = useState("");
    const [ph, setPh] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [user, setUser] = useState(null);

    const onSignup = () => {
        setShowOtp(true);
    }
    const onOTPVerify = (params) => {
        setShowOtp(false);
    }


    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#D3FDE1' }}>
            <Content>
                <Row
                    justify="center"
                    align="middle"
                    style={{
                        minHeight: '100vh',
                        backgroundColor: '#D3FDE1',
                    }}
                >
                    <Col
                        xs={24}
                        sm={22}
                        md={20}
                        lg={18}
                        xl={16}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                        }}
                    >
                        <Row>

                            {/* Phần Trái - Form */}
                            <Col
                                span={16}
                                style={{
                                    padding: '80px',
                                    position: 'relative',
                                }}
                            >
                                {/* Chữ TCE RESTAURANT lên góc trái trên cùng */}
                                <Title
                                    level={3}
                                    style={{
                                        color: '#009A49',
                                        fontSize: '28px',
                                        margin: 0,
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                    }}
                                >
                                    TCE RESTAURANT
                                </Title>

                                {/* Thêm logo */}
                                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo TCE"
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                                <Toaster toastOptions={{duration: 4000}} />

                                <Title level={2} style={{ marginBottom: '16px', fontSize: '24px' }}>
                                    Đăng nhập
                                </Title>
                                {
                                    showOtp ?
                                        <Form layout="vertical">
                                            <Form.Item>
                                                <OTPInput
                                                    size="large"
                                                    value={otp}
                                                    onChange={setOtp}
                                                    OTPLength={6}
                                                    disable={false}
                                                    otpType={"number"}
                                                    autoFocus
                                                    className={"opt-container"}
                                                    style={{
                                                        height: '48px',
                                                        fontSize: '18px',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    block
                                                    style={{
                                                        backgroundColor: '#7A7A7A',
                                                        border: 'none',
                                                        height: '40px',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        borderRadius: '8px',
                                                    }}
                                                    onClick={onOTPVerify}
                                                >
                                                    Xác nhân OTP
                                                </Button>
                                            </Form.Item>
                                        </Form> :
                                        <Form layout="vertical">
                                            <Form.Item>
                                                <Input
                                                    size="large"
                                                    placeholder="Số điện thoại"
                                                    style={{
                                                        height: '48px',
                                                        fontSize: '18px',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    block
                                                    style={{
                                                        backgroundColor: '#7A7A7A',
                                                        border: 'none',
                                                        height: '40px',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        borderRadius: '8px',
                                                    }}
                                                    onClick={onSignup}
                                                >
                                                    Gửi mã OTP
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                }
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                    © 2024 TCE RESTAURANT. All Rights Reserved
                                </Text>
                            </Col>

                            {/* Phần Phải - Hình ảnh */}
                            <Col
                                span={8}
                                style={{
                                    padding: '10px', // Cách viền 10px
                                }}
                            >
                                <img
                                    src="/images/banner.png"
                                    alt="TCE Restaurant Dish"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
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
