import React, { useEffect, useState } from 'react';
import {
    getAllOrderDetails,
    deleteOrderDetail
} from '../../services/orderDetailService';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const OrderDetailList = () => {
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        try {
            const data = await getAllOrderDetails();
            setOrderDetails(data);
        } catch (error) {
            toast.error('Lỗi khi tải chi tiết đơn hàng!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xoá chi tiết đơn hàng này không?')) {
            try {
                await deleteOrderDetail(id);
                toast.success('Đã xoá chi tiết đơn hàng!');
                fetchOrderDetails();
            } catch (error) {
                toast.error('Xoá thất bại!');
            }
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom>
                Danh sách Chi tiết Đơn hàng
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orderDetails.map((detail) => (
                        <TableRow key={detail.id}>
                            <TableCell>{detail.id}</TableCell>
                            <TableCell>{detail.productName}</TableCell>
                            <TableCell>{detail.quantity}</TableCell>
                            <TableCell>{detail.price}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(detail.id)}
                                >
                                    Xoá
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default OrderDetailList;
