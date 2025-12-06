import { useState } from "react";

export default function QuantitySelector({ max = 99, onChange = () => { }, value, onValueChange }) {
    const [internalQuantity, setInternalQuantity] = useState(value || 1);

    // Si hay un valor controlado desde afuera, usarlo
    const quantity = value !== undefined ? value : internalQuantity;
    const setQuantity = onValueChange || setInternalQuantity;

    const handleIncrement = () => {
        if (quantity < max) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            onChange(newQuantity);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onChange(newQuantity);
        }
    };

    const handleChange = (e) => {
        const val = parseInt(e.target.value) || 1;
        const newQuantity = Math.min(Math.max(val, 1), max);
        setQuantity(newQuantity);
        onChange(newQuantity);
    };

    return (
        <div className="flex items-center gap-4 mb-5 md:mb-0">
            <span className="text-sm text-gray-700 font-medium">Cantidad:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
                <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrementar cantidad"
                >
                    -
                </button>
                <input
                    type="number"
                    value={quantity}
                    onChange={handleChange}
                    min="1"
                    max={max}
                    className="w-16 text-center py-2 border-x border-gray-300 focus:outline-none"
                />
                <button
                    onClick={handleIncrement}
                    disabled={quantity >= max}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Incrementar cantidad"
                >
                    +
                </button>
            </div>
        </div>
    );
}
