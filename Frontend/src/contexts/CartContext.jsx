import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error("Error loading cart:", error);
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Agregar item al carrito
    const addToCart = (book, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === book.id);

            if (existingItem) {
                // Si ya existe, actualizar cantidad
                return prevItems.map(item =>
                    item.id === book.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Si no existe, agregar nuevo
                return [...prevItems, { ...book, quantity }];
            }
        });
    };

    // Eliminar item del carrito
    const removeFromCart = (bookId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
    };

    // Actualizar cantidad de un item
    const updateQuantity = (bookId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(bookId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === bookId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        }
    };

    // Limpiar todo el carrito
    const clearCart = () => {
        setCartItems([]);
    };

    // Calcular total de items
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Calcular subtotal
    const getSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Calcular envío (gratis si es mayor a $50, sino $5)
    const getShipping = () => {
        const subtotal = getSubtotal();
        return subtotal > 50 ? 0 : 5;
    };

    // Calcular total
    const getTotal = () => {
        return getSubtotal() + getShipping();
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        getShipping,
        getTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
