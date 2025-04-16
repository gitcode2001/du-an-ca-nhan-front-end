import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from "./pages/LoginPage";
import SignupComponent from "./pages/SignupComponent";
import ForgotPasswordFlowComponent from "./pages/ForgotPasswordFlowComponent";
import ChangePasswordComponent from "./pages/ChangePasswordComponent";
import Home from "./home/Home";
import FoodManagerComponent from "./component/food/FoodManagerComponent";
import FoodFormDialog from "./component/food/FoodFormDialog";
import CategoryManagerComponent from "./component/food/CategoryManagerComponent";
import CartManagerComponent from "./component/cart/CartManagerComponent";
import UserListComponent from "./component/admin/UserListComponent";
import OrderDetailList from "./component/detail/OrderDetailList";
import OrderStatusManager from "./component/detail/OrderStatusManager";
import OrderList from "./component/detail/OrderList";
import OrderForm from "./component/detail/OrderForm";
import FoodReviewComponent from "./component/food/FoodReviewComponent";
import PayPalPaymentComponent from "./component/paypal/PayPalPaymentComponent";
import PaymentSuccess from "./component/paypal/PaymentSuccess";
import OrderHistoryComponent from "./component/detail/OrderHistoryComponent";
import PaymentCancel from "./component/paypal/PaymentCancel";
import ProfilePage from "./pages/ProfilePage";
import AdminStatistics from "./component/admin/AdminStatistics";
import CartProvider from "./component/cart/CartContext";
import NewsManagerComponent from "./component/news/NewsManagerComponent";


function App() {
    const userId = parseInt(localStorage.getItem("userId"));

    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupComponent />} />
                    <Route path="/forgot-password" element={<ForgotPasswordFlowComponent />} />
                    <Route path="/change-password" element={<ChangePasswordComponent />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/foods" element={<FoodManagerComponent />} />
                    <Route path="/foods/add" element={<FoodFormDialog />} />
                    <Route path="/categories" element={<CategoryManagerComponent />} />
                    <Route path="/cart" element={<CartManagerComponent />} />
                    <Route path="/admin/users" element={<UserListComponent />} />
                    <Route path="/order-detail" element={<OrderDetailList />} />
                    <Route path="/order-status" element={<OrderStatusManager />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders-from" element={<OrderForm />} />
                    <Route path="/foods-review" element={<FoodReviewComponent />} />
                    <Route path="/paypal" element={<PayPalPaymentComponent />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/order-history" element={<OrderHistoryComponent userId={userId} />} />
                    <Route path="/payment-cancel" element={<PaymentCancel />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin/statistics" element={<AdminStatistics />} />
                    <Route path="/admin/news" element={<NewsManagerComponent/>}/>
                </Routes>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    pauseOnHover={false}
                    draggable
                    theme="light"
                />
            </Router>
        </CartProvider>
    );
}

export default App;
