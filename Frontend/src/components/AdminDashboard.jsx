import { useState, useEffect } from "react";
import { getAllBooks, createBook, updateBook, deleteBook, getAllCategories, createCategoria, updateCategoria, deleteCategoria } from "../utils/api";

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
    const [categorias, setCategorias] = useState([]);
    const [newCategoriaName, setNewCategoriaName] = useState("");
    const [editingCategoriaId, setEditingCategoriaId] = useState(null);
    const [editingCategoriaName, setEditingCategoriaName] = useState("");

    // Form state for adding/editing books
    const [formData, setFormData] = useState({
        titulo: "",
        autor: "",
        editorial: "",
        precio: "",
        cantidad_disponible: "",
        descripcion: "",
        paginas: "",
        categoria_id: "",
        idioma: "",
        fecha_publicacion: "",
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

    // Fetch books and categories on component mount
    useEffect(() => {
        if (isAdmin) {
            fetchBooks();
            fetchCategorias();
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

    const fetchCategorias = async () => {
        try {
            const data = await getAllCategories();
            setCategorias(data);
        } catch (err) {
            console.error("Error al cargar categorías:", err);
        }
    };

    const handleAddCategoria = async (e) => {
        e.preventDefault();
        if (!newCategoriaName.trim()) return;

        try {
            await createCategoria({ nombre: newCategoriaName });
            await fetchCategorias();
            setNewCategoriaName("");
            setError("");
        } catch (err) {
            setError(err.message || "Error al crear la categoría");
        }
    };

    const handleEditCategoria = (categoria) => {
        setEditingCategoriaId(categoria.id);
        setEditingCategoriaName(categoria.nombre);
    };

    const handleSaveCategoria = async () => {
        if (!editingCategoriaName.trim()) return;

        try {
            await updateCategoria(editingCategoriaId, { nombre: editingCategoriaName });
            await fetchCategorias();
            setEditingCategoriaId(null);
            setEditingCategoriaName("");
            setError("");
        } catch (err) {
            setError(err.message || "Error al actualizar la categoría");
        }
    };

    const handleCancelEdit = () => {
        setEditingCategoriaId(null);
        setEditingCategoriaName("");
    };

    const handleDeleteCategoria = async (categoriaId, categoriaNombre) => {
        if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoriaNombre}"?`)) {
            try {
                await deleteCategoria(categoriaId);
                await fetchCategorias();
                setError("");
            } catch (err) {
                setError(err.message || "Error al eliminar la categoría");
            }
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
            paginas: "",
            categoria_id: "",
            idioma: "",
            fecha_publicacion: "",
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
                paginas: parseInt(formData.paginas),
                categoria_id: parseInt(formData.categoria_id),
                fecha_publicacion: parseInt(formData.fecha_publicacion),
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
            paginas: book.paginas?.toString() || "",
            categoria_id: book.categoria_id?.toString() || "",
            idioma: book.idioma || "",
            fecha_publicacion: book.fecha_publicacion?.toString() || "",
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
                paginas: parseInt(formData.paginas),
                categoria_id: parseInt(formData.categoria_id),
                fecha_publicacion: parseInt(formData.fecha_publicacion),
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

                {/* Two Column Layout */}
                <div className="flex gap-6">
                    {/* Main Content - Books Table */}
                    <div className="flex-1">
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

                    {/* Right Sidebar - Category Management */}
                    <aside className="w-80 shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Gestión de Categorías
                            </h2>

                            {/* Add Category Form */}
                            <form onSubmit={handleAddCategoria} className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nueva Categoría
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategoriaName}
                                        onChange={(e) => setNewCategoriaName(e.target.value)}
                                        placeholder="Nombre de categoría"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newCategoriaName.trim()}
                                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-950 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </form>

                            <hr className="border-gray-200 mb-4" />

                            {/* Categories List */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Categorías Existentes ({categorias.length})
                                </h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {categorias.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            No hay categorías todavía
                                        </p>
                                    ) : (
                                        categorias.map((cat) => (
                                            <div
                                                key={cat.id}
                                                className="px-3 py-2 bg-gray-50 rounded-md text-sm hover:bg-gray-100 transition-colors"
                                            >
                                                {editingCategoriaId === cat.id ? (
                                                    // Modo edición: Input con botones guardar/cancelar
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            value={editingCategoriaName}
                                                            onChange={(e) => setEditingCategoriaName(e.target.value)}
                                                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleSaveCategoria();
                                                                if (e.key === 'Escape') handleCancelEdit();
                                                            }}
                                                        />
                                                        <button
                                                            onClick={handleSaveCategoria}
                                                            className="p-1 text-green-600 hover:text-green-800"
                                                            title="Guardar"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-1 text-red-600 hover:text-red-800"
                                                            title="Cancelar"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    // Modo vista: Texto con botones editar/eliminar
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-700">{cat.nombre}</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleEditCategoria(cat)}
                                                                className="p-1 text-blue-600 hover:text-blue-800"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCategoria(cat.id, cat.nombre)}
                                                                className="p-1 text-red-600 hover:text-red-800"
                                                                title="Eliminar"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Páginas *
                                        </label>
                                        <input
                                            type="number"
                                            name="paginas"
                                            value={formData.paginas}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categoría *
                                        </label>
                                        <select
                                            name="categoria_id"
                                            value={formData.categoria_id}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        >
                                            <option value="">Seleccionar categoría</option>
                                            {categorias.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Idioma *
                                        </label>
                                        <select
                                            name="idioma"
                                            value={formData.idioma}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        >
                                            <option value="">Seleccionar idioma</option>
                                            <option value="Español">Español</option>
                                            <option value="Inglés">Inglés</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Año de Publicación *
                                        </label>
                                        <input
                                            type="number"
                                            name="fecha_publicacion"
                                            value={formData.fecha_publicacion}
                                            onChange={handleInputChange}
                                            required
                                            min="1000"
                                            max={new Date().getFullYear()}
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Páginas *
                                        </label>
                                        <input
                                            type="number"
                                            name="paginas"
                                            value={formData.paginas}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categoría *
                                        </label>
                                        <select
                                            name="categoria_id"
                                            value={formData.categoria_id}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        >
                                            <option value="">Seleccionar categoría</option>
                                            {categorias.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Idioma *
                                        </label>
                                        <select
                                            name="idioma"
                                            value={formData.idioma}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        >
                                            <option value="">Seleccionar idioma</option>
                                            <option value="Español">Español</option>
                                            <option value="Inglés">Inglés</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Año de Publicación *
                                        </label>
                                        <input
                                            type="number"
                                            name="fecha_publicacion"
                                            value={formData.fecha_publicacion}
                                            onChange={handleInputChange}
                                            required
                                            min="1000"
                                            max={new Date().getFullYear()}
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
