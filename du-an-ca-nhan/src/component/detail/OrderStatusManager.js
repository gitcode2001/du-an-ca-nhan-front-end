import React, { useEffect, useState } from 'react';
import {
    Box, Button, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Typography,
    CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
    getAllOrderStatus,
    getOrderStatusById,
    createOrderStatus,
    updateOrderStatus,
    deleteOrderStatus,
} from '../../services/orderStatusService';
import InfoIcon from '@mui/icons-material/Info';

const OrderStatusManager = () => {
    const [statuses, setStatuses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllOrderStatus();
            setStatuses(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách trạng thái đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (editingId) {
                await updateOrderStatus(editingId, data);
                toast.success('Cập nhật trạng thái thành công');
            } else {
                await createOrderStatus(data);
                toast.success('Tạo trạng thái mới thành công');
            }
            reset();
            setEditingId(null);
            fetchData();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xử lý');
        }
    };

    const handleEdit = async (id) => {
        try {
            const status = await getOrderStatusById(id);
            setValue('name', status.name);
            setEditingId(id);
        } catch (error) {
            toast.error('Không thể lấy thông tin trạng thái');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            try {
                await deleteOrderStatus(id);
                toast.success('Xóa thành công');
                fetchData();
            } catch (error) {
                toast.error('Không thể xóa trạng thái');
            }
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                Quản lý Trạng thái Đơn hàng
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', gap: 2, mb: 3 }}
            >
                <TextField
                    label="Tên trạng thái"
                    {...register('name', { required: 'Tên không được bỏ trống' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ flex: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">
                    {editingId ? 'Cập nhật' : 'Thêm'}
                </Button>
                {editingId && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            reset();
                            setEditingId(null);
                        }}
                    >
                        Hủy
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box textAlign="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tên Trạng Thái</TableCell>
                                <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {statuses.length > 0 ? (
                                statuses.map((status) => (
                                    <TableRow key={status.id}>
                                        <TableCell>{status.id}</TableCell>
                                        <TableCell>{status.name}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEdit(status.id)}
                                                sx={{ mr: 1 }}
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(status.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ color: 'gray', fontStyle: 'italic' }}>
                                        <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default OrderStatusManager;
