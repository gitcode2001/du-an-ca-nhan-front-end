import axios from 'axios';

const API_URL = 'http://localhost:8080/api/order-status';

// Lấy tất cả trạng thái đơn hàng
export const getAllOrderStatus = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Lấy trạng thái đơn hàng theo ID
export const getOrderStatusById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Tạo mới trạng thái đơn hàng
export const createOrderStatus = async (orderStatus) => {
    const response = await axios.post(API_URL, orderStatus);
    return response.data;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, orderStatus) => {
    const response = await axios.put(`${API_URL}/${id}`, orderStatus);
    return response.data;
};

// Xóa trạng thái đơn hàng
export const deleteOrderStatus = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
