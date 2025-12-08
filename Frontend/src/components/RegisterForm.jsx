import { useState } from 'react';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone: '',
        rfc: '',
        acceptTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validations
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!formData.acceptTerms) {
            setError('Debes aceptar los términos y condiciones');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Replace with actual API endpoint
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al crear la cuenta');
            }

            const data = await response.json();

            // Redirect to login or home page
            window.location.href = '/login?registered=true';
        } catch (err) {
            setError(err.message || 'Error al crear la cuenta. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <a href="/" className="flex justify-center mb-6">
                        <img src="/Logo.png" alt="Mercado Libro" className="h-16 w-auto transition-transform" />
                    </a>
                    <a href="/">
                        <h1 className="text-3xl font-bold text-gray-900 hover:text-accent transition-colors">
                            Librería Virtual
                        </h1>
                    </a>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Crea tu Cuenta
                        </h2>
                        <p className="text-gray-600">
                            Regístrate para empezar a explorar nuestro catálogo.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre Completo
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Ingresa tu nombre y apellidos"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="tu.correo@ejemplo.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Password and Confirm Password - Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Crea una contraseña segura"
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

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Confirma tu contraseña"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showConfirmPassword ? (
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
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Calle, número, colonia, ciudad"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Phone and RFC - Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="55 1234 5678"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            {/* RFC */}
                            <div>
                                <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-2">
                                    RFC <span className="text-gray-400 text-xs">(Opcional)</span>
                                </label>
                                <input
                                    id="rfc"
                                    name="rfc"
                                    type="text"
                                    value={formData.rfc}
                                    onChange={handleChange}
                                    placeholder="Tu RFC para facturación"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="acceptTerms"
                                    name="acceptTerms"
                                    type="checkbox"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 border-gray-300 rounded text-accent focus:ring-accent"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="acceptTerms" className="text-gray-600">
                                    Acepto los{' '}
                                    <a href="/terminos" className="text-accent hover:text-blue-950 font-semibold transition-colors">
                                        Términos y Condiciones
                                    </a>
                                    {' '}y el{' '}
                                    <a href="/privacidad" className="text-accent hover:text-blue-950 font-semibold transition-colors">
                                        Aviso de Privacidad
                                    </a>
                                </label>
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
                                    Creando cuenta...
                                </span>
                            ) : (
                                'Crear Cuenta'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <a href="/login" className="text-accent hover:text-blue-950 font-semibold transition-colors">
                                Inicia sesión
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
    );
}
