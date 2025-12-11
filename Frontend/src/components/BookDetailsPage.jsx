import { useState, useEffect } from "react";
import Header from "./Header";
import CartIcon from "./CartIcon";
import BookDetailsCart from "./BookDetailsCart";
import BookCarousel from "./BookCarousel";
import { CartProvider } from "../contexts/CartContext";
import { getAllBooks } from "../utils/api";

export default function BookDetailsPage({ book: initialBook, id }) {
    const [book, setBook] = useState(initialBook);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [loading, setLoading] = useState(!initialBook);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!book && id) {
            const fetchBook = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/libros/${id}`);
                    if (!response.ok) {
                        throw new Error('Libro no encontrado');
                    }
                    const data = await response.json();

                    // Mapear datos del backend (español) a la estructura del frontend (inglés)
                    // Asumimos que data tiene: titulo, autor, precio, etc.
                    // Y necesitamos mapear a: title, author, price, etc para que el renderizado funcione
                    // O mejor aún, usamos los datos del backend directamente y ajustamos el renderizado abajo.
                    // Para minimizar cambios invasivos, mapearé aquí.

                    const mappedBook = {
                        id: data.id,
                        title: data.titulo,
                        author: data.autor,
                        price: data.precio,
                        image: data.imagen_url || "https://placehold.co/400x600?text=Sin+Imagen", // Fallback image
                        stock: data.cantidad_disponible,
                        description: data.descripcion,
                        categoria_id: data.categoria_id,
                        // Datos dummy o faltantes en backend
                        category: "General", // El backend tiene categoria_id, necesitaríamos hacer otro fetch o join. Por ahora hardcode o 'General'
                        editorial: "Editorial Desconocida", // Faltante en backend model actual
                        synopsis: data.descripcion, // Usamos descripción como sinopsis
                        details: {
                            isbn: "N/A",
                            pages: "N/A",
                            language: "Español", // Default
                            format: "Físico",
                            year: "2024"
                        }
                    };

                    setBook(mappedBook);
                } catch (err) {
                    console.error("Error fetching book:", err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchBook();
        }
    }, [id, book]);

    // Fetch related books from same category
    useEffect(() => {
        if (book && book.categoria_id) {
            const fetchRelatedBooks = async () => {
                try {
                    const books = await getAllBooks(book.categoria_id);
                    // Filter out current book and limit to 8 books
                    const filtered = books
                        .filter(b => b.id !== book.id)
                        .slice(0, 8);
                    setRelatedBooks(filtered);
                } catch (err) {
                    console.error("Error fetching related books:", err);
                }
            };
            fetchRelatedBooks();
        }
    }, [book]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 flex-col">
                <p className="text-xl text-red-600 font-semibold mb-4">Error: {error || "Libro no encontrado"}</p>
                <a href="/" className="text-accent underline">Volver al inicio</a>
            </div>
        );
    }

    return (
        <CartProvider>
            <Header />

            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-6 text-sm text-gray-600">
                        <a href="/" className="hover:text-accent transition-colors">Inicio</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{book.title}</span>
                    </nav>

                    {/* Contenido principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Imagen del libro - Now takes 3 columns for extra large display */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                                <img
                                    src={book.image}
                                    alt={`Portada de ${book.title}`}
                                    className="w-full rounded-lg shadow-md"
                                    data-astro-transition-name={`book-image-${book.id}`}
                                />
                            </div>
                        </div>

                        {/* Información del libro - Now takes 2 columns */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8">
                                {/* Título y Autor */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                                <p className="text-xl text-gray-600 mb-4">por <span className="font-semibold">{book.author}</span></p>
                                {/* <p className="text-lg text-gray-600 mb-6">Editorial: <span className="font-medium">{book.editorial}</span></p> */}

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
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                                    <p className="text-gray-700 leading-relaxed text-justify">
                                        {book.description || book.synopsis}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Books Carousel */}
                    {relatedBooks.length > 0 && (
                        <BookCarousel
                            books={relatedBooks}
                            title="Más libros de esta categoría"
                        />
                    )}
                </div>
            </main>
        </CartProvider>
    );
}
