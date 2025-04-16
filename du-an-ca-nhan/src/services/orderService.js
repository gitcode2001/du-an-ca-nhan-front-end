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

// Tạo đơn hàng mới
export const createOrder = async (order) => {
    try {
        const response = await axios.post(API_URL, order);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi tạo đơn hàng:', error);
        throw error;
    }
};

// Cập nhật đơn hàng theo ID
export const updateOrder = async (id, order) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, order);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật đơn hàng ID = ${id}:`, error);
        throw error;
    }
};

// Xoá đơn hàng
export const deleteOrder = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi xoá đơn hàng ID = ${id}:`, error);
        throw error;
    }
};

// Cập nhật trạng thái đơn hàng riêng biệt
export const updateOrderStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng ID = ${id}:`, error);
        throw error;
    }
};

// Tạo mới hoặc cập nhật đơn hàng đang chờ
export const createOrUpdatePendingOrder = async (userId, carts, totalPrice) => {
    try {
        const orders = await getOrdersByUserId(userId);
        const pendingOrder = orders.find(o => o.status === 'PENDING');

        const orderDetails = carts.map(cart => ({
            food: { id: cart.food.id },
            quantity: cart.quantity,
            price: cart.food.price
        }));

        if (pendingOrder) {
            const updatedOrder = {
                id: pendingOrder.id,
                user: { id: userId },
                totalPrice,
                paymentMethod: 'PAYPAL',
                status: 'PENDING',
                orderDetails
            };
            return await updateOrder(pendingOrder.id, updatedOrder);
        } else {
            const newOrder = {
                user: { id: userId },
                totalPrice,
                status: 'PENDING',
                paymentMethod: 'PAYPAL',
                orderDetails
            };
            return await createOrder(newOrder);
        }
    } catch (error) {
        console.error('❌ Lỗi khi tạo hoặc cập nhật đơn hàng đang chờ:', error);
        throw error;
    }
};