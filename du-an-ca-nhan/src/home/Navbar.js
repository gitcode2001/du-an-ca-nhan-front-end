import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, InputBase, Box, Stack,
    Button, IconButton, Tooltip, Badge, Menu, MenuItem, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCartsByUserId } from '../services/CartService';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    const queryParams = new URLSearchParams(location.search);
    const initialKeyword = queryParams.get("keyword") || "";

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [cartCount, setCartCount] = useState(0);
    const [search, setSearch] = useState(initialKeyword);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                if (userId) {
                    const response = await getCartsByUserId(userId);
                    const carts = Array.isArray(response)
                        ? response
                        : Array.isArray(response?.carts)
                            ? response.carts
                            : response?.data || [];

                    const totalItems = carts.reduce((sum, cart) => sum + cart.quantity, 0);
                    setCartCount(totalItems);
                }
            } catch (error) {
                console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
            }
        };

        fetchCartCount();
    }, [userId]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleMenuClose();
    };

    const handleSearchChange = (e) => {
        const keyword = e.target.value;
        setSearch(keyword);
        navigate(`/foods?keyword=${encodeURIComponent(keyword)}`);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#004d40', px: 2 }}>
            <Toolbar>
                <RestaurantIcon sx={{ mr: 1 }} />
                <Typography
                    variant="h6"
                    component={Link}
                    to="/home"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    Dola Restaurant
                </Typography>

                <Box
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        width: '30%',
                        mr: 2
                    }}
                >
                    <SearchIcon sx={{ color: '#004d40' }} />
                    <InputBase
                        placeholder="Tìm món ăn..."
                        sx={{ ml: 1, flex: 1 }}
                        value={search}
                        onChange={handleSearchChange}
                    />
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Yêu thích">
                        <IconButton color="inherit">
                            <FavoriteBorderIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Giỏ hàng">
                        <IconButton color="inherit" onClick={() => navigate("/cart") }>
                            <Badge badgeContent={cartCount} color="error" showZero>
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Thực đơn">
                        <IconButton color="inherit" onClick={() => navigate("/foods") }>
                            <RestaurantMenuIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Đơn hàng">
                        <IconButton color="inherit" onClick={() => navigate("/orders") }>
                            <ReceiptLongIcon />
                        </IconButton>
                    </Tooltip>

                    {username ? (
                        <>
                            <Tooltip title="Tài khoản">
                                <IconButton color="inherit" onClick={handleMenuOpen}>
                                    <PersonIcon />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem disabled>👋 Xin chào, {username}</MenuItem>
                                <Divider />
                                <MenuItem onClick={() => handleNavigate("/profile")}>👤 Xem thông tin</MenuItem>
                                <MenuItem onClick={() => handleNavigate("/change-password")}>🔒 Đổi mật khẩu</MenuItem>
                                {role === "admin" && (
                                    <>
                                        <Divider />
                                        <MenuItem onClick={() => handleNavigate("/admin/users")}>👥 Quản lý người dùng</MenuItem>
                                        <MenuItem onClick={() => handleNavigate("/foods")}>🍽️ Quản lý món ăn</MenuItem>
                                        <MenuItem onClick={() => handleNavigate("/admin/statistics")}>📊 Thống kê</MenuItem>
                                    </>
                                )}
                                <Divider />
                                <MenuItem onClick={handleLogout}>🚪 Đăng xuất</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button
                            color="inherit"
                            startIcon={<LoginIcon />}
                            sx={{ ml: 2 }}
                            onClick={() => navigate("/login")}
                        >
                            Đăng nhập
                        </Button>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
