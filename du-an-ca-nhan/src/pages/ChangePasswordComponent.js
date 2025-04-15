import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, Snackbar, Alert, Paper
} from '@mui/material';
import { changePassword } from '../services/accountService';

const ChangePasswordComponent = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setSnackbar({ open: true, message: 'Mật khẩu mới không khớp', severity: 'error' });
            return;
        }

        const result = await changePassword(oldPassword, newPassword);
        setSnackbar({ open: true, message: result.message, severity: result.success ? 'success' : 'error' });
        if (result.success) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>🔒 Đổi mật khẩu</Typography>
                <TextField
                    label="Mật khẩu hiện tại"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <TextField
                    label="Mật khẩu mới"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    fullWidth
                    sx={{ mb: 3 }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                    Đổi mật khẩu
                </Button>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChangePasswordComponent;
