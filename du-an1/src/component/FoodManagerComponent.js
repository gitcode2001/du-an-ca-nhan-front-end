import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CardMedia,
    DialogContentText
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import {
    getAllFoods,
    createFood,
    updateFood,
    deleteFood
} from '../service/FoodService';
import { getAllCategories } from '../service/CategoryService';
import { uploadImageAndGetUrl } from '../service/CloudinaryService';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const FoodManager = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [editingFood, setEditingFood] = useState(null);
    const [viewFood, setViewFood] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        category: ''
    });
    const [imageFiles, setImageFiles] = useState([]);

    const loadFoods = async () => {
        const data = await getAllFoods();
        setFoods(data);
    };

    const loadCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
    };

    useEffect(() => {
        loadFoods();
        loadCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImageFiles([...e.target.files]);
    };

    const handleSubmit = async () => {
        let images = formData.images;
        if (imageFiles.length > 0) {
            const uploads = await Promise.all(
                imageFiles.map(file => uploadImageAndGetUrl(file, { width: 500, crop: 'fill' }))
            );
            images = uploads.map(url => ({ img: url }));
        }

        const foodToSave = {
            ...formData,
            images,
            category: categories.find((c) => c.id === parseInt(formData.category))
        };

        if (editingFood) {
            await updateFood(editingFood.id, foodToSave);
        } else {
            await createFood(foodToSave);
        }

        setOpen(false);
        setEditingFood(null);
        setImageFiles([]);
        setFormData({ name: '', description: '', price: '', stock: '', images: [], category: '' });
        loadFoods();
    };

    const handleEdit = (food) => {
        setEditingFood(food);
        setFormData({
            name: food.name,
            description: food.description,
            price: food.price,
            stock: food.stock,
            images: food.images || [],
            category: food.category?.id || ''
        });
        setImageFiles([]);
        setOpen(true);
    };

    const handleDelete = async () => {
        await deleteFood(confirmDelete.id);
        setConfirmDelete(null);
        loadFoods();
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                🍽️ Food Management
            </Typography>

            <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 3 }}>
                + Add Food
            </Button>

            <Grid container spacing={3}>
                {foods.map((food) => (
                    <Grid item xs={12} md={4} key={food.id}>
                        <Card>
                            {food.images && food.images.length > 0 && (
                                <CardMedia
                                    component="img"
                                    sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                                    image={food.images[0].img}
                                    alt={food.name}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{food.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {food.description}
                                </Typography>
                                <Typography>💲{formatCurrency(food.price)}</Typography>
                                <Typography>📦 In stock: {food.stock}</Typography>
                                <Typography>📁 Category: {food.category?.name}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => setViewFood(food)}>View</Button>
                                <Button size="small" onClick={() => handleEdit(food)}>Edit</Button>
                                <Button size="small" color="error" onClick={() => setConfirmDelete(food)}>Delete</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={!!viewFood} onClose={() => setViewFood(null)} maxWidth="md" fullWidth>
                <DialogTitle>{viewFood?.name}</DialogTitle>
                <DialogContent>
                    {viewFood?.images?.length > 0 && (
                        <Carousel navButtonsAlwaysVisible autoPlay={false} sx={{ mb: 2 }}>
                            {viewFood.images.map((img, index) => (
                                <CardMedia
                                    key={index}
                                    component="img"
                                    sx={{ width: '100%', height: 300, objectFit: 'cover' }}
                                    image={img.img}
                                    alt={`img-${index}`}
                                />
                            ))}
                        </Carousel>
                    )}
                    <Typography variant="subtitle1" gutterBottom>{viewFood?.description}</Typography>
                    <Typography>💲{formatCurrency(viewFood?.price)}</Typography>
                    <Typography>📦 In stock: {viewFood?.stock}</Typography>
                    <Typography>📁 Category: {viewFood?.category?.name}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewFood(null)}>Close</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default FoodManager;
