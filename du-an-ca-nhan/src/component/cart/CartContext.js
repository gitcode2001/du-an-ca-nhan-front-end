import React, { createContext, useEffect, useState } from "react";
import { getCartsByUserId } from "../../services/CartService";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const refreshCartCount = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const response = await getCartsByUserId(userId);
            const carts = Array.isArray(response)
                ? response
                : Array.isArray(response?.carts)
                    ? response.carts
                    : response?.data || [];

            const totalItems = carts.reduce((sum, cart) => sum + cart.quantity, 0);
            setCartCount(totalItems);
        } catch (error) {
            console.error("Lỗi khi cập nhật cartCount:", error);
        }
    };

    useEffect(() => {
        refreshCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, refreshCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
