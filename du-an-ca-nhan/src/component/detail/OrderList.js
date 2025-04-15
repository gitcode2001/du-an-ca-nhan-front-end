import React, { useEffect, useState } from 'react';
import {
    getAllOrders,
    deleteOrder
} from '../../services/orderService';
import { checkoutCart } from '../../services/CartService';
import { toast } from 'react-toastify';
import {
    Box,
    Button,
    Card,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const userId = localStorage.getItem('userId');

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            toast.error('❌ Lỗi khi tải danh sách đơn hàng');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
            try {
                await deleteOrder(id);
                toast.success('🗑️ Xóa đơn hàng thành công!');
                fetchOrders();
            } catch (err) {
                toast.error('❌ Xóa đơn hàng thất bại!');
            }
        }
    };

    const handleCheckout = async () => {
        try {
            const order = await checkoutCart(userId);
            toast.success('✅ Đặt hàng thành công!');
            fetchOrders();
        } catch (err) {
            toast.error('❌ Đặt hàng thất bại! Vui lòng thử lại.');
        }
    };

    const getStatusName = (status) => {
        switch (status) {
            case 0: return "Chờ xử lý";
            case 1: return "Đã xác nhận";
            case 2: return "Đã giao";
            default: return "Không xác định";
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
            <Card sx={{ marginBottom: 3, padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Danh sách đơn hàng
                </Typography>

                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleCheckout}
                    >
                        + Tạo đơn hàng từ giỏ hàng
                    </Button>
                </Box>
            </Card>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{getStatusName(order.status)}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => setSelectedOrder(order)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(order.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Không có đơn hàng nào</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default OrderList;
