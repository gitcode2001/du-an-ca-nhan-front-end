import React, { useEffect, useState } from "react";
import {
    Box, Card, CardContent, Typography, Grid, CircularProgress,
    Tabs, Tab, Divider, Stack, TextField, Button, Paper
} from "@mui/material";
import { getAllUsers } from "../../services/userService";
import { getAllOrders } from "../../services/orderService";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const AdminStatistics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        lockedUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        hourlyRevenue: [],
        dailyRevenue: [],
        monthlyRevenue: [],
        yearlyRevenue: []
    });
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(2);
    const [filter, setFilter] = useState({ from: '', to: '' });

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const usersRes = await getAllUsers("", 0, 1000);
            const ordersRes = await getAllOrders();

            const filteredOrders = ordersRes.filter(o => {
                const d = new Date(o.createdAt);
                const from = filter.from ? new Date(filter.from) : null;
                const to = filter.to ? new Date(filter.to) : null;
                return (!from || d >= from) && (!to || d <= to);
            });

            const totalUsers = usersRes.content.length;
            const lockedUsers = usersRes.content.filter(u => u.account?.locked).length;
            const activeUsers = totalUsers - lockedUsers;
            const totalOrders = filteredOrders.length;
            const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

            const groupBy = (formatFn) => {
                const map = {};
                filteredOrders.forEach(order => {
                    const date = new Date(order.createdAt);
                    const key = formatFn(date);
                    if (!map[key]) map[key] = { label: key, total: 0, count: 0 };
                    map[key].total += order.totalPrice || 0;
                    map[key].count++;
                });
                return Object.values(map).sort((a, b) => a.label.localeCompare(b.label));
            };

            setStats({
                totalUsers,
                activeUsers,
                lockedUsers,
                totalOrders,
                totalRevenue,
                hourlyRevenue: groupBy(d => `${d.getHours().toString().padStart(2, '0')}:00`),
                dailyRevenue: groupBy(d => d.toISOString().slice(0, 10)),
                monthlyRevenue: groupBy(d => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`),
                yearlyRevenue: groupBy(d => `${d.getFullYear()}`)
            });
            setLoading(false);
        };
        fetchStats();
    }, [filter]);

    if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;

    const revenueData = [
        stats.hourlyRevenue,
        stats.dailyRevenue,
        stats.monthlyRevenue,
        stats.yearlyRevenue
    ][tab];

    const metricCards = [
        { title: "Người dùng", value: stats.totalUsers, color: "#1e88e5" },
        { title: "Đang hoạt động", value: stats.activeUsers, color: "#43a047" },
        { title: "Đã bị khoá", value: stats.lockedUsers, color: "#e53935" },
        { title: "Tổng đơn hàng", value: stats.totalOrders, color: "#00acc1" }
    ];

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                📊 Thống kê hệ thống
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                {metricCards.map((card, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Paper elevation={2} sx={{ p: 2, borderLeft: `6px solid ${card.color}`, borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">{card.title}</Typography>
                            <Typography variant="h6" fontWeight="bold" color={card.color}>{card.value}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                        💰 Doanh thu: {stats.totalRevenue.toLocaleString('vi-VN')} VNĐ
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Từ ngày"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            value={filter.from}
                            onChange={(e) => setFilter({ ...filter, from: e.target.value })}
                        />
                        <TextField
                            label="Đến ngày"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            value={filter.to}
                            onChange={(e) => setFilter({ ...filter, to: e.target.value })}
                        />
                        <Button variant="outlined" onClick={() => setFilter({ from: '', to: '' })}>Đặt lại</Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Tabs
                    value={tab}
                    onChange={(e, newVal) => setTab(newVal)}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                >
                    <Tab label="Theo giờ" />
                    <Tab label="Theo ngày" />
                    <Tab label="Theo tháng" />
                    <Tab label="Theo năm" />
                </Tabs>

                <Box mt={3} sx={{ overflowX: 'auto' }}>
                    <ResponsiveContainer width="100%" height={420}>
                        <BarChart data={revenueData} barCategoryGap={20} barGap={6}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" angle={-20} textAnchor="end" height={60} />
                            <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(1)}tr`} />
                            <Tooltip
                                formatter={(value, name) => name === "Số đơn hàng" ? `${value} đơn` : `${value.toLocaleString('vi-VN')} VNĐ`}
                                labelFormatter={(label) => `Thời điểm: ${label}`}
                            />
                            <Legend wrapperStyle={{ fontSize: 13 }} />
                            <Bar dataKey="total" name="Tổng doanh thu" fill="#1976d2" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="count" name="Số đơn hàng" fill="#f57c00" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminStatistics;
