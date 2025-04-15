// CartManagerComponent.jsx
import React, { useEffect, useState, useContext, createContext } from 'react';
import {
    Grid, Card, CardContent, CardMedia, Typography, IconButton,
    Box, Button, Divider, Stack, Paper
} from '@mui/material';
import { Delete, Payment, ShoppingCart } from '@mui/icons-material';
import {
    getCartsByUserId,
    deleteCart
} from '../../services/CartService';
import { createPayment } from '../../services/PayPalService';

// Context chia sẻ số lượng giỏ hàng
export const CartContext = createContext({ cartCount: 0, refreshCartCount: () => {} });

const CartManagerComponent = ({ userId: propUserId, setFoods, cartUpdatedTrigger }) => {
    const [carts, setCarts] = useState([]);
    const { refreshCartCount } = useContext(CartContext);

    const localUserId = localStorage.getItem("userId");
    const userId = propUserId || (localUserId ? parseInt(localUserId) : null);

    const fetchCart = async () => {
        try {
            const data = await getCartsByUserId(userId);
            setCarts(Array.isArray(data) ? data : []);
            refreshCartCount();
        } catch (e) {
            console.error("Lỗi khi tải giỏ hàng:", e);
            setCarts([]);
        }
    };

    useEffect(() => {
        if (userId && Number.isInteger(Number(userId))) {
            fetchCart();
        } else {
            console.warn("Không có userId hợp lệ để tải giỏ hàng.");
        }
    }, [userId, cartUpdatedTrigger]);

    const handleDelete = async (cartId, foodId, quantity) => {
        if (window.confirm("Bạn có chắc chắn xoá món này khỏi giỏ hàng?")) {
            try {
                await deleteCart(cartId);
                if (setFoods) {
                    setFoods(prev =>
                        prev.map(item =>
                            item.id === foodId
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    );
                }
                fetchCart();
            } catch (error) {
                console.error("Lỗi khi xoá món khỏi giỏ hàng:", error);
            }
        }
    };

    const handleCheckout = async () => {
        const total = carts.reduce((sum, cart) => sum + cart.food.price * cart.quantity, 0);
        if (total <= 0) {
            alert("Giỏ hàng trống hoặc không hợp lệ.");
            return;
        }

        try {
            const usdAmount = total / 24000;
            const redirectUrl = await createPayment(usdAmount);

            if (redirectUrl && redirectUrl.startsWith("http")) {
                window.location.href = redirectUrl;
            } else {
                alert("Không thể tạo thanh toán.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán:", error);
            alert("❌ Lỗi khi tạo thanh toán!");
        }
    };

    const total = carts.reduce((sum, cart) => sum + cart.food.price * cart.quantity, 0);

    return (
        <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                🛒 Giỏ hàng của bạn
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {carts.length === 0 ? (
                <Box textAlign="center" py={5}>
                    <ShoppingCart sx={{ fontSize: 60, color: 'gray' }} />
                    <Typography variant="h6" color="textSecondary">
                        Giỏ hàng trống
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {carts.map(cart => (
                            <Grid item xs={12} key={cart.id}>
                                <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                                    <CardMedia
                                        component="img"
                                        image={cart.food.imageUrl}
                                        alt={cart.food.name}
                                        sx={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 1 }}
                                    />
                                    <Box sx={{ flex: 1, pl: 2 }}>
                                        <Typography variant="h6">{cart.food.name}</Typography>
                                        <Typography variant="body2">Số lượng: {cart.quantity}</Typography>
                                        <Typography variant="body2">
                                            Giá: {cart.food.price.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={() => handleDelete(cart.id, cart.food.id, cart.quantity)}>
                                        <Delete color="error" />
                                    </IconButton>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box mt={4}>
                        <Divider sx={{ mb: 2 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">
                                🧾 Tổng cộng: {total.toLocaleString()} VNĐ
                            </Typography>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<Payment />}
                                onClick={handleCheckout}
                            >
                                Thanh toán
                            </Button>
                        </Stack>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default CartManagerComponent;
