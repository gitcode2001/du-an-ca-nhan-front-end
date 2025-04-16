import React, { useEffect, useState } from 'react';
import {
    getAllOrders,
    getOrdersByUserId,
    deleteOrder,
    updateOrder
} from '../../services/orderService';
import { toast } from 'react-toastify';
import {
    Box,
    Card,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
    Stack,
    Collapse,
    Divider,
    FormControlLabel,
    Switch,
    Button,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [showDeleted, setShowDeleted] = useState(true);
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const isAdmin = role === 'admin';

    const formatCurrency = (amount) => `${(amount || 0).toLocaleString('vi-VN')} VNĐ`;

    const fetchOrders = async () => {
        try {
            const data = isAdmin ? await getAllOrders() : await getOrdersByUserId(userId);
            const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const filtered = sorted.filter(order => (isAdmin ? (showDeleted || !order.deleted) : !order.deleted));
            setOrders(filtered);
        } catch (err) {
            toast.error('❌ Lỗi khi tải danh sách đơn hàng');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái xoá của đơn hàng này?')) {
            try {
                await deleteOrder(id);
                toast.success('🗑️ Đã cập nhật trạng thái xoá của đơn hàng!');
                fetchOrders();
            } catch (err) {
                toast.error('❌ Cập nhật trạng thái xoá thất bại!');
            }
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrderId(prev => (prev === orderId ? null : orderId));
    };

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [showDeleted, userId]);

    const exportSingleOrderToPDF = async (order) => {
        if (!order.orderDetails || order.orderDetails.length === 0) {
            toast.warn("Không có chi tiết để in hoá đơn.");
            return;
        }

        if (order.status !== 'CONFIRMED') {
            try {
                await updateOrder(order.id, {
                    status: 'CONFIRMED',
                    paymentMethod: order.paymentMethod,
                    totalPrice: order.totalPrice
                });
                toast.success(`✅ Đơn hàng #${order.id} đã được xác nhận.`);
                await fetchOrders();
            } catch (err) {
                toast.error('❌ Cập nhật trạng thái đơn hàng thất bại!');
                return;
            }
        }

        const orderDetails = order.orderDetails.map(detail => [
            detail.food?.name || 'Món ăn',
            detail.quantity,
            formatCurrency(detail.price)
        ]);

        const docDefinition = {
            content: [
                { text: 'NHÀ HÀNG DOLA', style: 'restaurantName' },
                { text: 'HÓA ĐƠN BÁN HÀNG', style: 'invoiceTitle' },
                { text: `Mã đơn hàng: #${order.id}`, style: 'orderCode' },
                {
                    columns: [
                        {
                            width: '*',
                            stack: [
                                { text: `👤 Khách hàng: ${order.userName || 'Khách lẻ'}` },
                                { text: `📅 Ngày tạo: ${new Date(order.createdAt).toLocaleString('vi-VN')}` },
                            ]
                        }
                    ],
                    margin: [0, 10, 0, 10]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Tên món', style: 'tableHeader' },
                                { text: 'Số lượng', style: 'tableHeader' },
                                { text: 'Đơn giá', style: 'tableHeader' }
                            ],
                            ...orderDetails
                        ]
                    },
                    layout: 'lightHorizontalLines'
                },
                {
                    columns: [
                        { width: '*', text: '' },
                        {
                            width: 'auto',
                            text: `Tổng tiền: ${formatCurrency(order.totalPrice)}`,
                            style: 'totalPrice',
                            margin: [0, 10, 0, 0]
                        }
                    ]
                },
                { text: '🌟 Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!', style: 'thankYou', margin: [0, 30, 0, 0] }
            ],
            styles: {
                restaurantName: {
                    fontSize: 14,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 5]
                },
                invoiceTitle: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 5]
                },
                orderCode: {
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    fillColor: '#e3f2fd',
                    color: '#000'
                },
                totalPrice: {
                    bold: true,
                    fontSize: 14,
                    color: '#d32f2f'
                },
                thankYou: {
                    alignment: 'center',
                    italics: true,
                    fontSize: 12,
                    color: '#4caf50'
                }
            },
            defaultStyle: {
                font: 'Roboto',
                fontSize: 11
            }
        };

        pdfMake.createPdf(docDefinition).download(`HoaDon_DonHang_${order.id}.pdf`);
    };

    const exportAllOrdersPDF = async () => {
        for (const order of orders) {
            await exportSingleOrderToPDF(order);
        }
    };

    return (
        <Box sx={{ maxWidth: 1300, margin: 'auto', padding: 3 }}>
            <Card sx={{ marginBottom: 3, padding: 2, backgroundColor: '#e0f2f1' }}>
                <Typography variant="h5" gutterBottom>
                    📦 {isAdmin ? 'Tất cả đơn hàng (quản trị viên)' : 'Lịch sử đơn hàng của bạn'}
                </Typography>
                {isAdmin && (
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControlLabel
                            control={<Switch checked={showDeleted} onChange={() => setShowDeleted(prev => !prev)} />}
                            label="Hiện đơn hàng đã xoá"
                        />
                        <Button variant="outlined" onClick={exportAllOrdersPDF}>🖨️ Xuất PDF tất cả</Button>
                        <Typography variant="subtitle2" color="text.secondary">
                            Tổng: {orders.length} đơn hàng
                        </Typography>
                    </Stack>
                )}
            </Card>
            <Paper elevation={3} sx={{ backgroundColor: '#f1f8e9' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#c8e6c9' }}>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Ngày tạo</strong></TableCell>
                            <TableCell><strong>Khách hàng</strong></TableCell>
                            <TableCell><strong>Trạng thái</strong></TableCell>
                            <TableCell><strong>Thanh toán</strong></TableCell>
                            <TableCell><strong>Tổng tiền</strong></TableCell>
                            <TableCell><strong>Hành động</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow hover sx={{ backgroundColor: order.deleted ? '#ffebee' : 'inherit' }}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '---'}</TableCell>
                                        <TableCell>{order.userName || 'Khách lẻ'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.statusDisplay || order.status || '---'}
                                                color={
                                                    order.status === 'COMPLETED'
                                                        ? 'success'
                                                        : order.status === 'CANCELLED'
                                                            ? 'error'
                                                            : 'warning'
                                                }
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>{order.paymentMethodDisplay || order.paymentMethod || '---'}</TableCell>
                                        <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton color="primary" onClick={() => toggleExpand(order.id)}>
                                                    {expandedOrderId === order.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                                {isAdmin && (
                                                    <>
                                                        <IconButton
                                                            color={order.deleted ? 'success' : 'error'}
                                                            onClick={() => handleDelete(order.id)}
                                                        >
                                                            {order.deleted ? <RestoreIcon /> : <DeleteIcon />}
                                                        </IconButton>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => exportSingleOrderToPDF(order)}
                                                        >
                                                            🧾 In hoá đơn
                                                        </Button>
                                                    </>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ padding: 0 }}>
                                            <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                                                <Box sx={{ padding: 2, backgroundColor: '#f9fbe7' }}>
                                                    <Typography variant="subtitle1" gutterBottom>Chi tiết đơn hàng:</Typography>
                                                    <Divider sx={{ mb: 1 }} />
                                                    {order.orderDetails && order.orderDetails.length > 0 ? (
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell><strong>Tên món</strong></TableCell>
                                                                    <TableCell><strong>Số lượng</strong></TableCell>
                                                                    <TableCell><strong>Đơn giá</strong></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {order.orderDetails.map((detail, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{detail.food?.name || 'Món ăn'}</TableCell>
                                                                        <TableCell>{detail.quantity}</TableCell>
                                                                        <TableCell>{formatCurrency(detail.price)}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary">Không có chi tiết.</Typography>
                                                    )}
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ color: 'gray', fontStyle: 'italic' }}>
                                    <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    Không có đơn hàng nào
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default OrderList;
