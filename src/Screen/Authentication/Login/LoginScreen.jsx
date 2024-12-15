import React, { useState, useEffect } from 'react';
import {BsFillShieldLockFill} from "react-icons/bs";
import OTPInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {auth} from '../../../firebase.config';
import {RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth';
import {toast, Toaster} from "react-hot-toast";

const LoginScreen = () => {
    const [otp, setOtp] = useState("");
    const [ph, setPh] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [user, setUser] = useState(null);

    const onCaptchaVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        console.log('Recaptcha verified', response);
                        onSignup(); // Tiến hành đăng ký sau khi xác minh recaptcha
                    },
                    'expired-callback': () => {
                        console.log('Recaptcha expired');
                    },
                },
                auth
            );
        }
    }

    const onSignup = () => {
        onCaptchaVerify()

        const appVerifier = window.recaptchaVerifier;

        const formatPh = '+' + ph;

        signInWithPhoneNumber(auth, formatPh, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setShowOtp(true);
                toast.success('Gửi OTP thành công ');
            }).catch((error) => {
            console.log(error);
        });
    }

    const onOTPVerify = (params) => {
        window.confirmationResult.confirm(otp).then(async(res)=>{
            console.log(res)
            setUser(res.user);

        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <section className={"font-bold text-2x1 "}>
            <div>
                <Toaster toastOptions={{duration: 4000}} />
                <div id="recaptcha-container">

                </div>
                {
                    !user ? <h1>
                        Đăng nhập


                        {
                            showOtp ? <div>
                                Nhập otp
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    OTPLength={6}
                                    disable={false}
                                    otpType={"number"}
                                    autoFocus
                                    className={"opt-container"}
                                ></OTPInput>
                                <button onClick={onOTPVerify} className={""}>
                                    <span>Xác nhận OTP </span>
                                </button>
                            </div> : <div>
                                Nhập otp
                                <PhoneInput country={"vn"} value={ph} onChange={setPh}/>
                                <button onClick={onSignup} className={""}>
                                    <span>Gửi OTP </span>
                                </button>
                            </div>
                        }

                    </h1> : <h2>
                        Đăng nhập thành công
                    </h2>
                }


            </div>
        </section>
    );
};

export default LoginScreen;
