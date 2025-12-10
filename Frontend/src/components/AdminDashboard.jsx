import { useState, useEffect } from "react";
import { getAllBooks, createBook, updateBook, deleteBook } from "../utils/api";

export default function AdminDashboard() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStock, setFilterStock] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Form state for adding/editing books
    const [formData, setFormData] = useState({
        titulo: "",
        autor: "",
        editorial: "",
        precio: "",
        cantidad_disponible: "",
        descripcion: "",
        imagen_url: "",
    });

    // Check if user is admin on mount
    useEffect(() => {
        const adminStatus = localStorage.getItem("is_admin");
        setIsAdmin(adminStatus === "true");

        if (adminStatus !== "true") {
            // Redirect non-admin users
            window.location.href = "/";
        }
    }, []);

    // Fetch books on component mount
    useEffect(() => {
        if (isAdmin) {
            fetchBooks();
        }
    }, [isAdmin]);

    // Filter books when search term or filter changes
    useEffect(() => {
        filterBooks();
    }, [searchTerm, filterStock, books]);

    const fetchBooks = async () => {
        try {
            setIsLoading(true);
            const data = await getAllBooks();
            setBooks(data);
            setError("");
        } catch (err) {
            setError(err.message || "Error al cargar los libros");
        } finally {
            setIsLoading(false);
        }
    };

    const filterBooks = () => {
        let filtered = [...books];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (book) =>
                    book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.autor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply stock filter
        if (filterStock === "in-stock") {
            filtered = filtered.filter((book) => book.cantidad_disponible > 0);
        } else if (filterStock === "out-of-stock") {
            filtered = filtered.filter((book) => book.cantidad_disponible === 0);
        }

        setFilteredBooks(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            titulo: "",
            autor: "",
            editorial: "",
            precio: "",
            cantidad_disponible: "",
            descripcion: "",
            imagen_url: "",
        });
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const bookData = {
                ...formData,
                precio: parseFloat(formData.precio),
                cantidad_disponible: parseInt(formData.cantidad_disponible),
            };
            await createBook(bookData);
            await fetchBooks();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            setError(err.message || "Error al agregar el libro");
        }
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
        setFormData({
            titulo: book.titulo,
            autor: book.autor,
            editorial: book.editorial,
            precio: book.precio.toString(),
            cantidad_disponible: book.cantidad_disponible.toString(),
            descripcion: book.descripcion,
            imagen_url: book.imagen_url,
        });
        setShowEditModal(true);
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        try {
            const bookData = {
                ...formData,
                precio: parseFloat(formData.precio),
                cantidad_disponible: parseInt(formData.cantidad_disponible),
            };
            await updateBook(editingBook.id, bookData);
            await fetchBooks();
            setShowEditModal(false);
            setEditingBook(null);
            resetForm();
        } catch (err) {
            setError(err.message || "Error al actualizar el libro");
        }
    };

    const handleDeleteBook = async (bookId, bookTitle) => {
        if (window.confirm(`¿Estás seguro de eliminar "${bookTitle}"?`)) {
            try {
                await deleteBook(bookId);
                await fetchBooks();
            } catch (err) {
                setError(err.message || "Error al eliminar el libro");
            }
        }
    };

    if (!isAdmin) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Panel de Administración
                        </h1>
                        <p className="text-gray-600">Gestiona el catálogo de libros</p>
                    </div>
                    <a
                        href="/"
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Volver al Menú Principal
                    </a>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        {/* Search */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Buscar por título o autor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={filterStock}
                            onChange={(e) => setFilterStock(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        >
                            <option value="all">Todos los libros</option>
                            <option value="in-stock">En stock</option>
                            <option value="out-of-stock">Agotados</option>
                        </select>

                        {/* Add Button */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-blue-950 transition-colors font-medium whitespace-nowrap"
                        >
                            + Agregar Libro
                        </button>
                    </div>
                </div>

                {/* Books Table */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                        <p className="mt-4 text-gray-600">Cargando libros...</p>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-600 text-lg">No se encontraron libros</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Libro
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Autor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Editorial
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredBooks.map((book) => (
                                        <tr key={book.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={book.imagen_url}
                                                        alt={book.titulo}
                                                        className="w-12 h-16 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {book.titulo}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {book.autor}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {book.editorial}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                ${book.precio.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${book.cantidad_disponible > 0
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {book.cantidad_disponible} unidades
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditClick(book)}
                                                    className="text-accent hover:text-blue-950 mr-4"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteBook(book.id, book.titulo)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-sm text-gray-600">Total de libros</p>
                        <p className="text-2xl font-bold text-gray-900">{books.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-sm text-gray-600">En stock</p>
                        <p className="text-2xl font-bold text-green-600">
                            {books.filter((b) => b.cantidad_disponible > 0).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-sm text-gray-600">Agotados</p>
                        <p className="text-2xl font-bold text-red-600">
                            {books.filter((b) => b.cantidad_disponible === 0).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Book Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Agregar Nuevo Libro
                            </h2>
                            <form onSubmit={handleAddBook} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            value={formData.titulo}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Autor *
                                        </label>
                                        <input
                                            type="text"
                                            name="autor"
                                            value={formData.autor}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Editorial *
                                        </label>
                                        <input
                                            type="text"
                                            name="editorial"
                                            value={formData.editorial}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Precio *
                                        </label>
                                        <input
                                            type="number"
                                            name="precio"
                                            value={formData.precio}
                                            onChange={handleInputChange}
                                            required
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cantidad Disponible *
                                        </label>
                                        <input
                                            type="number"
                                            name="cantidad_disponible"
                                            value={formData.cantidad_disponible}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL de Imagen *
                                        </label>
                                        <input
                                            type="url"
                                            name="imagen_url"
                                            value={formData.imagen_url}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                    ></textarea>
                                </div>
                                <div className="flex gap-4 justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-blue-950 transition-colors"
                                    >
                                        Agregar Libro
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Book Modal */}
            {showEditModal && editingBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Editar Libro
                            </h2>
                            <form onSubmit={handleUpdateBook} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            value={formData.titulo}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Autor *
                                        </label>
                                        <input
                                            type="text"
                                            name="autor"
                                            value={formData.autor}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Editorial *
                                        </label>
                                        <input
                                            type="text"
                                            name="editorial"
                                            value={formData.editorial}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Precio *
                                        </label>
                                        <input
                                            type="number"
                                            name="precio"
                                            value={formData.precio}
                                            onChange={handleInputChange}
                                            required
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cantidad Disponible *
                                        </label>
                                        <input
                                            type="number"
                                            name="cantidad_disponible"
                                            value={formData.cantidad_disponible}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL de Imagen *
                                        </label>
                                        <input
                                            type="url"
                                            name="imagen_url"
                                            value={formData.imagen_url}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                    ></textarea>
                                </div>
                                <div className="flex gap-4 justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditingBook(null);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-blue-950 transition-colors"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
