import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Typography, Grid, Paper, Card, CardContent, CardMedia, Container, Button, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, Grow, CircularProgress
} from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { getAllFoods } from "../services/FoodService";
import { getTopSoldFoods } from "../services/orderDetailService";
import FireIcon from '@mui/icons-material/Whatshot';
import { keyframes } from '@emotion/react';
import { createCart } from '../services/CartService';
import { CartContext } from "../component/cart/CartContext";

const fireAnimation = keyframes`
    0% { transform: scale(1); color: red; }
    50% { transform: scale(1.3); color: orange; }
    100% { transform: scale(1); color: red; }
`;

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [topFoods, setTopFoods] = useState([]);
    const [groupedFoods, setGroupedFoods] = useState({});
    const [selectedFood, setSelectedFood] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const { refreshCartCount } = useContext(CartContext);

    useEffect(() => {
        const fetchFoods = async () => {
            const allData = await getAllFoods();
            setFoods(allData);

            const grouped = {};
            allData.forEach(food => {
                const categoryName = food.category?.name || 'Khác';
                if (!grouped[categoryName]) grouped[categoryName] = [];
                grouped[categoryName].push(food);
            });
            setGroupedFoods(grouped);
        };
        const fetchTopFoods = async () => {
            const topData = await getTopSoldFoods();
            setTopFoods(topData);
        };
        fetchFoods();
        fetchTopFoods();
    }, []);

    const handleOpenDetail = (food) => {
        setSelectedFood(food);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setSelectedFood(null);
        setOpenDetail(false);
    };

    const handleAddToCart = async () => {
        if (!selectedFood) return;
        const userId = localStorage.getItem("userId");
        if (!userId) return alert("Bạn cần đăng nhập để đặt món.");

        try {
            setAddingToCart(true);
            await createCart({
                quantity: 1,
                note: '',
                user: { id: parseInt(userId) },
                food: { id: selectedFood.id }
            });
            refreshCartCount();
            alert(`🛒 Đã thêm "${selectedFood.name}" vào giỏ hàng!`);
            handleCloseDetail();
        } catch (error) {
            alert("❌ Lỗi khi thêm vào giỏ hàng!");
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#fff8f1' }}>
            <Navbar />

            <Box sx={{ backgroundColor: '#fdf2e9', py: 6 }}>
                <Container>
                    <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
                        🍽️ Chào mừng đến với Dola Restaurant
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Trải nghiệm ẩm thực truyền thống Việt Nam với nguyên liệu tươi sạch và phong cách phục vụ hiện đại.
                    </Typography>
                </Container>
            </Box>

            <Container sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">🔥 Món bán chạy</Typography>
                            <Grid container spacing={3}>
                                {topFoods.slice(0, 6).map((food, index) => (
                                    <Grow in timeout={(index + 1) * 300} key={food.id}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card elevation={3} sx={{ borderRadius: 3, cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 6 }, position: 'relative' }} onClick={() => handleOpenDetail(food)}>
                                                <CardMedia
                                                    component="img"
                                                    height="180"
                                                    image={food.imageUrl || `https://source.unsplash.com/featured/?vietnamese,food&sig=${food.id}`}
                                                    alt={food.name}
                                                />
                                                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                                    <Chip
                                                        icon={<FireIcon />}
                                                        label={`🔥 ${food.sold || 0} đã bán`}
                                                        color="error"
                                                        size="small"
                                                        sx={{ animation: `${fireAnimation} 1.2s infinite`, fontWeight: 'bold' }}
                                                    />
                                                </Box>
                                                <CardContent>
                                                    <Typography variant="h6" fontWeight="bold">{food.name}</Typography>
                                                    <Typography variant="subtitle2" color="green">💵 {food.price.toLocaleString()} VNĐ</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grow>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">📰 Tin tức & Khuyến mãi</Typography>
                        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>🎉 Khai trương chi nhánh mới tại TP.HCM</Typography>
                            <Typography variant="body2">Dola Restaurant khai trương tại quận 1 với nhiều ưu đãi hấp dẫn.</Typography>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>🥳 Giảm giá 20% khi đặt món online</Typography>
                            <Typography variant="body2">Ưu đãi áp dụng toàn bộ thực đơn đến hết tháng này.</Typography>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>🍲 Món mới ra mắt</Typography>
                            <Typography variant="body2">Thưởng thức hương vị mới lạ cùng món canh riêu đặc biệt.</Typography>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>🎂 Tặng món tráng miệng sinh nhật</Typography>
                            <Typography variant="body2">Khách hàng có sinh nhật trong tháng được tặng miễn phí món tráng miệng.</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">📋 Thực đơn theo danh mục</Typography>
                        {Object.entries(groupedFoods).map(([categoryName, items]) => (
                            <Box key={categoryName} sx={{ mb: 5 }}>
                                <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>{categoryName}</Typography>
                                <Grid container spacing={3} justifyContent="center">
                                    {[...items]
                                        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
                                        .slice(0, 4)
                                        .map(food => (
                                            <Grid item xs={12} sm={6} md={3} key={food.id}>
                                                <Card elevation={2} sx={{ borderRadius: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={() => handleOpenDetail(food)}>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={food.imageUrl || `https://source.unsplash.com/featured/?vietnamese,dish&sig=${food.id}`}
                                                        alt={food.name}
                                                    />
                                                    <CardContent>
                                                        <Typography fontWeight="bold">{food.name}</Typography>
                                                        <Typography variant="body2" color="green">💵 {food.price.toLocaleString()} VNĐ</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                </Grid>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </Container>

            <Box sx={{ py: 6, backgroundColor: '#fefefe' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">⭐ Đánh giá khách hàng</Typography>
                    <Typography variant="body1" gutterBottom>“Món ăn tuyệt vời, phục vụ chuyên nghiệp.” – <strong>Hieu1</strong></Typography>
                    <Typography variant="body1">“Không gian đẹp, món ngon chuẩn vị quê.” – <strong>Da Lun</strong></Typography>
                </Container>
            </Box>

            <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
                <DialogTitle>Chi tiết món ăn</DialogTitle>
                {selectedFood && (
                    <DialogContent>
                        <img src={selectedFood.imageUrl} alt={selectedFood.name} style={{ width: '100%', borderRadius: 8 }} />
                        <Typography variant="h6" mt={2}>{selectedFood.name}</Typography>
                        <Typography>💵 Giá: {selectedFood.price.toLocaleString()} VNĐ</Typography>
                        <Typography>📄 Mô tả: {selectedFood.description}</Typography>
                        <Typography>📂 Danh mục: {selectedFood.category?.name || 'Không có'}</Typography>
                        <Typography>🏷️ Trạng thái: {selectedFood.status}</Typography>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={handleCloseDetail} color="secondary">Đóng</Button>
                    <Button variant="contained" color="primary" onClick={handleAddToCart} disabled={addingToCart}>
                        {addingToCart ? <CircularProgress size={22} color="inherit" /> : '🛒 Đặt món'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </Box>
    );
};

export default Home;
