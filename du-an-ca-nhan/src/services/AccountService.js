import axios from "axios";

const API_URL = "http://localhost:8080/api/login";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}`, { username, password }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Đăng nhập thất bại" };
    }
};

export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axios.put(`${API_URL}/change-password`, { oldPassword, newPassword }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Đổi mật khẩu thất bại" };
    }
};

export const forgotPassword = async (emailOrUsername) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { emailOrUsername }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Lấy lại mật khẩu thất bại" };
    }
};

export const verifyOtp = async (emailOrUsername, otp) => {
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { emailOrUsername, otp }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xác thực OTP:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Xác thực OTP thất bại" };
    }
};

export const resetPassword = async (emailOrUsername, newPassword) => {
    try {
        const response = await axios.put(`${API_URL}/reset-password`, { emailOrUsername, newPassword }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Đặt lại mật khẩu thất bại" };
    }
};

export const lockAccount = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/lock/${id}`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi khóa tài khoản:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Khóa tài khoản thất bại" };
    }
};
