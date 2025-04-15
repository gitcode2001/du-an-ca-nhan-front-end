import React, { useEffect, useState } from 'react';
import {
    createOrder,
    updateOrder
} from '../../services/orderService';
import { toast } from 'react-toastify';

const OrderForm = ({ order, onFinish }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        status: ''
    });

    useEffect(() => {
        if (order) {
            setFormData({
                customerName: order.customerName || '',
                status: order.status || ''
            });
        } else {
            setFormData({
                customerName: '',
                status: ''
            });
        }
    }, [order]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (order) {
                await updateOrder(order.id, formData);
                toast.success('Cập nhật đơn hàng thành công!');
            } else {
                await createOrder(formData);
                toast.success('Tạo đơn hàng thành công!');
            }
            onFinish();
            setFormData({ customerName: '', status: '' });
        } catch (err) {
            toast.error('Thao tác thất bại!');
        }
    };

    return (
        <div>
            <h3>{order ? 'Cập nhật đơn hàng' : 'Thêm đơn hàng mới'}</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên khách hàng:</label>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Trạng thái:</label>
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{order ? 'Cập nhật' : 'Thêm mới'}</button>
            </form>
        </div>
    );
};

export default OrderForm;
