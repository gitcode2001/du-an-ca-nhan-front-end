import React, { useEffect, useContext, useRef, useState } from 'react';
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

    const calledRef = useRef(false); // ✅ Ngăn gọi lại khi reload

    useEffect(() => {
        const paymentId = searchParams.get("paymentId");
        const payerId = searchParams.get("PayerID"); // ⚠️ Đúng tên key
        const orderId = searchParams.get("orderId");
        const userId = parseInt(localStorage.getItem("userId"));

        const handleSuccess = async () => {
            try {
                const result = await executePayment(paymentId, payerId, orderId);

                if (typeof result === 'string' && result.includes('PAYMENT_ALREADY_DONE')) {
                    toast.info("💡 Giao dịch đã được xử lý trước đó.");
                } else {
                    toast.success("🎉 Thanh toán và đơn hàng đã xác nhận!");
                }

                // Nếu có user, gọi xoá giỏ hàng
                if (!isNaN(userId)) {
                    try {
                        await checkoutCart(userId);
                    } catch (err) {
                        console.warn("Không thể xoá giỏ hàng:", err);
                    }
                }

                refreshCartCount();
            } catch (error) {
                console.error("❌ Lỗi khi xác nhận thanh toán:", error);
                toast.error("❌ Lỗi khi xác nhận thanh toán.");
            } finally {
                setLoading(false);
            }
        };

        if (!calledRef.current && paymentId && payerId && orderId) {
            calledRef.current = true;
            handleSuccess();
        } else if (!paymentId || !payerId || !orderId) {
            toast.error("❌ Thiếu thông tin thanh toán.");
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
