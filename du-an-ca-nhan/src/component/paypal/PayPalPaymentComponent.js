// src/components/PayPalPaymentComponent.jsx
import React, { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
    Divider
} from '@mui/material';
import { createPayment } from '../../services/PayPalService';

const PayPalPaymentComponent = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const redirectUrl = await createPayment(parseFloat(amount));
            if (redirectUrl && redirectUrl.startsWith('http')) {
                window.location.href = redirectUrl; 
            } else {
                setError('Không thể tạo thanh toán.');
            }
        } catch (err) {
            console.error(err);
            setError('Đã xảy ra lỗi khi tạo thanh toán.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f0f4f8'
            }}
        >
            <Paper elevation={4} sx={{ p: 5, borderRadius: 3, width: 400 }}>
                <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    💳 Thanh toán PayPal
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <TextField
                    label="Số tiền (USD)"
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handlePayment}
                    disabled={loading}
                    sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Thanh toán ngay'}
                </Button>
            </Paper>
        </Box>
    );
};

export default PayPalPaymentComponent;
