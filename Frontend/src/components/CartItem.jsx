import { useCart } from "../contexts/CartContext";

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (newQuantity) => {
        updateQuantity(item.id, newQuantity);
    };

    const handleIncrement = () => {
        if (item.quantity < item.stock) {
            updateQuantity(item.id, item.quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        }
    };

    return (
        <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {/* Imagen del libro */}
            <div className="w-20 h-28 shrink-0">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
                />
            </div>

            {/* Información del libro */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.author}</p>
                    <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            onClick={handleDecrement}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            -
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-12 text-center">
                            {item.quantity}
                        </span>
                        <button
                            onClick={handleIncrement}
                            disabled={item.quantity >= item.stock}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            +
                        </button>
                    </div>

                    <span className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Botón eliminar */}
            <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
                aria-label="Eliminar del carrito"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
}
