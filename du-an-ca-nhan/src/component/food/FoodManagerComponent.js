import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Typography,
    IconButton,
    Stack,
    Paper,
    Tooltip,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Pagination
} from '@mui/material';
import { Add, Edit, Delete, ShoppingCart, Info } from '@mui/icons-material';
import { getAllFoods, deleteFood } from '../../services/FoodService';
import { getAllCategories } from '../../services/CategoryService';
import { createCart } from '../../services/CartService';
import FoodFormDialog from './FoodFormDialog';
import CartManagerComponent, { CartContext } from '../cart/CartManagerComponent';
import Navbar from '../../home/Navbar';
import Footer from '../../home/Footer';
import FoodReviewComponent from '../food/FoodReviewComponent';
import { useNavigate, useLocation } from 'react-router-dom';

const FoodManagerComponent = () => {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [cartTrigger, setCartTrigger] = useState(0);
    const [openDetail, setOpenDetail] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword") || "";

    const userId = parseInt(localStorage.getItem("userId"));
    const userRole = localStorage.getItem("role");
    const isAdmin = userRole === 'admin';
    const isLoggedIn = !isNaN(userId);

    const { refreshCartCount } = useContext(CartContext);

    const fetchFoods = async () => {
        try {
            const data = await getAllFoods();
            setFoods(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách món ăn", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi tải danh mục", error);
        }
    };

    useEffect(() => {
        fetchFoods();
        fetchCategories();
    }, []);

    useEffect(() => {
        let filtered = foods;
        if (keyword) {
            filtered = filtered.filter(food =>
                food.name.toLowerCase().includes(keyword.toLowerCase()) ||
                food.description?.toLowerCase().includes(keyword.toLowerCase())
            );
        }
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(food => food.category?.id === selectedCategory);
        }
        setFilteredFoods(filtered);
        setCurrentPage(1);
    }, [foods, selectedCategory, keyword]);

    const handleAdd = () => {
        setSelectedFood(null);
        setOpenDialog(true);
    };

    const handleEdit = (food) => {
        setSelectedFood(food);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xoá món ăn này?')) {
            await deleteFood(id);
            fetchFoods();
        }
    };

    const handleBuy = async (food) => {
        if (!isLoggedIn) {
            alert("⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        if (food.quantity <= 0 || isBuying) {
            alert("⛔ Món này đã hết hàng!");
            return;
        }

        setIsBuying(true);
        try {
            await createCart({
                quantity: 1,
                note: '',
                user: { id: userId },
                food: { id: food.id }
            });
            alert(`🛒 Đã thêm "${food.name}" vào giỏ hàng!`);
            setFoods(prevFoods =>
                prevFoods.map(item =>
                    item.id === food.id ? { ...item, quantity: item.quantity - 1 } : item
                )
            );
            setCartTrigger(prev => prev + 1);
            refreshCartCount();
        } catch (error) {
            const message = error?.response?.data?.message || "❌ Lỗi khi thêm vào giỏ hàng!";
            alert(message);
        } finally {
            setIsBuying(false);
        }
    };

    const handleOpenDetail = (food) => {
        setSelectedFood(food);
        setOpenDetail(true);
    };

    const paginatedFoods = filteredFoods.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <Navbar keyword={keyword} />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} mb={3}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        🍽️ Quản lý món ăn
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        {isAdmin && (
                            <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                                Thêm món
                            </Button>
                        )}
                        <Button
                            variant={showCart ? "outlined" : "contained"}
                            startIcon={<ShoppingCart />}
                            onClick={() => setShowCart(!showCart)}
                        >
                            {showCart ? "Ẩn giỏ hàng" : "Xem giỏ"}
                        </Button>
                    </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} mb={3}>
                    <FormControl fullWidth>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Danh mục"
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                {showCart && (
                    <Paper elevation={3} sx={{ p: 2, mb: 4, backgroundColor: '#f5f5f5' }}>
                        <CartManagerComponent
                            userId={userId}
                            setFoods={setFoods}
                            cartUpdatedTrigger={cartTrigger}
                        />
                    </Paper>
                )}

                <Grid container spacing={3}>
                    {paginatedFoods.map(food => (
                        <Grid item xs={12} sm={6} md={4} key={food.id}>
                            <Card elevation={4} sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {food.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={food.imageUrl}
                                        alt={food.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" color="primary">{food.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            💵 {food.price.toLocaleString()} VNĐ<br />
                                            📦 {food.quantity > 0 ? `Còn lại: ${food.quantity}` : "⛔ Hết hàng"}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
                                        <Tooltip title="Chi tiết">
                                            <IconButton color="info" onClick={() => handleOpenDetail(food)}>
                                                <Info />
                                            </IconButton>
                                        </Tooltip>
                                        {isAdmin && (
                                            <>
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton color="primary" onClick={() => handleEdit(food)}>
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xoá">
                                                    <IconButton color="error" onClick={() => handleDelete(food.id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                        {food.quantity > 0 && (
                                            <Tooltip title="Thêm vào giỏ">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => handleBuy(food)}
                                                    disabled={isBuying}
                                                >
                                                    <ShoppingCart />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Stack alignItems="center" mt={4}>
                    <Pagination
                        count={Math.ceil(filteredFoods.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(e, page) => setCurrentPage(page)}
                        color="primary"
                    />
                </Stack>

                <FoodFormDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSave={fetchFoods}
                    food={selectedFood}
                    categories={categories}
                />

                <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>📋 Chi tiết món ăn</DialogTitle>
                    {selectedFood && (
                        <DialogContent>
                            <img
                                src={selectedFood.imageUrl}
                                alt={selectedFood.name}
                                style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
                            />
                            <Typography variant="h6">{selectedFood.name}</Typography>
                            <Typography>💵 Giá: {selectedFood.price.toLocaleString()} VNĐ</Typography>
                            <Typography>📦 Số lượng: {selectedFood.quantity}</Typography>
                            <Typography>📄 Mô tả: {selectedFood.description}</Typography>
                            <Typography>📂 Danh mục: {selectedFood.category?.name || 'Không có'}</Typography>
                            <Typography>🏷️ Trạng thái: {selectedFood.status}</Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" mb={1} fontWeight="bold">
                                Đánh giá từ người dùng
                            </Typography>
                            <FoodReviewComponent foodId={selectedFood.id} readOnly={!isLoggedIn} />
                        </DialogContent>
                    )}
                </Dialog>
            </Container>
            <Footer />
        </>
    );
};

export default FoodManagerComponent;
