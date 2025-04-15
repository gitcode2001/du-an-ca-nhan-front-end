import React, { useEffect, useState } from 'react';
import {
    getAllUsers,
    updateUser,
    deleteUser,
    disableUser,
    enableUser
} from '../service/UserService';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField
} from '@mui/material';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({ name: '', email: '' });

    const loadUsers = async () => {
        const data = await getAllUsers();
        setUsers(data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user.id);
        setForm({ name: user.name, email: user.email });
    };

    const handleUpdate = async () => {
        await updateUser(editingUser, form);
        setEditingUser(null);
        setForm({ name: '', email: '' });
        loadUsers();
    };

    const handleDelete = async (id) => {
        await deleteUser(id);
        loadUsers();
    };

    const handleDisable = async (id) => {
        await disableUser(id);
        loadUsers();
    };

    const handleEnable = async (id) => {
        await enableUser(id);
        loadUsers();
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Quản lý người dùng</Typography>
            {editingUser && (
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Tên"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        sx={{ mr: 2 }}
                    />
                    <Button variant="contained" onClick={handleUpdate}>Cập nhật</Button>
                    <Button variant="text" onClick={() => setEditingUser(null)} sx={{ ml: 1 }}>Hủy</Button>
                </Box>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button size="small" onClick={() => handleEdit(user)}>Sửa</Button>
                                    <Button size="small" onClick={() => handleDelete(user.id)}>Xóa</Button>
                                    <Button size="small" onClick={() => handleDisable(user.id)}>Khóa</Button>
                                    <Button size="small" onClick={() => handleEnable(user.id)}>Mở</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default UserManagement;
