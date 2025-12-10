import Header from "./Header";
import CartIcon from "./CartIcon";
import BookDetailsCart from "./BookDetailsCart";
import { CartProvider } from "../contexts/CartContext";

export default function BookDetailsPage({ book }) {
    return (
        <CartProvider>
            <Header />

            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-6 text-sm text-gray-600">
                        <a href="/" className="hover:text-accent transition-colors">Inicio</a>
                        <span className="mx-2">/</span>
                        <a href={`/?categoria=${encodeURIComponent(book.category)}`} className="hover:text-accent transition-colors">{book.category}</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{book.title}</span>
                    </nav>

                    {/* Contenido principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Imagen del libro */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg sticky top-8">
                                <img
                                    src={book.image}
                                    alt={`Portada de ${book.title}`}
                                    className="w-full rounded-lg shadow-md"
                                    data-astro-transition-name={`book-image-${book.id}`}
                                />
                            </div>
                        </div>

                        {/* Información del libro */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8">
                                {/* Título y Autor */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                                <p className="text-xl text-gray-600 mb-4">por <span className="font-semibold">{book.author}</span></p>
                                <p className="text-lg text-gray-600 mb-6">Editorial: <span className="font-medium">{book.editorial}</span></p>

                                <hr className="border-gray-200 mb-6" />

                                {/* Precio y disponibilidad */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-3 mb-4">
                                        <span className="text-4xl font-bold text-gray-900">
                                            ${book.price.toFixed(2)}
                                        </span>
                                    </div>

                                    {book.stock > 0 ? (
                                        <div className="flex items-center gap-2 text-green-600 mb-4">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="font-semibold">En Stock ({book.stock} disponibles)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600 mb-4">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="font-semibold">Agotado</span>
                                        </div>
                                    )}
                                </div>

                                {book.stock > 0 && (
                                    <BookDetailsCart book={book} />
                                )}

                                <hr className="border-gray-200 my-6" />

                                {/* Sinopsis */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Sinopsis</h2>
                                    <p className="text-gray-700 leading-relaxed text-justify">
                                        {book.synopsis}
                                    </p>
                                </div>

                                {/* Detalles técnicos */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalles del Producto</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">ISBN</p>
                                            <p className="font-semibold text-gray-900">{book.details.isbn}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Páginas</p>
                                            <p className="font-semibold text-gray-900">{book.details.pages}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Idioma</p>
                                            <p className="font-semibold text-gray-900">{book.details.language}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Formato</p>
                                            <p className="font-semibold text-gray-900">{book.details.format}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Año de publicación</p>
                                            <p className="font-semibold text-gray-900">{book.details.year}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Categoría</p>
                                            <p className="font-semibold text-gray-900">{book.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </CartProvider>
    );
}
