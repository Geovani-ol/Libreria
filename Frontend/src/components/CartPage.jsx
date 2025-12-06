import { useCart } from "../contexts/CartContext";
import CartItem from "./CartItem";

export default function CartPage() {
    const { cartItems, getSubtotal, getShipping, getTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-xl text-gray-600 mb-4">Tu carrito está vacío</p>
                <a href="/" className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-950 transition-colors">
                    Continuar Comprando
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listado de items */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                    <h2 className="text-xl font-semibold">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} en tu Carrito
                    </h2>
                </div>

                <div className="space-y-4">
                    {cartItems.map(item => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                    <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-gray-700">
                            <span>Subtotal</span>
                            <span>${getSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Envío</span>
                            <span>{getShipping() === 0 ? 'Gratis' : `$${getShipping().toFixed(2)}`}</span>
                        </div>
                        {getShipping() === 0 && (
                            <p className="text-sm text-green-600">¡Envío gratis en compras mayores a $50!</p>
                        )}
                    </div>

                    <hr className="border-gray-200 my-4" />

                    <div className="flex justify-between text-xl font-bold mb-6">
                        <span>Total</span>
                        <span>${getTotal().toFixed(2)}</span>
                    </div>

                    <button className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-950 transition-colors mb-3 flex items-center justify-center gap-2">
                        Proceder al Pago
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>

                    <a
                        href="/"
                        className="w-full text-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        Continuar Comprando
                    </a>
                </div>
            </div>
        </div>
    );
}
