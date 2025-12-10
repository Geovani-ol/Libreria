import Header from "./Header";
import CartPage from "./CartPage";
import { CartProvider } from "../contexts/CartContext";

export default function CartPageWrapper() {
    return (
        <CartProvider>
            <Header />

            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-6 text-sm text-gray-600">
                        <a href="/" className="hover:text-accent transition-colors">Inicio</a>
                        <span className="mx-2">/</span>
                        <a href="/" className="hover:text-accent transition-colors">Libros</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">Carrito de Compras</span>
                    </nav>

                    {/* Título */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

                    {/* Contenido del carrito */}
                    <CartPage />
                </div>
            </main>
        </CartProvider>
    );
}
