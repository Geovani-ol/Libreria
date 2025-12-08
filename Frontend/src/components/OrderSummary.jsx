import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function OrderSummary() {
    const { cartItems, getSubtotal, getShipping } = useCart();
    const [discountCode, setDiscountCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(null);

    const discountCodes = {
        "DESC10": { type: "percentage", value: 10, description: "10% de descuento" },
        "DESC20": { type: "percentage", value: 20, description: "20% de descuento" },
        "ENVIOGRATIS": { type: "shipping", value: 0, description: "Envío gratis" }
    };

    const subtotal = getSubtotal();
    const shipping = appliedDiscount?.type === "shipping" ? 0 : getShipping();

    // Calcular descuento
    let discountAmount = 0;
    if (appliedDiscount?.type === "percentage") {
        discountAmount = subtotal * (appliedDiscount.value / 100);
    }

    // Calcular impuestos (8% del subtotal después del descuento)
    const taxRate = 0.08;
    const taxableAmount = subtotal - discountAmount;
    const taxes = taxableAmount * taxRate;

    // Total final
    const total = subtotal - discountAmount + shipping + taxes;

    const handleApplyDiscount = () => {
        const code = discountCode.toUpperCase();
        if (discountCodes[code]) {
            setAppliedDiscount({ code, ...discountCodes[code] });
        } else {
            alert("Código de descuento inválido");
        }
    };

    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
        setDiscountCode("");
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

            {/* Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                            <p className="text-sm font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Código de descuento */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de descuento
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        disabled={appliedDiscount}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-100"
                        placeholder="Ingresa código"
                    />
                    {!appliedDiscount ? (
                        <button
                            onClick={handleApplyDiscount}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Aplicar
                        </button>
                    ) : (
                        <button
                            onClick={handleRemoveDiscount}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                        >
                            Quitar
                        </button>
                    )}
                </div>
                {appliedDiscount && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                        ✓ {appliedDiscount.description} aplicado
                    </p>
                )}
            </div>

            {/* Totales */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount?.type === "percentage" && (
                    <div className="flex justify-between text-green-600">
                        <span>Descuento ({appliedDiscount.value}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-gray-700">
                    <span>Envío</span>
                    <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                    <span>Impuestos (8%)</span>
                    <span>${taxes.toFixed(2)}</span>
                </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Total */}
            <div className="flex justify-between text-2xl font-bold mb-6">
                <span className="text-gray-900">Total a Pagar</span>
                <span className="text-accent">${total.toFixed(2)}</span>
            </div>

            {/* Mensaje de seguridad */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Pago Seguro y Encriptado</span>
            </div>
        </div>
    );
}
