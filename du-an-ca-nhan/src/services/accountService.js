import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/account";

// ✅ Đăng nhập
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        toast.success("Đăng nhập thành công");
        return response.data;
    } catch (error) {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
        throw error;
    }
};

// ✅ Đổi mật khẩu
export const changePassword = async (username, oldPassword, newPassword, confirmPassword) => {
    try {
        const response = await axios.post(`${API_URL}/change-password`, {
            username,
            oldPassword,
            newPassword,
            confirmPassword,
        });
        toast.success("Đổi mật khẩu thành công");
        return response.data;
    } catch (error) {
        toast.error("Đổi mật khẩu thất bại");
        throw error;
    }
};

// ✅ Gửi OTP khi quên mật khẩu
export const forgotPassword = async (emailOrUsername) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { emailOrUsername });
        toast.success("Gửi OTP thành công");
        return response.data;
    } catch (error) {
        toast.error("Không thể gửi OTP");
        throw error;
    }
};

// ✅ Xác minh OTP
export const verifyOtp = async (emailOrUsername, otp) => {
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { emailOrUsername, otp });
        toast.success("Xác minh OTP thành công");
        return response.data;
    } catch (error) {
        toast.error("OTP không hợp lệ hoặc đã hết hạn");
        throw error;
    }
};

// ✅ Đặt lại mật khẩu mới sau khi xác minh OTP
export const resetNewPassword = async (emailOrUsername, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/new-password`, { emailOrUsername, newPassword });
        toast.success("Đặt lại mật khẩu thành công");
        return response.data;
    } catch (error) {
        toast.error("Không thể đặt lại mật khẩu");
        throw error;
    }
};

// ✅ Khóa tài khoản
export const lockAccount = async (userId) => {
    try {
        const response = await axios.put(`${API_URL}/lock/${userId}`);
        toast.success("Khóa tài khoản thành công");
        return response.data;
    } catch (error) {
        toast.error("Lỗi khi khóa tài khoản");
        throw error;
    }
};

// ✅ Lấy thông tin tài khoản theo username
export const getAccountByUsername = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/${username}`);
        return response.data;
    } catch (error) {
        toast.error("Không thể lấy thông tin tài khoản");
        throw error;
    }
};
