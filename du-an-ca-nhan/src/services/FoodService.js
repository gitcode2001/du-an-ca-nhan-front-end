import axios from 'axios';

const API_URL = 'http://localhost:8080/api/foods';

export const getAllFoods = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch foods:', error);
        return [];
    }
};

export const getFoodById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch food with id ${id}:`, error);
        return null;
    }
};

export const createFood = async (food) => {
    try {
        const response = await axios.post(API_URL, food);
        return response.data;
    } catch (error) {
        console.error('Failed to create food:', error);
        throw error;
    }
};

export const updateFood = async (id, food) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, food);
        return response.data;
    } catch (error) {
        console.error(`Failed to update food with id ${id}:`, error);
        throw error;
    }
};

export const deleteFood = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Failed to delete food with id ${id}:`, error);
        throw error;
    }
};





