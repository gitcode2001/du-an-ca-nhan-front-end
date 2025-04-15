import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../services/orderService';
import { Card, CardContent, Typography, Grid, Divider } from '@mui/material';

const OrderHistoryComponent = ({ userId }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const allOrders = await getAllOrders();
            const userOrders = allOrders.filter(o => o.user.id === userId);
            setOrders(userOrders);
        };
        fetchOrders();
    }, [userId]);

    return (
        <div>
            <Typography variant="h5" gutterBottom>🧾 Lịch sử đơn hàng</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {orders.map(order => (
                    <Grid item xs={12} md={6} key={order.id}>
                        <Card>
                            <CardContent>
                                <Typography><strong>Mã đơn:</strong> #{order.id}</Typography>
                                <Typography><strong>Ngày:</strong> {new Date(order.createdAt).toLocaleString()}</Typography>
                                <Typography><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()} VND</Typography>
                                <Typography><strong>Trạng thái:</strong> {order.status}</Typography>
                                <Typography><strong>Thanh toán:</strong> {order.paymentMethod}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default OrderHistoryComponent;
