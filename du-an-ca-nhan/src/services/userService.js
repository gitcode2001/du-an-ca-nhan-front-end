import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/users"; 

// Lấy tất cả người dùng
export const getAllUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        toast.error("Lỗi khi lấy danh sách người dùng");
        console.error(error);
        return [];
    }
};

// Lấy người dùng theo ID
export const getUserById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        toast.error("Không tìm thấy người dùng");
        return null;
    }
};

// Tạo người dùng mới
export const createUser = async (userDTO) => {
    try {
        const response = await axios.post(API_URL, userDTO);
        toast.success("Tạo người dùng thành công");
        return response.data;
    } catch (error) {
        if (error.response?.status === 409) {
            toast.error(error.response.data); // Email hoặc Username đã tồn tại
        } else {
            toast.error("Lỗi khi tạo người dùng");
        }
        throw error;
    }
};

// Cập nhật người dùng
export const updateUser = async (id, userDTO) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, userDTO);
        toast.success("Cập nhật người dùng thành công");
        return response.data;
    } catch (error) {
        toast.error("Lỗi khi cập nhật người dùng");
        throw error;
    }
};

// Xóa người dùng
export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        toast.success("Xóa người dùng thành công");
        return response.data;
    } catch (error) {
        toast.error("Lỗi khi xóa người dùng");
        throw error;
    }
};

// Tìm kiếm người dùng có phân trang
export const searchUsers = async (keyword = "", page = 0, size = 5) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: { keyword, page, size },
        });
        return response.data;
    } catch (error) {
        toast.error("Lỗi khi tìm kiếm người dùng");
        return { content: [], totalElements: 0 };
    }
};

// Kiểm tra username
export const checkUsername = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/check-username`, {
            params: { username },
        });
        return response.data;
    } catch (error) {
        toast.error("Lỗi khi kiểm tra username");
        return false;
    }
};

// Kiểm tra email
export const checkEmail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/check-email`, {
            params: { email },
        });
        return response.data;
    } catch (error) {
        toast.error("Lỗi khi kiểm tra email");
        return false;
    }
};
