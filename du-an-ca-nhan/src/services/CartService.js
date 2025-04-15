import axios from 'axios';

const API_URL = 'http://localhost:8080/api/carts';

export const getCartsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user`, { params: { userId } });
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching cart:', error);
        return [];
    }
};

export const createCart = async (cart) => {
    try {
        const response = await axios.post(API_URL, cart);
        return response.data;
    } catch (error) {
        console.error('❌ Error creating cart:', error.response?.data || error);
        throw error;
    }
};

export const updateCart = async (id, cart) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, cart);
        return response.data;
    } catch (error) {
        console.error('❌ Error updating cart:', error);
        throw error;
    }
};

export const deleteCart = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('❌ Error deleting cart:', error);
        throw error;
    }
};

export const checkoutCart = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/checkout/${userId}`);
        return response.data;
    } catch (error) {
        console.error('❌ Error during checkout:', error.response?.data || error);
        throw error;
    }
};
