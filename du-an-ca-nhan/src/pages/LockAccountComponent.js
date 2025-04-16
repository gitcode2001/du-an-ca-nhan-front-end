import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { lockAccount } from '../services/AccountService';

const LockAccountComponent = () => {
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState(null);

    const handleLock = async () => {
        const result = await lockAccount(userId);
        setMessage(result.message);
    };

    return (
        <Box p={3} maxWidth={400} mx="auto">
            <Typography variant="h5" mb={2}>Khóa tài khoản</Typography>
            <TextField label="ID người dùng" fullWidth margin="normal" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <Button variant="contained" color="error" fullWidth onClick={handleLock}>Khóa tài khoản</Button>
            {message && <Alert sx={{ mt: 2 }} severity="info">{message}</Alert>}
        </Box>
    );
};

export default LockAccountComponent;