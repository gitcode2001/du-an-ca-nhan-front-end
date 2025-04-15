import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Paper, Card, CardContent, CardMedia, Container, Button, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { getAllFoods } from "../services/FoodService";

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

    useEffect(() => {
        const fetchFoods = async () => {
            const data = await getAllFoods();
            const sorted = [...data].sort((a, b) => (b.sold || 0) - (a.sold || 0));
            setFoods(sorted);
        };
        fetchFoods();
    }, []);

    const handleOpenDetail = (food) => {
        setSelectedFood(food);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setSelectedFood(null);
        setOpenDetail(false);
    };

    return (
        <Box sx={{ backgroundColor: '#fff8f1' }}>
            <Navbar />

            {/* Hero Section */}
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

            {/* Main Layout */}
            <Container sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    {/* Left Column */}
                    <Grid item xs={12} md={8}>
                        {/* Featured Dishes */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">🥢 Món ăn nổi bật</Typography>
                            <Grid container spacing={3}>
                                {foods.slice(0, 3).map((food) => (
                                    <Grid item xs={12} sm={6} md={4} key={food.id}>
                                        <Card elevation={3} sx={{ borderRadius: 3, cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 6 } }} onClick={() => handleOpenDetail(food)}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={food.imageUrl || `https://source.unsplash.com/featured/?vietnamese,food&sig=${food.id}`}
                                                alt={food.name}
                                            />
                                            <CardContent>
                                                <Typography variant="h6" fontWeight="bold">{food.name}</Typography>
                                                <Typography variant="subtitle2" color="green">💵 {food.price.toLocaleString()} VNĐ</Typography>
                                                <Chip label="🔥 Bán chạy" color="error" size="small" sx={{ mt: 1 }} />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Full Menu */}
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">📋 Thực đơn</Typography>
                            <Grid container spacing={2}>
                                {foods.map((food) => (
                                    <Grid item xs={12} sm={6} md={4} key={food.id}>
                                        <Card elevation={1} sx={{ borderRadius: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={() => handleOpenDetail(food)}>
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
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">📰 Tin tức & Khuyến mãi</Typography>
                        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>🎉 Khai trương chi nhánh mới tại TP.HCM</Typography>
                            <Typography variant="body2">Dola Restaurant khai trương tại quận 1 với nhiều ưu đãi hấp dẫn.</Typography>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>🥳 Giảm giá 20% khi đặt món online</Typography>
                            <Typography variant="body2">Ưu đãi áp dụng toàn bộ thực đơn đến hết tháng này.</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Customer Reviews */}
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
                    <Button variant="contained" color="primary">🛒 Đặt món</Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </Box>
    );
};

export default Home;
