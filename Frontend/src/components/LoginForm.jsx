import { useState } from 'react';
import { loginUser } from '../utils/api.js';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Llamar a la API de login usando la función del módulo de utilidades
            const data = await loginUser({
                correo: email,
                password: password
            });

            // Guardar user_id e is_admin en localStorage para uso futuro
            if (data.user_id) {
                localStorage.setItem('user_id', data.user_id);
            }
            if (data.is_admin !== undefined) {
                localStorage.setItem('is_admin', data.is_admin.toString());
            }

            // Redirigir según el rol del usuario
            if (data.is_admin) {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/';
            }
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Background with Logo */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-accent to-blue-950 relative overflow-hidden">
                {/* Decorative pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
                    <div className="max-w-md text-center">
                        <a href="/" className="mb-8 flex justify-center">
                            <img src="/Logo.png" alt="Mercado Libro" className="h-24 w-auto drop-shadow-lg transition-transform" />
                        </a>
                        <a href="/" className="block">
                            <h1 className="text-4xl font-bold mb-4 hover:text-blue-100 transition-colors">
                                Librería Virtual
                            </h1>
                        </a>
                        <p className="text-xl text-blue-200">
                            Tu biblioteca digital, a un clic de distancia.
                        </p>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <a href="/">
                            <img src="/Logo.png" alt="Mercado Libro" className="h-12 w-auto mx-auto mb-4 hover:scale-105 transition-transform" />
                        </a>
                        <a href="/">
                            <h2 className="text-2xl font-bold text-gray-900 hover:text-accent transition-colors">Mercado Libro</h2>
                        </a>
                    </div>

                    {/* Form container */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Bienvenido de nuevo
                            </h2>
                            <p className="text-gray-600">
                                Inicia sesión para acceder a tu cuenta.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="tu.email@ejemplo.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Introduce tu contraseña"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-accent hover:bg-blue-950 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Iniciando sesión...
                                    </span>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                ¿Aún no tienes cuenta?{' '}
                                <a href="/register" className="text-accent hover:text-blue-950 font-semibold transition-colors">
                                    Regístrate aquí
                                </a>
                            </p>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                <a href="/" className="text-accent hover:text-blue-950 font-semibold transition-colors">
                                    Volver al inicio
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 flex justify-center gap-6 text-sm text-gray-600">
                        <a href="/terminos" className="hover:text-gray-900 transition-colors">
                            Términos de Servicio
                        </a>
                        <span>•</span>
                        <a href="/privacidad" className="hover:text-gray-900 transition-colors">
                            Política de Privacidad
                        </a>
                        <span>•</span>
                        <a href="/contacto" className="hover:text-gray-900 transition-colors">
                            Contacto
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
