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
 * @returns {Promise<Array>} Lista de todos los libros
 */
export async function getAllBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/libros`, {
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
