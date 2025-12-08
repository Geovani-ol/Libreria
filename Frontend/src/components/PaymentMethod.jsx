import { useState, useEffect } from "react";

export default function PaymentMethod({ onUpdate, onValidation }) {
    const [selectedMethod, setSelectedMethod] = useState("card");
    const [cardData, setCardData] = useState({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: ""
    });
    const [paypalEmail, setPaypalEmail] = useState("");

    const paymentMethods = [
        {
            id: "card",
            name: "Tarjeta de Crédito/Débito",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            id: "paypal",
            name: "PayPal",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.53c3.24 0 5.45 1.66 5.45 4.87 0 3.93-2.91 6.47-7.38 6.47h-3.76l-1.11 6.17a.64.64 0 0 1-.63.53l-.729.003zm4.48-13.717a.77.77 0 0 0-.76.653l-.729 4.053h2.76c2.24 0 3.65-1.13 3.65-3.13 0-1.45-.82-2.31-2.58-2.31h-2.341z" />
                </svg>
            )
        }
    ];

    // Validar formulario según el método seleccionado
    useEffect(() => {
        let isValid = false;

        if (selectedMethod === "card") {
            // Validar que todos los campos de tarjeta estén completos
            const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
            isValid =
                cardNumberClean.length === 16 &&
                cardData.cardName.trim() !== "" &&
                cardData.expiryDate.length === 5 && // MM/YY
                cardData.cvv.length >= 3;
        } else if (selectedMethod === "paypal") {
            // Validar email de PayPal
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(paypalEmail);
        }

        if (onValidation) {
            onValidation(isValid);
        }
    }, [selectedMethod, cardData, paypalEmail, onValidation]);

    const handleSelect = (methodId) => {
        setSelectedMethod(methodId);
        if (onUpdate) {
            onUpdate(methodId);
        }
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Formatear número de tarjeta (solo números, max 16)
        if (name === "cardNumber") {
            formattedValue = value.replace(/\D/g, '').slice(0, 16);
            // Agregar espacios cada 4 dígitos
            formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
        }

        // Formatear fecha de expiración (MM/YY)
        if (name === "expiryDate") {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
            }
        }

        // Formatear CVV (solo números, max 4)
        if (name === "cvv") {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setCardData(prev => ({ ...prev, [name]: formattedValue }));
    };

    return (
        <div className="space-y-4">
            {/* Selector de método */}
            <div className="space-y-3">
                {paymentMethods.map((method) => (
                    <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedMethod === method.id
                            ? 'border-accent bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedMethod === method.id}
                            onChange={() => handleSelect(method.id)}
                            className="w-4 h-4 text-accent focus:ring-accent"
                        />
                        <div className="ml-3 flex items-center gap-3 flex-1">
                            <div className={selectedMethod === method.id ? 'text-accent' : 'text-gray-600'}>
                                {method.icon}
                            </div>
                            <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                    </label>
                ))}
            </div>

            {/* Formulario de Tarjeta */}
            {selectedMethod === "card" && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4 animate-fadeIn">
                    <h3 className="font-semibold text-gray-900 mb-4">Información de la Tarjeta</h3>

                    {/* Número de tarjeta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Tarjeta *
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardData.cardNumber}
                            onChange={handleCardChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>

                    {/* Nombre en la tarjeta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre en la Tarjeta *
                        </label>
                        <input
                            type="text"
                            name="cardName"
                            value={cardData.cardName}
                            onChange={handleCardChange}
                            placeholder="JUAN PEREZ"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent uppercase"
                        />
                    </div>

                    {/* Fecha y CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Expiración *
                            </label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={cardData.expiryDate}
                                onChange={handleCardChange}
                                placeholder="MM/YY"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV *
                            </label>
                            <input
                                type="text"
                                name="cvv"
                                value={cardData.cvv}
                                onChange={handleCardChange}
                                placeholder="123"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Tu información está protegida y encriptada</span>
                    </div>
                </div>
            )}

            {/* Formulario de PayPal */}
            {selectedMethod === "paypal" && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4 animate-fadeIn">
                    <h3 className="font-semibold text-gray-900 mb-4">Cuenta de PayPal</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correo Electrónico de PayPal *
                        </label>
                        <input
                            type="email"
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Serás redirigido a PayPal</p>
                                <p className="text-xs text-blue-700">Después de confirmar el pedido, te redirigiremos a PayPal para completar el pago de forma segura.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
