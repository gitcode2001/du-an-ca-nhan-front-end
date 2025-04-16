import React, { useState, useEffect } from "react";
import {
    Box, Typography, TextField, Button, Alert, Stepper, Step,
    StepLabel, Paper, Snackbar, Divider
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import ReCAPTCHA from "react-google-recaptcha";
import { forgotPassword, verifyOtp, resetPassword } from "../services/AccountService";
import { useNavigate } from "react-router-dom";

const ForgotPasswordFlowComponent = () => {
    const [step, setStep] = useState(0);
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60);
    const [otpResendCount, setOtpResendCount] = useState(0);
    const [captchaToken, setCaptchaToken] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (step === 1 && otpTimer > 0) {
            timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, otpTimer]);

    const handleSendOtp = async () => {
        setError(""); setMessage("");
        if (!captchaToken) return setError("❗ Vui lòng xác thực reCAPTCHA trước khi gửi mã!");
        if (!emailOrUsername) return setError("⚠️ Vui lòng nhập email hoặc tên đăng nhập");

        const res = await forgotPassword(emailOrUsername);
        if (res.success) {
            setMessage("✅ Mã OTP đã được gửi thành công.");
            setStep(1);
            setOtpTimer(60);
            setOtpResendCount((prev) => prev + 1);
            setSnackbarOpen(true);
        } else {
            setError(res.message);
        }
    };

    const handleVerifyOtp = async () => {
        setError(""); setMessage("");
        if (!otp) return setError("⚠️ Vui lòng nhập mã OTP");

        const res = await verifyOtp(emailOrUsername, otp);
        if (res.success) {
            setMessage("✅ Mã OTP hợp lệ, tiếp tục đặt lại mật khẩu.");
            setStep(2);
        } else {
            setError(res.message);
        }
    };

    const handleResetPassword = async () => {
        setError(""); setMessage("");
        const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;

        if (!newPassword || newPassword !== confirmPassword) {
            return setError("❗ Mật khẩu không khớp hoặc chưa nhập đầy đủ!");
        }
        if (!strongPassword.test(newPassword)) {
            return setError("⚠️ Mật khẩu cần ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường và 1 số.");
        }

        const res = await resetPassword(emailOrUsername, newPassword);
        if (res.success) {
            setMessage("🎉 Đặt lại mật khẩu thành công! Đang chuyển hướng...");
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setError(res.message);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
                    🔐 Khôi phục mật khẩu
                </Typography>

                <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
                    {["Tài khoản", "Mã OTP", "Mật khẩu mới"].map((label) => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

                <Divider sx={{ mb: 3 }} />

                {step === 0 && (
                    <>
                        <TextField
                            label="Email hoặc Tên đăng nhập"
                            fullWidth
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <ReCAPTCHA
                            sitekey="6LfA9hErAAAAAOzmDJI1GyklnYfliaMVhvl8uHq8"
                            onChange={token => setCaptchaToken(token)}
                        />
                        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSendOtp}>
                            Gửi mã OTP
                        </Button>
                    </>
                )}

                {step === 1 && (
                    <>
                        <Typography sx={{ mb: 2 }}>
                            Mã OTP đã được gửi. Vui lòng nhập trong <strong>{otpTimer}s</strong>.
                        </Typography>
                        <TextField
                            label="Nhập mã OTP"
                            fullWidth
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button variant="contained" fullWidth onClick={handleVerifyOtp}>
                            Xác nhận OTP
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            disabled={otpTimer > 0 || otpResendCount >= 3}
                            onClick={handleSendOtp}
                            sx={{ mt: 2 }}
                        >
                            Gửi lại mã OTP ({3 - otpResendCount} lần còn lại)
                        </Button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <TextField
                            label="🔐 Mật khẩu mới"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            label="🔁 Xác nhận mật khẩu mới"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button variant="contained" fullWidth onClick={handleResetPassword}>
                            Đặt lại mật khẩu
                        </Button>
                    </>
                )}
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <MuiAlert
                    severity="success"
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                >
                    🎉 Mã OTP đã được gửi!
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default ForgotPasswordFlowComponent;
