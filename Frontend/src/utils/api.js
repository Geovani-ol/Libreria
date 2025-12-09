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
