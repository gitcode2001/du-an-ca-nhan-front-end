// src/component/paypal/PaymentCancel.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { cancelPayment } from '../../services/PayPalService';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (orderId) {
            cancelPayment(orderId)
                .then((msg) => toast.info(msg))
                .catch(() => toast.error("❌ Lỗi khi huỷ thanh toán."))
                .finally(() => setLoading(false));
        } else {
            toast.error("❌ Không có thông tin đơn hàng.");
            setLoading(false);
        }
    }, [orderId]);

    return (
        <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', maxWidth: 500 }}>
                <Typography variant="h5" fontWeight="bold" color="error">
                    ❌ Thanh toán đã bị huỷ
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Đơn hàng chưa được xử lý. Bạn có thể đặt lại bất cứ lúc nào.
                </Typography>

                {loading ? (
                    <CircularProgress color="error" sx={{ mt: 3 }} />
                ) : (
                    <Button
                        variant="outlined"
                        sx={{ mt: 4, fontWeight: 'bold' }}
                        onClick={() => navigate('/home')}
                    >
                        🔙 Về trang chủ
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default PaymentCancel;
