import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders';

// Lấy tất cả đơn hàng (admin)
export const getAllOrders = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        throw error;
    }
};

export const getOrdersByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy đơn hàng của user ID = ${userId}:`, error);
        throw error;
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy đơn hàng với ID = ${id}:`, error);
        throw error;
    }
};

// Tạo đơn hàng
export const createOrder = async (order) => {
    try {
        const response = await axios.post(API_URL, order);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi tạo đơn hàng:', error);
        throw error;
    }
};

// Cập nhật đơn hàng
export const updateOrder = async (id, order) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, order);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật đơn hàng ID = ${id}:`, error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi xoá đơn hàng ID = ${id}:`, error);
        throw error;
    }
};
