import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper
} from '@mui/material';
import { registerUser } from '../service/UserService';
import { useNavigate } from 'react-router-dom';

const SignUpComponent = () => {
    const [userData, setUserData] = useState({
        username: '',
        fullName: '',
        email: '',
        address: '',
        phone: '',
        role: 'CUSTOMER', // mặc định là CUSTOMER
    });
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(userData, password);
            navigate('/'); // Chuyển về login sau khi đăng ký thành công
        } catch (error) {
            setErrorMsg(error.response?.data || 'Register failed!');
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={6}
                sx={{
                    background: 'linear-gradient(to right, #283c86, #45a247)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                }}
            >
                <Typography variant="h3" fontWeight="bold">
                    Join Us
                </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 6,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField name="username" label="Username" fullWidth margin="normal" required onChange={handleChange} />
                        <TextField name="fullName" label="Full Name" fullWidth margin="normal" required onChange={handleChange} />
                        <TextField name="email" label="Email" fullWidth margin="normal" required onChange={handleChange} />
                        <TextField name="address" label="Address" fullWidth margin="normal" required onChange={handleChange} />
                        <TextField name="phone" label="Phone" fullWidth margin="normal" required onChange={handleChange} />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {errorMsg && (
                            <Typography color="error" variant="body2" align="center">
                                {errorMsg}
                            </Typography>
                        )}

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Register
                        </Button>
                        <Typography variant="body2" align="center">
                            Already have an account? <a href="/">Sign In</a>
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default SignUpComponent;
