import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function AddToCartButton({ book, initialQuantity = 1 }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(initialQuantity);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(book, quantity);
        setIsAdded(true);

        // Reset mensaje después de 2 segundos
        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    };

    return (
        <div>
            <button
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className="w-full bg-accent text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-950 transition-colors flex items-center justify-center gap-3 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Añadir al carrito
            </button>

            {isAdded && (
                <p className="text-green-600 text-sm mt-2 text-center font-medium">
                    ✓ Producto agregado al carrito
                </p>
            )}
        </div>
    );
}
