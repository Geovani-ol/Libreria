import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function OrderConfirmation() {
    const { cartItems, getSubtotal, getShipping, clearCart, isLoading } = useCart();

    // Generar número de orden una sola vez
    const [orderNumber] = useState(() => `ML-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

    // Estado para guardar el snapshot del pedido
    const [orderSummary, setOrderSummary] = useState(null);

    // Obtener información del pedido desde localStorage (guardada en checkout)
    const shippingInfo = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('checkoutShipping') || '{}')
        : {};

    const paymentMethod = typeof window !== 'undefined'
        ? localStorage.getItem('checkoutPayment') || 'card'
        : 'card';

    // Capturar snapshot del pedido cuando el carrito esté cargado
    useEffect(() => {
        if (!isLoading && cartItems.length > 0 && !orderSummary) {
            const subtotal = getSubtotal();
            const shipping = getShipping();
            const taxRate = 0.08;
            const taxes = subtotal * taxRate;
            const total = subtotal + shipping + taxes;

            setOrderSummary({
                items: [...cartItems], // Copia de los items
                subtotal,
                shipping,
                taxes,
                total
            });
        }
    }, [isLoading, cartItems, getSubtotal, getShipping, orderSummary]);

    // Limpiar carrito después de capturar el snapshot
    useEffect(() => {
        if (orderSummary) {
            const timer = setTimeout(() => {
                clearCart();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [orderSummary, clearCart]);

    const handleFinish = () => {
        // Limpiar datos de checkout
        localStorage.removeItem('checkoutShipping');
        localStorage.removeItem('checkoutPayment');
        window.location.href = '/';
    };

    // Mostrar loading mientras se captura el snapshot
    if (!orderSummary) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="mt-4 text-gray-600">Cargando resumen del pedido...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Mensaje de éxito */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div className="text-center">
                        {/* Ícono de éxito */}
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ¡Pedido Confirmado!
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
                        </p>
                        <p className="text-sm text-gray-500">
                            Número de orden: <span className="font-mono font-semibold text-accent">{orderNumber}</span>
                        </p>
                    </div>
                </div>

                {/* Información del pedido */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="bg-accent px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Resumen del Pedido</h2>
                    </div>

                    <div className="p-6">
                        {/* Información de envío */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de Envío</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700"><strong>Nombre:</strong> {shippingInfo.fullName || 'N/A'}</p>
                                <p className="text-gray-700"><strong>Email:</strong> {shippingInfo.email || 'N/A'}</p>
                                <p className="text-gray-700"><strong>Dirección:</strong> {shippingInfo.address || 'N/A'}</p>
                                <p className="text-gray-700">
                                    <strong>Ciudad:</strong> {shippingInfo.city || 'N/A'},
                                    <strong> C.P.:</strong> {shippingInfo.postalCode || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Método de pago */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Método de Pago</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 capitalize flex items-center gap-2">
                                    {paymentMethod === 'card' ? (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Tarjeta de Crédito/Débito
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.53c3.24 0 5.45 1.66 5.45 4.87 0 3.93-2.91 6.47-7.38 6.47h-3.76l-1.11 6.17a.64.64 0 0 1-.63.53l-.729.003zm4.48-13.717a.77.77 0 0 0-.76.653l-.729 4.053h2.76c2.24 0 3.65-1.13 3.65-3.13 0-1.45-.82-2.31-2.58-2.31h-2.341z" />
                                            </svg>
                                            PayPal
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Items del pedido */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos</h3>
                            <div className="space-y-4">
                                {orderSummary.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-20 h-28 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.author}</p>
                                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                            <p className="font-bold text-gray-900 mt-2">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="border-t pt-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Envío</span>
                                    <span>{orderSummary.shipping === 0 ? 'Gratis' : `$${orderSummary.shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Impuestos (8%)</span>
                                    <span>${orderSummary.taxes.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t">
                                    <span>Total</span>
                                    <span className="text-accent">${orderSummary.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <div className="flex gap-3">
                        <svg className="w-6 h-6 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">¿Qué sigue?</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Recibirás un email de confirmación en {shippingInfo.email || 'tu correo'}</li>
                                <li>• Tu pedido será procesado en las próximas 24 horas</li>
                                <li>• El tiempo estimado de entrega es de 3-5 días hábiles</li>
                                <li>• Puedes contactarnos si tienes alguna pregunta</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleFinish}
                        className="px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-950 transition-colors"
                    >
                        Volver al Inicio
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-8 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimir Resumen
                    </button>
                </div>
            </div>
        </div>
    );
}
