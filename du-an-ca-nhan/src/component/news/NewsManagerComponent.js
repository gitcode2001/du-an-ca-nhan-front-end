import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, CardMedia, Grid,
    Button, Stack, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { getAllNews, createNews } from '../../services/NewsService';
import { uploadImageToCloudinary } from '../../services/CloudinaryService';

const NewsManagerComponent = () => {
    const [newsList, setNewsList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);

    const fetchNews = async () => {
        try {
            const data = await getAllNews();
            setNewsList(data);
        } catch (err) {
            console.error("Lỗi khi tải tin tức", err);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmit = async () => {
        try {
            const imageUrls = [];
            for (const img of images) {
                const url = await uploadImageToCloudinary(img);
                imageUrls.push(url);
            }

            const newsDto = {
                title,
                content,
                imageUrls
            };

            await createNews(newsDto);
            setTitle('');
            setContent('');
            setImages([]);
            setOpenDialog(false);
            fetchNews();
        } catch (err) {
            console.error("Upload thất bại", err);
            alert("Đăng tin thất bại!");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">📰 Quản lý tin tức</Typography>
                <Button variant="contained" onClick={() => setOpenDialog(true)}>Đăng tin</Button>
            </Stack>

            <Grid container spacing={2}>
                {newsList.map(news => (
                    <Grid item xs={12} sm={6} md={4} key={news.id}>
                        <Card>
                            {news.imageUrls?.length > 0 && (
                                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1, px: 1 }}>
                                    {news.imageUrls.map((url, index) => (
                                        <CardMedia
                                            key={index}
                                            component="img"
                                            image={url}
                                            alt={`image-${index}`}
                                            sx={{ height: 120, width: 150, objectFit: 'cover', borderRadius: 1 }}
                                        />
                                    ))}
                                </Stack>
                            )}
                            <CardContent>
                                <Typography variant="h6">{news.title}</Typography>
                                <Typography variant="body2">{news.content}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>📝 Đăng tin tức mới</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Tiêu đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nội dung"
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ marginTop: 16 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>Đăng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NewsManagerComponent;