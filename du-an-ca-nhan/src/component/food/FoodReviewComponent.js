// Full component with filter + sort (date/star) and improved UI layout
import React, { useEffect, useState } from "react";
import {
    Box, Typography, TextField, Button, Rating, Stack, Divider,
    IconButton, Pagination, MenuItem, Select, FormControl, InputLabel,
    Paper, Avatar, Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { createReview, getReviewsByFoodId, deleteReview } from "../../services/foodReviewService";

const cloudName = "drszapjl6";
const uploadPreset = "test_cloundinary";

const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
    });
    if (!response.ok) throw new Error("Image upload failed");
    const data = await response.json();
    return data.secure_url;
};

const FoodReviewComponent = ({ foodId }) => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [filterStar, setFilterStar] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const itemsPerPage = 3;

    const username = localStorage.getItem("username");
    const userId = parseInt(localStorage.getItem("userId"));
    const role = localStorage.getItem("role");
    const isLoggedIn = !isNaN(userId);

    useEffect(() => {
        fetchReviews();
    }, [foodId]);

    useEffect(() => {
        handleFilterChange(filterStar);
    }, [reviews, filterStar, sortOption]);

    const fetchReviews = async () => {
        try {
            const data = await getReviewsByFoodId(foodId);
            setReviews(data);
        } catch (error) {
            toast.error("Không thể tải đánh giá.");
        }
    };

    const sortReviews = (arr, option) => {
        switch (option) {
            case "newest": return [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case "oldest": return [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case "highest": return [...arr].sort((a, b) => b.rating - a.rating);
            case "lowest": return [...arr].sort((a, b) => a.rating - b.rating);
            default: return arr;
        }
    };

    const handleFilterChange = (star) => {
        setFilterStar(star);
        let temp = star === "all" ? reviews : reviews.filter(r => r.rating === star);
        temp = sortReviews(temp, sortOption);
        setFilteredReviews(temp);
        setPage(1);
    };

    const handleSubmit = async () => {
        if (!rating || rating < 1 || rating > 5) return toast.warning("Vui lòng chọn số sao từ 1 đến 5.");
        if (!comment.trim()) return toast.warning("Vui lòng nhập bình luận.");

        try {
            setLoading(true);
            let imageUrl = imagePreview;
            if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);

            const reviewData = {
                id: editing ? editingReviewId : undefined,
                rating, comment, imageUrl,
                food: { id: foodId },
                user: { id: userId }
            };

            await createReview(reviewData);
            toast.success(editing ? "Cập nhật đánh giá thành công!" : "Đánh giá đã được gửi!");
            setRating(0); setComment(""); setImageFile(null); setImagePreview("");
            setEditing(false); setEditingReviewId(null);
            fetchReviews();
        } catch {
            toast.error("Lỗi khi gửi đánh giá.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
        try {
            await deleteReview(id);
            toast.success("Đã xóa đánh giá.");
            fetchReviews();
        } catch {
            toast.error("Không thể xóa đánh giá.");
        }
    };

    const averageRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;
    const ratingStats = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));
    const paginated = filteredReviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" gutterBottom>⭐ Trung bình: {averageRating} / 5 ({reviews.length} đánh giá)</Typography>

            {isLoggedIn && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    <Stack spacing={2}>
                        <Rating value={rating} onChange={(e, val) => setRating(val)} precision={1} size="large" />
                        <TextField label="Bình luận" multiline rows={3} value={comment} onChange={e => setComment(e.target.value)} fullWidth />
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button variant="outlined" component="label">📷 Tải ảnh
                                <input type="file" accept="image/*" hidden onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }} />
                            </Button>
                            {imageFile && <Typography variant="body2">{imageFile.name}</Typography>}
                        </Stack>
                        {imagePreview && <Box><img src={imagePreview} alt="preview" style={{ width: 180, borderRadius: 10 }} /></Box>}
                        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth disabled={loading} sx={{ py: 1.5, fontWeight: 'bold' }}>
                            {editing ? "CẬP NHẬT ĐÁNH GIÁ" : "GỬI ĐÁNH GIÁ"}
                        </Button>
                    </Stack>
                </Paper>
            )}

            <Grid container spacing={2}>
                {paginated.length === 0 ? (
                    <Grid item xs={12}><Typography variant="body2">Không có đánh giá nào.</Typography></Grid>
                ) : (
                    paginated.map(r => (
                        <Grid item xs={12} key={r.id}>
                            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                                <Stack direction="row" spacing={2}>
                                    <Avatar>{r.user?.username?.[0]?.toUpperCase()}</Avatar>
                                    <Box flex={1}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography fontWeight="bold">{r.user?.username}</Typography>
                                            {(r.user?.id === userId || role === "admin") && (
                                                <Stack direction="row">
                                                    <IconButton onClick={() => {
                                                        setRating(r.rating);
                                                        setComment(r.comment);
                                                        setImagePreview(r.imageUrl || "");
                                                        setEditing(true);
                                                        setEditingReviewId(r.id);
                                                    }}><EditIcon color="primary" /></IconButton>
                                                    <IconButton onClick={() => handleDelete(r.id)}><DeleteIcon color="error" /></IconButton>
                                                </Stack>
                                            )}
                                        </Stack>
                                        <Rating value={r.rating} readOnly size="small" />
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>{r.comment}</Typography>
                                        {r.imageUrl && <Box sx={{ mt: 1 }}><img src={r.imageUrl} alt="review" style={{ width: 180, borderRadius: 10 }} /></Box>}
                                        <Typography variant="caption" color="text.secondary">{new Date(r.createdAt).toLocaleString()}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>

            <Stack alignItems="center" mt={2}>
                <Pagination count={Math.ceil(filteredReviews.length / itemsPerPage)} page={page} onChange={(e, val) => setPage(val)} color="primary" />
            </Stack>
        </Box>
    );
};

export default FoodReviewComponent;
