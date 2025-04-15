import axios from 'axios';

const API_URL = 'http://localhost:8080/api/payment';

// Tạo thanh toán và trả về link chuyển hướng đến PayPal
export const createPayment = async (amount) => {
    try {
        const response = await axios.post(`${API_URL}/create`, null, {
            params: { amount }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi tạo thanh toán:', error);
        throw error;
    }
};

export const executePayment = async (paymentId, payerId) => {
    try {
        const response = await axios.get(`${API_URL}/success`, {
            params: { paymentId, PayerID: payerId } // CHÚ Ý: key là "PayerID"
        });
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi xác nhận thanh toán:', error);
        throw error;
    }
};

export const cancelPayment = async () => {
    try {
        const response = await axios.get(`${API_URL}/cancel`);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi huỷ thanh toán:', error);
        throw error;
    }
};
