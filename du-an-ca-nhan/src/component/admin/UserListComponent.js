import React, { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
    TableBody, TablePagination, IconButton, TextField, Stack, Tooltip,
    Chip, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, Dialog,
    DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import { Edit, Delete, Lock, LockOpen, FileDownload } from "@mui/icons-material";
import { deleteUser, getAllUsers, updateUser } from "../../services/userService";
import { lockAccount } from "../../services/accountService";

const UserListComponent = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [statusFilter, setStatusFilter] = useState("all");
    const [editUser, setEditUser] = useState(null);

    const fetchUsers = async () => {
        const data = await getAllUsers(search, 0, 100);
        setUsers(data.content);
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) {
            await deleteUser(id);
            fetchUsers();
            setSnackbar({ open: true, message: 'Đã xoá người dùng thành công', severity: 'success' });
        }
    };

    const handleLock = async (accountId) => {
        const response = await lockAccount(accountId);
        if (response.success) {
            setSnackbar({ open: true, message: response.message, severity: 'success' });
        } else {
            setSnackbar({ open: true, message: response.message, severity: 'error' });
        }
        fetchUsers();
    };

    const handleEditSubmit = async () => {
        await updateUser(editUser.id, editUser);
        setEditUser(null);
        fetchUsers();
        setSnackbar({ open: true, message: 'Cập nhật thông tin thành công', severity: 'success' });
    };

    const handleExportCSV = () => {
        const csv = ["Username,Email,Role,Status"];
        users.forEach(user => {
            if (!user.account || user.isDeleted) return;
            csv.push(`${user.account.userName},${user.email},${user.account.role.nameRoles},${user.account.locked ? "Locked" : "Active"}`);
        });
        const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredUsers = users.filter(user => {
        if (!user.account || user.isDeleted) return false;
        if (statusFilter === "all") return true;
        if (statusFilter === "locked") return user.account.locked;
        if (statusFilter === "active") return !user.account.locked;
        return true;
    });

    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    📋 Danh sách người dùng
                </Typography>
                <Button startIcon={<FileDownload />} variant="outlined" onClick={handleExportCSV}>
                    Xuất CSV
                </Button>
            </Stack>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        label="Tìm kiếm theo tên người dùng"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FormControl sx={{ minWidth: 160 }}>
                        <InputLabel>Lọc trạng thái</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Lọc trạng thái"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="active">Hoạt động</MenuItem>
                            <MenuItem value="locked">Đã khoá</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map((user, index) => (
                            <TableRow
                                key={user.id}
                                sx={{ opacity: user.account.locked ? 0.4 : 1 }}
                            >
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{user.account.userName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.account.role.nameRoles === "admin" ? "Admin" : "User"}
                                        color={user.account.role.nameRoles === "admin" ? "error" : "info"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.account.locked ? "Đã khoá" : "Hoạt động"}
                                        color={user.account.locked ? "default" : "success"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title={user.account.locked ? "Mở khoá tài khoản" : "Khoá tài khoản"}>
                                            <IconButton
                                                onClick={() => handleLock(user.id)}
                                                color="warning"
                                            >
                                                {user.account.locked ? <LockOpen /> : <Lock />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Chỉnh sửa">
                                            <IconButton
                                                onClick={() => setEditUser(user)}
                                                color="primary"
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xoá">
                                            <IconButton
                                                onClick={() => handleDelete(user.id)}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                <TablePagination
                    component="div"
                    count={filteredUsers.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>

            {editUser && (
                <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Họ tên"
                            fullWidth
                            value={editUser.fullName || ""}
                            onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={editUser.email || ""}
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditUser(null)} color="secondary">Hủy</Button>
                        <Button onClick={handleEditSubmit} variant="contained" color="primary">Lưu</Button>
                    </DialogActions>
                </Dialog>
            )}

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

export default UserListComponent;
