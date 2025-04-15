import axios from 'axios';

const API_URL = 'http://localhost:8080/api/categories';

export const getAllCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const getCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with id ${id}:`, error);
        return null;
    }
};

export const createCategory = async (category) => {
    try {
        const response = await axios.post(API_URL, category);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (id, category) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, category);
        return response.data;
    } catch (error) {
        console.error(`Error updating category with id ${id}:`, error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting category with id ${id}:`, error);
        throw error;
    }
};