import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import Header from "./Header";
import CartIcon from "./CartIcon";
import { CartProvider } from "../contexts/CartContext";
import CheckoutAccordion from "./CheckoutAccordion";
import ShippingForm from "./ShippingForm";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";

function CheckoutPage() {
    const { cartItems, isLoading } = useCart();
    const [openSection, setOpenSection] = useState(1);
    const [shippingData, setShippingData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isShippingValid, setIsShippingValid] = useState(false);
    const [isPaymentValid, setIsPaymentValid] = useState(false);

    // Redirigir si el carrito está vacío (solo después de cargar)
    useEffect(() => {
        if (!isLoading && cartItems.length === 0) {
            window.location.href = "/carrito";
        }
    }, [cartItems, isLoading]);

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleContinue = () => {
        if (!isShippingValid) {
            alert("Por favor completa la información de envío");
            setOpenSection(1);
            return;
        }
        if (!isPaymentValid) {
            alert("Por favor completa la información de pago");
            setOpenSection(2);
            return;
        }

        // Guardar información del checkout en localStorage
        localStorage.setItem('checkoutShipping', JSON.stringify(shippingData));
        localStorage.setItem('checkoutPayment', paymentMethod);

        // Redirigir a página de confirmación
        window.location.href = "/confirmacion";
    };

    // Mostrar loading mientras se carga el carrito
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return null; // Mientras redirige
    }

    return (
        <div>
            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-6 text-sm text-gray-600">
                        <a href="/" className="hover:text-accent transition-colors">Inicio</a>
                        <span className="mx-2">/</span>
                        <a href="/carrito" className="hover:text-accent transition-colors">Carrito</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">Proceso de Pago</span>
                    </nav>

                    {/* Título */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Proceso de Pago</h1>

                    {/* Grid de 2 columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna izquierda - Formularios */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* 1. Dirección de Envío */}
                            <CheckoutAccordion
                                number={1}
                                title="Dirección de Envío"
                                isOpen={openSection === 1}
                                onToggle={() => handleSectionToggle(1)}
                            >
                                <ShippingForm
                                    onUpdate={setShippingData}
                                    onValidation={setIsShippingValid}
                                />
                            </CheckoutAccordion>

                            {/* 2. Método de Pago */}
                            <CheckoutAccordion
                                number={2}
                                title="Método de Pago"
                                isOpen={openSection === 2}
                                onToggle={() => handleSectionToggle(2)}
                            >
                                <PaymentMethod
                                    onUpdate={setPaymentMethod}
                                    onValidation={setIsPaymentValid}
                                />
                            </CheckoutAccordion>

                            {/* 3. Resumen y Confirmación */}
                            <CheckoutAccordion
                                number={3}
                                title="Resumen y Confirmación"
                                isOpen={openSection === 3}
                                onToggle={() => handleSectionToggle(3)}
                            >
                                <div className="space-y-4">
                                    <p className="text-gray-700">
                                        Por favor revisa tu información antes de continuar con el pago.
                                    </p>

                                    {shippingData && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">Dirección de Envío:</h3>
                                            <p className="text-sm text-gray-700">{shippingData.fullName}</p>
                                            <p className="text-sm text-gray-700">{shippingData.address}</p>
                                            <p className="text-sm text-gray-700">
                                                {shippingData.city}, {shippingData.postalCode}
                                            </p>
                                            <p className="text-sm text-gray-700">{shippingData.email}</p>
                                        </div>
                                    )}

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">Método de Pago:</h3>
                                        <p className="text-sm text-gray-700 capitalize">{paymentMethod}</p>
                                    </div>
                                </div>
                            </CheckoutAccordion>

                            {/* Botón Continuar */}
                            <button
                                onClick={handleContinue}
                                disabled={!isShippingValid || !isPaymentValid}
                                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 ${isShippingValid && isPaymentValid
                                    ? 'bg-accent text-white hover:bg-blue-950 hover:shadow-xl cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isShippingValid && isPaymentValid ? (
                                    <>
                                        Continuar a Pago
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Completa todos los formularios
                                    </>
                                )}
                            </button>

                            {!isShippingValid && !isPaymentValid && (
                                <p className="text-center text-sm text-red-600">
                                    Por favor completa la información de envío y pago
                                </p>
                            )}
                            {!isShippingValid && isPaymentValid && (
                                <p className="text-center text-sm text-red-600">
                                    Por favor completa la información de envío
                                </p>
                            )}
                            {isShippingValid && !isPaymentValid && (
                                <p className="text-center text-sm text-red-600">
                                    Por favor completa la información de pago
                                </p>
                            )}
                        </div>

                        {/* Columna derecha - Resumen del pedido */}
                        <div className="lg:col-span-1">
                            <OrderSummary />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function CheckoutPageWrapper() {
    return (
        <CartProvider>
            <Header>
                <CartIcon />
            </Header>
            <CheckoutPage />
        </CartProvider>
    );
}

export default CheckoutPageWrapper;
