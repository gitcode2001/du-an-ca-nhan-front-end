import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
    MenuItem
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUser } from '../services/userService';

const SignupComponent = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        address: '',
        gender: 'true',
        phoneNumber: '',
        birthDate: '',
        roleId: '2' // ✅ Mặc định là User
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{9,15}$/;

        if (!formData.username.trim()) newErrors.username = 'Tên người dùng không được để trống';
        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';
        if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
        if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được để trống';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Số điện thoại không được để trống';
        else if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
        if (!formData.birthDate) newErrors.birthDate = 'Ngày sinh không được để trống';
        if (!formData.gender) newErrors.gender = 'Giới tính không được để trống';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.warning("⚠️ Vui lòng kiểm tra các trường thông tin!");
            return;
        }

        try {
            const result = await createUser({
                userName: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                address: formData.address,
                gender: formData.gender === 'true',
                phoneNumber: formData.phoneNumber,
                birthDate: formData.birthDate,
                roleId: Number(formData.roleId)
            });

            if (result && result.id) {
                toast.success("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
                navigate('/login');
            } else {
                toast.error(result?.message || 'Đăng ký thất bại!');
            }
        } catch (error) {
            console.error("🚨 Lỗi đăng ký:", error);
            toast.error("🚫 Đăng ký thất bại! Vui lòng thử lại sau.");
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
                    mb: 2,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: '#ff6b81'
                }} />
                <Typography variant="h4" fontWeight="bold" letterSpacing={3}>
                    MARTIANI
                </Typography>
            </Grid>

            <Grid item xs={12} md={6} component={Paper} elevation={6} square>
                <Box sx={{ my: 6, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5">Đăng ký</Typography>
                    <Box component="form" onSubmit={handleSignup} sx={{ mt: 1, width: '100%' }}>
                        <TextField fullWidth required margin="normal" label="Tên người dùng" name="username"
                                   value={formData.username} onChange={handleChange}
                                   error={!!errors.username} helperText={errors.username}
                        />
                        <TextField fullWidth required margin="normal" label="Email" name="email" type="email"
                                   value={formData.email} onChange={handleChange}
                                   error={!!errors.email} helperText={errors.email}
                        />
                        <TextField fullWidth required margin="normal" label="Mật khẩu" name="password" type="password"
                                   value={formData.password} onChange={handleChange}
                                   error={!!errors.password} helperText={errors.password}
                        />
                        <TextField fullWidth required margin="normal" label="Xác nhận mật khẩu" name="confirmPassword" type="password"
                                   value={formData.confirmPassword} onChange={handleChange}
                                   error={!!errors.confirmPassword} helperText={errors.confirmPassword}
                        />
                        <TextField fullWidth required margin="normal" label="Họ tên" name="fullName"
                                   value={formData.fullName} onChange={handleChange}
                                   error={!!errors.fullName} helperText={errors.fullName}
                        />
                        <TextField fullWidth required margin="normal" label="Địa chỉ" name="address"
                                   value={formData.address} onChange={handleChange}
                                   error={!!errors.address} helperText={errors.address}
                        />
                        <TextField fullWidth required margin="normal" label="Số điện thoại" name="phoneNumber"
                                   value={formData.phoneNumber} onChange={handleChange}
                                   error={!!errors.phoneNumber} helperText={errors.phoneNumber}
                        />
                        <TextField fullWidth required margin="normal" label="Ngày sinh" name="birthDate" type="date"
                                   InputLabelProps={{ shrink: true }}
                                   value={formData.birthDate} onChange={handleChange}
                                   error={!!errors.birthDate} helperText={errors.birthDate}
                        />
                        <TextField fullWidth required margin="normal" label="Giới tính" name="gender" select
                                   value={formData.gender} onChange={handleChange}
                                   error={!!errors.gender} helperText={errors.gender}
                        >
                            <MenuItem value="true">Nam</MenuItem>
                            <MenuItem value="false">Nữ</MenuItem>
                        </TextField>

                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                            Đăng ký
                        </Button>

                        <Typography variant="body2" align="center">
                            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default SignupComponent;
