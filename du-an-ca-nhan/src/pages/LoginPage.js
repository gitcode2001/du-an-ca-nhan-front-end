import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper
} from '@mui/material';
import { login } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import { connectWebSocketUser } from '../services/WebSocketSvice';
import { toast } from 'react-toastify';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!username.trim() || !password.trim()) {
            setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        try {
            const result = await login(username, password);

            if (result.success) {
                const { token, username: name, role, userId } = result;

                if (!token || !name || !role || !userId) {
                    toast.error("Thông tin phản hồi không đầy đủ từ server!");
                    return;
                }

                // ✅ Lưu thông tin vào localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('username', name);
                localStorage.setItem('role', role);
                localStorage.setItem('userId', userId.toString());

                toast.success('🎉 Đăng nhập thành công!');
                console.log("✅ Đăng nhập:", { username: name, role, userId });

                // ✅ WebSocket
                connectWebSocketUser((msg) => {
                    console.log("📩 WebSocket:", msg);
                });

                // ✅ Điều hướng
                switch (role.toUpperCase()) {
                    case 'ADMIN':
                        navigate('/home' );
                        break;
                    case 'USERS':
                        navigate('/home');
                        break;
                    default:
                        navigate('/home');
                        break;
                }
            } else {
                toast.error(result.message || 'Đăng nhập thất bại!');
                setErrorMsg(result.message || "Thông tin đăng nhập không chính xác.");
            }
        } catch (error) {
            console.error("🚨 Lỗi đăng nhập:", error);
            toast.error("Đăng nhập thất bại!");
            setErrorMsg("Vui lòng kiểm tra lại thông tin đăng nhập.");
        }
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} md={6} sx={{
                background: 'linear-gradient(to right, #4e054c, #df5f79)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{
                    mb: 2, width: 120, height: 120,
                    borderRadius: '50%', backgroundColor: '#ff6b81'
                }} />
                <Typography variant="h4" fontWeight="bold" letterSpacing={3}>
                    MARTIANI
                </Typography>
            </Grid>

            {/* Bên phải - Form */}
            <Grid item xs={12} md={6} component={Paper} elevation={6} square>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5">Đăng nhập</Typography>
                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal" required fullWidth label="Tên người dùng"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                        <TextField
                            margin="normal" required fullWidth label="Mật khẩu" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />

                        {errorMsg && (
                            <Typography color="error" variant="body2" align="center">
                                {errorMsg}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <Button type="submit" fullWidth variant="contained">Đăng nhập</Button>
                            <Button fullWidth variant="outlined" onClick={() => navigate('/signup')}>Đăng ký</Button>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{ mt: 2, textAlign: 'center', color: 'primary.main', cursor: 'pointer' }}
                            onClick={() => navigate('/forgot-password')}
                        >
                            Quên mật khẩu?
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default LoginComponent;
