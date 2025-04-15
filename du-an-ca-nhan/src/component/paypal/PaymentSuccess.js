import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { executePayment } from '../../services/PayPalService';
import { checkoutCart } from '../../services/CartService';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Button
} from '@mui/material';
import { CartContext } from '../cart/CartManagerComponent';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshCartCount } = useContext(CartContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const paymentId = searchParams.get("paymentId");
        const payerId = searchParams.get("PayerID");
        const userId = parseInt(localStorage.getItem("userId"));

        const handleSuccess = async () => {
            try {
                await executePayment(paymentId, payerId);

                if (!isNaN(userId)) {
                    try {
                        await checkoutCart(userId);
                    } catch (checkoutError) {
                        console.warn("Giỏ hàng có thể đã bị xoá hoặc trống:", checkoutError);
                    }
                }

                refreshCartCount();
                toast.success("🎉 Thanh toán thành công! Cảm ơn bạn đã đặt hàng.");
            } catch (error) {
                console.error("Lỗi khi xử lý thanh toán:", error);
                toast.error("❌ Lỗi khi xử lý thanh toán.");
            } finally {
                setLoading(false);
            }
        };

        if (paymentId && payerId && userId) {
            handleSuccess();
        } else {
            toast.error("Dữ liệu thanh toán không hợp lệ.");
            setLoading(false);
        }
    }, [searchParams, refreshCartCount]);

    return (
        <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', maxWidth: 500 }}>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                    🎉 Thanh toán thành công!
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                </Typography>

                {loading ? (
                    <CircularProgress color="success" sx={{ mt: 3 }} />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
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

export default PaymentSuccess;