import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Input,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { createFood, updateFood } from '../../services/FoodService';
import { uploadImageToCloudinary } from '../../services/CloudinaryService';
import { getAllCategories } from '../../services/CategoryService';

const FoodFormDialog = ({ open, onClose, onSave, food }) => {
    const isEdit = Boolean(food);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        rating: '',
        status: 'AVAILABLE',
        imageUrl: '',
        category: null,
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategories();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEdit && food) {
            setFormData(food);
            setImageFile(null);
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                quantity: '',
                rating: '',
                status: 'AVAILABLE',
                imageUrl: '',
                category: null,
            });
            setImageFile(null);
        }
    }, [food, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const selectedId = e.target.value;
        const selectedCategory = categories.find(cat => cat.id === selectedId);
        setFormData(prev => ({ ...prev, category: selectedCategory }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!formData.category || !formData.category.id) {
                alert("Vui lòng chọn danh mục!");
                return;
            }
            let finalImageUrl = formData.imageUrl;
            if (imageFile) {
                finalImageUrl = await uploadImageToCloudinary(imageFile);
            }
            const dataToSubmit = {
                ...formData,
                imageUrl: finalImageUrl,
                category: {
                    id: formData.category.id,
                    name: formData.category.name,
                    description: formData.category.description,
                },
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                rating: Number(formData.rating),
            };
            console.log("👉 Data gửi backend:", dataToSubmit);
            if (isEdit) {
                await updateFood(food.id, dataToSubmit);
            } else {
                await createFood(dataToSubmit);
            }
            onSave();
            onClose();
        } catch (error) {
            alert("Lỗi khi lưu món ăn!");
            console.error("Chi tiết lỗi backend:", error.response?.data || error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEdit ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}</DialogTitle>
            <DialogContent>
                <TextField label="Tên món" name="name" value={formData.name} onChange={handleChange} fullWidth margin="dense" />
                <TextField label="Mô tả" name="description" value={formData.description} onChange={handleChange} fullWidth margin="dense" />
                <TextField label="Giá" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth margin="dense" />
                <TextField label="Số lượng" name="quantity" type="number" value={formData.quantity} onChange={handleChange} fullWidth margin="dense" />
                <TextField label="Đánh giá" name="rating" type="number" value={formData.rating} onChange={handleChange} fullWidth margin="dense" />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Trạng thái"
                    >
                        <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                        <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
                    </Select>
                </FormControl>


                <FormControl fullWidth margin="dense">
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                        value={formData.category?.id || ''}
                        onChange={handleCategoryChange}
                        label="Danh mục"
                        variant="outlined">
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Input type="file" onChange={handleImageChange} accept="image/*" fullWidth style={{ marginTop: 16 }} />
                {imageFile ? (
                    <Box mt={2}>
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt="preview"
                            style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                        />
                    </Box>
                ) : formData.imageUrl && (
                    <Box mt={2}>
                        <img
                            src={formData.imageUrl}
                            alt="current"
                            style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Huỷ</Button>
                <Button variant="contained" onClick={handleSubmit}>{isEdit ? "Cập nhật" : "Thêm"}</Button>
            </DialogActions>
        </Dialog>
    );
};
export default FoodFormDialog;
