import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    Paper,
    Divider
} from '@mui/material';
import { changePassword } from '../services/accountService';

const ChangePasswordComponent = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setSnackbar({ open: true, message: '❌ Mật khẩu mới không khớp.', severity: 'error' });
            return;
        }

        const result = await changePassword(oldPassword, newPassword);
        setSnackbar({
            open: true,
            message: result.message || 'Có lỗi xảy ra.',
            severity: result.success ? 'success' : 'error'
        });

        if (result.success) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    🔐 Thay đổi mật khẩu
                </Typography>

                <Divider sx={{ my: 2 }} />

                <TextField
                    label="🔒 Mật khẩu hiện tại"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <TextField
                    label="🆕 Mật khẩu mới"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <TextField
                    label="✅ Xác nhận mật khẩu mới"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 4 }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                >
                    Cập nhật mật khẩu
                </Button>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChangePasswordComponent;
