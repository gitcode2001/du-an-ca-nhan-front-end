import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Typography,
    Grid,
    Paper
} from '@mui/material';
import { getUserByUsername } from '../services/userService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const username = localStorage.getItem("username");

    useEffect(() => {
        const fetchUser = async () => {
            if (!username) {
                setError("Không tìm thấy username trong localStorage.");
                return;
            }

            try {
                const res = await getUserByUsername(username);
                if (!res || res.error) {
                    setError("Không tìm thấy thông tin người dùng.");
                } else {
                    setUser(res);
                }
            } catch (err) {
                console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
                setError("Lỗi máy chủ hoặc kết nối khi lấy thông tin.");
            }
        };

        fetchUser();
    }, [username]);

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('vi-VN');
        } catch {
            return "Không xác định";
        }
    };

    const getGenderLabel = (gender) => {
        if (gender === true) return "Nam";
        if (gender === false) return "Nữ";
        return "Không rõ";
    };

    const getRoleLabel = (roleId) => {
        switch (roleId) {
            case 1: return "Quản trị viên";
            case 2: return "Nhân viên";
            default: return "Người dùng";
        }
    };

    if (error) {
        return <Typography align="center" mt={4} color="error">{error}</Typography>;
    }

    if (!user) {
        return <Typography align="center" mt={4}>Đang tải thông tin người dùng...</Typography>;
    }

    return (
        <Box maxWidth={800} mx="auto" mt={5}>
            <Card elevation={5}>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <Avatar sx={{ width: 100, height: 100, mb: 1 }}>
                            {user.fullName?.charAt(0).toUpperCase() || "?"}
                        </Avatar>
                        <Typography variant="h5">{user.fullName}</Typography>
                        <Typography color="text.secondary">{getRoleLabel(user.roleId)}</Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="h6" gutterBottom>🔎 Thông tin cá nhân</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Tài khoản:</strong> {username}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Email:</strong> {user.email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Số điện thoại:</strong> {user.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Giới tính:</strong> {getGenderLabel(user.gender)}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Ngày sinh:</strong> {user.birthDate ? formatDate(user.birthDate) : 'Chưa cập nhật'}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Địa chỉ:</strong> {user.address || 'Chưa cập nhật'}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Typography variant="h6" gutterBottom>⚙️ Trạng thái & hệ thống</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography><strong>Vai trò hệ thống:</strong> {getRoleLabel(user.roleId)}</Typography>
                        <Typography><strong>Trạng thái:</strong> Hoạt động</Typography>
                        <Typography><strong>Lần truy cập gần nhất:</strong> Đang cập nhật</Typography>
                    </Paper>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProfilePage;
