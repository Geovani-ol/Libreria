/**
 * API Utilities for Authentication
 * Módulo para consumir las APIs de autenticación del backend FastAPI
 */

// URL base del backend
const API_BASE_URL = 'http://localhost:8000';

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} credentials - Objeto con las credenciales del usuario
 * @param {string} credentials.correo - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @param {string} credentials.nombre - Nombre completo del usuario
 * @param {string} credentials.direccion - Dirección del usuario
 * @param {string} credentials.telefono - Teléfono del usuario
 * @param {string} credentials.rfc - RFC del usuario
 * @returns {Promise<Object>} Datos del usuario registrado
 */
export async function registerUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al registrar el usuario');
        }

        // Convertir el cuerpo de la respuesta a JSON
        const data = await response.json();

        console.log('Usuario registrado exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error en registerUser:', error);
        throw error;
    }
}

/**
 * Inicia sesión de un usuario existente
 * @param {Object} credentials - Objeto con las credenciales de login
 * @param {string} credentials.correo - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Datos de la sesión (mensaje y user_id)
 */
export async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Correo o contraseña incorrectos');
        }

        // Convertir el cuerpo de la respuesta a JSON
        const data = await response.json();

        console.log('Login exitoso:', data);
        return data;
    } catch (error) {
        console.error('Error en loginUser:', error);
        throw error;
    }
}

/**
 * Book Management API Functions
 */

/**
 * Obtiene todos los libros del sistema
 * @param {number} categoria_id - ID de categoría opcional para filtrar libros
 * @returns {Promise<Array>} Lista de todos los libros
 */
export async function getAllBooks(categoria_id = null) {
    try {
        // Construir URL con parámetros opcionales
        let url = `${API_BASE_URL}/libros`;
        if (categoria_id) {
            url += `?categoria_id=${encodeURIComponent(categoria_id)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al obtener los libros');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en getAllBooks:', error);
        throw error;
    }
}

/**
 * Crea un nuevo libro
 * @param {Object} bookData - Datos del libro a crear
 * @returns {Promise<Object>} Libro creado
 */
export async function createBook(bookData) {
    try {
        const response = await fetch(`${API_BASE_URL}/libros/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al crear el libro');
        }

        const data = await response.json();
        console.log('Libro creado exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error en createBook:', error);
        throw error;
    }
}

/**
 * Actualiza un libro existente (PUT - actualización completa)
 * @param {number} bookId - ID del libro a actualizar
 * @param {Object} bookData - Datos actualizados del libro
 * @returns {Promise<Object>} Libro actualizado
 */
export async function updateBook(bookId, bookData) {
    try {
        const response = await fetch(`${API_BASE_URL}/libros/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al actualizar el libro');
        }

        const data = await response.json();
        console.log('Libro actualizado exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error en updateBook:', error);
        throw error;
    }
}

/**
 * Elimina un libro
 * @param {number} bookId - ID del libro a eliminar
 * @returns {Promise<void>}
 */
export async function deleteBook(bookId) {
    try {
        const response = await fetch(`${API_BASE_URL}/libros/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al eliminar el libro');
        }

        console.log('Libro eliminado exitosamente');
        return;
    } catch (error) {
        console.error('Error en deleteBook:', error);
        throw error;
    }
}

/**
 * Category Management API Functions
 */

/**
 * Obtiene todas las categorías disponibles
 * @returns {Promise<Array>} Lista de todas las categorías
 */
export async function getAllCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al obtener las categorías');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en getAllCategories:', error);
        throw error;
    }
}

/**
 * Crea una nueva categoría
 * @param {Object} categoriaData - Datos de la categoría a crear
 * @returns {Promise<Object>} Categoría creada
 */
export async function createCategoria(categoriaData) {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoriaData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al crear la categoría');
        }

        const data = await response.json();
        console.log('Categoría creada exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error en createCategoria:', error);
        throw error;
    }
}

/**
 * Actualiza una categoría existente
 * @param {number} categoriaId - ID de la categoría a actualizar
 * @param {Object} categoriaData - Datos actualizados de la categoría
 * @returns {Promise<Object>} Categoría actualizada
 */
export async function updateCategoria(categoriaId, categoriaData) {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias/${categoriaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoriaData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al actualizar la categoría');
        }

        const data = await response.json();
        console.log('Categoría actualizada exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error en updateCategoria:', error);
        throw error;
    }
}

/**
 * Elimina una categoría
 * @param {number} categoriaId - ID de la categoría a eliminar
 * @returns {Promise<void>}
 */
export async function deleteCategoria(categoriaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias/${categoriaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Error al eliminar la categoría');
        }

        console.log('Categoría eliminada exitosamente');
        return;
    } catch (error) {
        console.error('Error en deleteCategoria:', error);
        throw error;
    }
}
