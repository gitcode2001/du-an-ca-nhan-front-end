import axios from "axios";

const API_URL = "http://localhost:8080/api/reviews";

const getToken = () => {
    return localStorage.getItem("token");
};

// ✅ Nhận object reviewData
export const createReview = async (reviewData) => {
    const token = getToken();
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.post(API_URL, reviewData, { headers });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo review:", error);
        throw error;
    }
};

export const getReviewsByFoodId = async (foodId) => {
    const url = `${API_URL}/food/${foodId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy review theo món:", error);
        throw error;
    }
};

export const deleteReview = async (reviewId) => {
    const token = getToken();
    const url = `${API_URL}/${reviewId}`;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.delete(url, { headers });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa review:", error);
        throw error;
    }
};
