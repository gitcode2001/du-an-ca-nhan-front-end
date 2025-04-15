import React, { useEffect, useState } from "react";
import { defineAbilitiesFor } from "../../ability";
import {
    Box,
    Button,
    Container,
    Modal,
    Paper,
    TextField,
    Typography,
    CircularProgress
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getUserInfo } from "../../service/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAbility } from "../../can.js";
import { forgotPassword, login } from "../../service/AccountService";

// Sử dụng yup để validate form
const schema = yup.object().shape({
    username: yup.string().required("Username không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống")
});

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();
    const { setCurrentAbility } = useAbility();

    const [openModal, setOpenModal] = useState(false);
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [loadingForgot, setLoadingForgot] = useState(false);

    // Khi component mount, đặt lại ability nếu có role trong localStorage
    useEffect(() => {
        setCurrentAbility(defineAbilitiesFor(null));
        const userRole = localStorage.getItem("role");
        if (userRole) {
            setCurrentAbility(defineAbilitiesFor(userRole));
        }
    }, [setCurrentAbility]);

    // Xử lý submit form đăng nhập
    const onSubmit = async (data) => {
        try {
            const result = await login(data.username, data.password);
            console.log("Dữ liệu login result:", result);

            if (result.success) {
                toast.success("Đăng nhập thành công");

                const { token, role, username } = result;
                localStorage.setItem("token", token);
                localStorage.setItem("role", role);
                localStorage.setItem("username", username);

                // Cập nhật ability cho người dùng
                setCurrentAbility(defineAbilitiesFor(role));

                console.log("role:", role);

                // Nếu role = admin => chuyển hướng trang admin
                if (role === "admin") {
                    navigate("/admin/list");
                }
                // Nếu role = employee => gọi API getUserInfo để lấy userId
                else if (role === "employee") {
                    const userInfo = await getUserInfo();
                    if (userInfo && userInfo.id) {
                        // Lưu userId (chính là ID của bảng users) vào localStorage
                        localStorage.setItem("userId", userInfo.id);
                    }
                    // Chuyển hướng sang trang manager/sale
                    navigate("/manager/sale");
                    console.log("userId đã lưu:", localStorage.getItem("userId"));
                }
                // Nếu role không hợp lệ => báo lỗi
                else {
                    toast.error("Role không hợp lệ");
                }
            } else {
                toast.error("Sai tên đăng nhập hoặc mật khẩu");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            if (error.response) {
                // Nếu server có trả về response lỗi
                toast.error(`Lỗi từ server: ${error.response.data.message || "Có lỗi xảy ra"}`);
            } else {
                // Không có phản hồi từ server
                toast.error("Lỗi kết nối tới server");
            }
        }
    };

    // Xử lý quên mật khẩu
    const handleForgotPassword = async () => {
        if (!emailOrUsername) {
            toast.error("Vui lòng nhập email hoặc tên tài khoản");
            return;
        }
        setLoadingForgot(true);
        try {
            const response = await forgotPassword(emailOrUsername);
            if (response.success) {
                toast.success("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email!");
                localStorage.setItem("emailOrUsername", emailOrUsername);
                navigate("/verify");
                setOpenModal(false);
            } else {
                toast.error(response.message || "Gửi yêu cầu thất bại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
        setLoadingForgot(false);
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Container maxWidth="xs">
                    <Paper
                        elevation={8}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: "#fff",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            gutterBottom
                            sx={{ fontWeight: "bold", color: "#ff4477" }}
                        >
                            Đăng nhập
                        </Typography>
                        <Typography
                            sx={{
                                textAlign: "center",
                                mb: 2,
                                fontSize: "14px",
                                color: "#888",
                            }}
                        >
                            Vui lòng nhập thông tin để đăng nhập vào hệ thống
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                        >
                            <TextField
                                label="Tên tài khoản"
                                variant="outlined"
                                fullWidth
                                autoComplete="username"
                                {...register("username")}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />
                            <TextField
                                label="Mật khẩu"
                                type="password"
                                variant="outlined"
                                fullWidth
                                autoComplete="current-password"
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <Typography
                                sx={{
                                    cursor: "pointer",
                                    color: "#1976d2",
                                    textAlign: "right",
                                    fontSize: "14px",
                                }}
                                onClick={() => setOpenModal(true)}
                            >
                                Quên mật khẩu?
                            </Typography>

                            <Button
                                type="submit"
                                fullWidth
                                sx={{
                                    mt: 1,
                                    background: "linear-gradient(to right, #ff6699, #66ccff)",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    ":hover": {
                                        background: "linear-gradient(to right, #ff3366, #3399ff)",
                                    },
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </Box>

                        {/* Modal Quên mật khẩu */}
                        <Modal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            aria-labelledby="modal-forgot-password"
                            aria-describedby="modal-forgot-password-description"
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    backgroundColor: "white",
                                    padding: 3,
                                    borderRadius: 2,
                                    width: "300px",
                                    boxShadow: 24,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    align="center"
                                    sx={{ marginBottom: 2 }}
                                >
                                    Quên mật khẩu
                                </Typography>
                                <TextField
                                    label="Email hoặc Tên tài khoản"
                                    variant="outlined"
                                    fullWidth
                                    value={emailOrUsername}
                                    onChange={(e) => setEmailOrUsername(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Button
                                        onClick={handleForgotPassword}
                                        disabled={loadingForgot}
                                        sx={{ width: "100%", backgroundColor: "#ff4477", color: "#fff" }}
                                    >
                                        {loadingForgot ? (
                                            <CircularProgress size={24} sx={{ color: "#fff" }} />
                                        ) : (
                                            "Gửi yêu cầu"
                                        )}
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}

export default Login;
