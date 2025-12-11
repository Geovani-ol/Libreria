import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import { getAllBooks, getAllCategories } from "../utils/api";

const sortOptions = [
    { value: "relevance", label: "Relevancia" },
    { value: "newest", label: "Más nuevos" },
    { value: "price_low", label: "Precio (menor a mayor)" },
    { value: "price_high", label: "Precio (mayor a menor)" }
];

export default function Catalogo() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [sortBy, setSortBy] = useState("relevance");
    const [searchQuery, setSearchQuery] = useState("");

    // Cargar categorías al inicio
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);

                // Verificar URL para establecer filtro inicial
                const params = new URLSearchParams(window.location.search);
                const categoryParam = params.get("categoria");
                if (categoryParam) {
                    const catId = parseInt(categoryParam);
                    if (!isNaN(catId)) {
                        setSelectedCategoryId(catId);
                    }
                }
            } catch (err) {
                console.error("Error cargando categorías:", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch books from API when category changes
    useEffect(() => {
        fetchBooks();
    }, [selectedCategoryId]);

    const fetchBooks = async () => {
        try {
            setIsLoading(true);
            const data = await getAllBooks(selectedCategoryId);
            setBooks(data);
            setError("");
        } catch (err) {
            setError(err.message || "Error al cargar los libros");
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar URL cuando cambia la categoría
    const handleCategoryChange = (categoriaId) => {
        setSelectedCategoryId(categoriaId);
        const url = new URL(window.location.href);
        if (categoriaId) {
            url.searchParams.set("categoria", categoriaId);
        } else {
            url.searchParams.delete("categoria");
        }
        window.history.pushState({}, "", url);
    };

    // Filtrar libros solo por búsqueda (la categoría se filtra en el backend)
    const filteredBooks = books.filter(book => {
        const matchesSearch = searchQuery
            ? book.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.autor.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesSearch;
    });

    // Ordenar libros
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        switch (sortBy) {
            case "price_low":
                return a.precio - b.precio;
            case "price_high":
                return b.precio - a.precio;
            case "newest":
                return b.id - a.id;
            default:
                return 0;
        }
    });

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchBooks}
                            className="mt-2 text-sm text-red-700 underline hover:text-red-900"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Sidebar de Filtros */}
                    <aside className="w-64 shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h2 className="font-semibold mb-5 text-lg text-gray-900">Filtros</h2>
                            <hr className="border-gray-200 mb-5" />

                            <h3 className="mb-3 font-medium text-gray-900">Categoría</h3>
                            <fieldset className="border-none">
                                <div className="flex flex-col gap-2">
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="categoria"
                                            checked={selectedCategoryId === null}
                                            onChange={() => handleCategoryChange(null)}
                                            className="peer sr-only"
                                        />
                                        <span className="block px-4 py-2 rounded-md transition-colors peer-checked:bg-accent peer-checked:text-white hover:bg-gray-100">
                                            Todas
                                        </span>
                                    </label>
                                    {categories.map((categoria) => (
                                        <label key={categoria.id} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="categoria"
                                                value={categoria.id}
                                                checked={selectedCategoryId === categoria.id}
                                                onChange={() => handleCategoryChange(categoria.id)}
                                                className="peer sr-only"
                                            />
                                            <span className="block px-4 py-2 rounded-md transition-colors peer-checked:bg-accent peer-checked:text-white hover:bg-gray-100">
                                                {categoria.nombre}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                    </aside>

                    {/* Área principal del catálogo */}
                    <section className="flex-1">
                        {/* Encabezado con título y buscador */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Explora Nuestro Catálogo de Libros
                            </h1>

                            {/* Buscador */}
                            <div className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por título o autor..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    />
                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-gray-600">
                                    {sortedBooks.length} {sortedBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
                                </p>

                                {/* Opciones de ordenamiento */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">Ordenar por:</span>
                                    <div className="flex gap-2">
                                        {sortOptions.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setSortBy(option.value)}
                                                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${sortBy === option.value
                                                    ? 'bg-accent text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid de libros */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedBooks.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>

                        {/* Mensaje cuando no hay resultados */}
                        {sortedBooks.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {searchQuery
                                        ? `No se encontraron libros para "${searchQuery}"`
                                        : 'No se encontraron libros en esta categoría'
                                    }
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}