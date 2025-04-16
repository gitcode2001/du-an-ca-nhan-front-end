import React from "react";
import { Box, Typography, IconButton, Container, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#2e3b2e",
                color: "white",
                py: 5,
                mt: "auto",
                fontFamily: "Arial, sans-serif"
            }}
        >
            <Container>
                <Grid container spacing={4}>
                    {/* Thông tin công ty - căn giữa */}
                    <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>THÔNG TIN CÔNG TY</Typography>
                        <Typography variant="body2">Công ty TNHH Thực Phẩm XYZ</Typography>
                        <Typography variant="body2">Địa chỉ: 295 Nguyễn Tất Thành, Thanh Bình, Hải Châu, Đà Nẵng</Typography>
                        <Typography variant="body2">Điện thoại: 0935.558.143</Typography>
                        <Typography variant="body2">Email: admin@xyz.com</Typography>
                    </Grid>

                    {/* Chính sách - giữ bên phải */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>CHÍNH SÁCH CHUNG</Typography>
                        {[
                            "Mua hàng và thanh toán",
                            "Chính sách vận chuyển",
                            "Chính sách đổi trả hàng",
                            "Chính sách bảo mật",
                            "Quy chế hoạt động",
                            "Giới thiệu công ty",
                            "Liên hệ"
                        ].map((item, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { textDecoration: "underline", color: "#38A169" },
                                    mb: 1
                                }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Grid>

                    {/* Bản đồ - căn giữa */}
                    <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>BẢN ĐỒ ĐƯỜNG ĐI</Typography>
                        <Box sx={{ width: "100%", height: "250px", borderRadius: "10px", overflow: "hidden" }}>
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.983152783551!2d108.21502507461045!3d16.066408684630378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c9b1ebefb3%3A0xa81e8b7f0b15d254!2s295%20Nguy%E1%BB%85n%20T%E1%BA%ADt%20Th%C3%A0nh%2C%20Thanh%20B%C3%ACnh%2C%20H%E1%BA%A3i%20Ch%C3%A2u%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng%20550000%2C%20Vietnam!5e0!3m2!1sen!2s!4v1710791234567!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </Box>
                    </Grid>
                </Grid>

                {/* Kết nối mạng xã hội */}
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>KẾT NỐI VỚI CHÚNG TÔI</Typography>
                    <IconButton color="inherit" sx={{ mx: 1 }}>
                        <FacebookIcon fontSize="large" />
                    </IconButton>
                    <IconButton color="inherit" sx={{ mx: 1 }}>
                        <InstagramIcon fontSize="large" />
                    </IconButton>
                    <IconButton color="inherit" sx={{ mx: 1 }}>
                        <YouTubeIcon fontSize="large" />
                    </IconButton>
                </Box>

                {/* Copyright */}
                <Typography variant="body2" sx={{ textAlign: "center", mt: 3 }}>
                    © 2025 XYZ Food. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
