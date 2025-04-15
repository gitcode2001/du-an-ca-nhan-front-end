import axios from "axios";

const BASE_URL = "http://localhost:8080/api";
const API_URL = `${BASE_URL}/admin`;

export const getAllUsers = async (search = "", page = 0, size = 5) => {
    try {
        const response = await axios.get(API_URL, {
            params: { search, page, size },
        });
        return response.data;
    } catch (error) {
        return { content: [], totalElements: 0 };
    }
};

export const getUserByUsername = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/information`, {
            params: { username },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

export const createUser = async (userDTO) => {
    try {
        if (!userDTO.password || userDTO.password.trim() === "") {
            delete userDTO.password;
        }
        const response = await axios.post(API_URL, userDTO);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (id, userDTO) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, userDTO);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw error;
    }
};

export const checkAccount = async (email, username) => {
    try {
        const response = await axios.get(`${API_URL}/check_account`, {
            params: { email, username },
        });
        return response.data;
    } catch (error) {
        return { existsEmail: false, existsUsername: false };
    }
};
