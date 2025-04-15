import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const getAllUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const registerUser = async (userData, password) => {
    const response = await axios.post(`${API_URL}/register`, userData, {
        params: { password },
    });
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const disableUser = async (id) => {
    await axios.put(`${API_URL}/${id}/disable`);
};

export const enableUser = async (id) => {
    await axios.put(`${API_URL}/${id}/enable`);
};
