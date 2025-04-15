import axios from 'axios';

const API_URL = 'http://localhost:8080/api/order-details';

export const getAllOrderDetails = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getOrderDetailById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createOrderDetail = async (orderDetail) => {
    const response = await axios.post(API_URL, orderDetail);
    return response.data;
};

export const updateOrderDetail = async (id, orderDetail) => {
    const response = await axios.put(`${API_URL}/${id}`, orderDetail);
    return response.data;
};

export const deleteOrderDetail = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
