import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../services/CategoryService';

const CategoryManagerComponent = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenDialog = (category = { name: '', description: '' }, editing = false) => {
        setCurrentCategory(category);
        setIsEditing(editing);
        setEditingId(editing ? category.id : null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCategory({ name: '', description: '' });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateCategory(editingId, currentCategory);
            } else {
                await createCategory(currentCategory);
            }
            fetchCategories();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xoá danh mục này?')) {
            await deleteCategory(id);
            fetchCategories();
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>Quản lý danh mục</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>Thêm danh mục</Button>

            <Grid container spacing={2} mt={2}>
                {categories.map((category) => (
                    <Grid item xs={12} md={6} lg={4} key={category.id}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="h6">{category.name}</Typography>
                            <Box display="flex" justifyContent="flex-end" gap={1}>
                                <IconButton color="primary" onClick={() => handleOpenDialog(category, true)}><Edit /></IconButton>
                                <IconButton color="error" onClick={() => handleDelete(category.id)}><Delete /></IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Tên danh mục"
                        fullWidth
                        value={currentCategory.name}
                        onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Huỷ</Button>
                    <Button onClick={handleSave} variant="contained">Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CategoryManagerComponent;
