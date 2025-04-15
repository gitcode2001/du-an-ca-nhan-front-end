import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Rating, IconButton, Stack, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ReviewList = ({ foodId }) => {
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // Get user from localStorage
    const token = localStorage.getItem('token'); // Get token from localStorage

    // Fetching reviews from the server
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reviews/food/${foodId}`);
            setReviews(response.data.reviews); // Store reviews in the state
        } catch (err) {
            console.error('Lỗi khi tải đánh giá:', err);
        }
    };

    // Handle delete review
    const handleDelete = async (reviewId) => {
        if (!token) {
            console.log("Chưa đăng nhập");
            return;
        }

        try {
            console.log("Xóa bài đánh giá với ID: ", reviewId);
            const response = await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            });
            console.log("Kết quả xóa:", response.data);
            fetchReviews(); // Reload reviews after deletion
        } catch (err) {
            console.error('Lỗi khi xoá đánh giá:', err.response ? err.response.data : err);
            alert("Không thể xóa bài đánh giá");
        }
    };

    useEffect(() => {
        fetchReviews(); // Fetch reviews whenever foodId changes
    }, [foodId]);

    return (
        <Box>
            <Typography variant="subtitle1" fontWeight="bold">📃 Các đánh giá gần đây</Typography>
            {reviews.length === 0 ? (
                <Typography>Chưa có đánh giá nào.</Typography>
            ) : (
                reviews.map((rev) => (
                    <Box key={rev.id} sx={{ borderBottom: '1px solid #ddd', py: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar>{rev.user?.name?.charAt(0)}</Avatar>
                            <Box flex={1}>
                                <Typography fontWeight="bold">{rev.user?.name}</Typography>
                                <Rating value={rev.rating} readOnly size="small" />
                                <Typography>{rev.comment}</Typography>

                                {/* Hiển thị ảnh đầu tiên nếu có */}
                                {rev.images && rev.images.length > 0 && (
                                    <CardMedia
                                        component="img"
                                        src={`http://localhost:8080/images/${rev.images[0].img}`}  // Đảm bảo đường dẫn là chính xác
                                        alt="Review Image"
                                        sx={{ width: '100px', height: '100px', objectFit: 'cover', mt: 1 }}
                                    />
                                )}
                            </Box>

                            {user?.id === rev.user?.id && (
                                <IconButton onClick={() => handleDelete(rev.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Stack>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default ReviewList;
