import axios from 'axios';

const API_URL = 'http://localhost:8080/api/images';

export const getAllImages = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};

export const getImageById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching image with id ${id}:`, error);
        return null;
    }
};

export const createImage = async (image) => {
    try {
        const response = await axios.post(API_URL, image);
        return response.data;
    } catch (error) {
        console.error('Error creating image:', error);
        throw error;
    }
};

export const updateImage = async (id, image) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, image);
        return response.data;
    } catch (error) {
        console.error(`Error updating image with id ${id}:`, error);
        throw error;
    }
};

export const deleteImage = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting image with id ${id}:`, error);
        throw error;
    }
};