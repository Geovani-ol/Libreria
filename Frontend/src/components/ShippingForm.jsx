import { useState, useEffect } from "react";

export default function ShippingForm({ onUpdate, onValidation }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        postalCode: ""
    });

    const [errors, setErrors] = useState({});

    // Validar formulario y notificar al padre
    useEffect(() => {
        const isValid =
            formData.fullName.trim() !== "" &&
            formData.email.trim() !== "" &&
            validateEmail(formData.email) &&
            formData.address.trim() !== "" &&
            formData.city.trim() !== "" &&
            formData.postalCode.trim() !== "" &&
            validatePostalCode(formData.postalCode) &&
            Object.values(errors).every(error => error === "");

        if (onValidation) {
            onValidation(isValid);
        }
    }, [formData, errors, onValidation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        // Notificar al componente padre
        if (onUpdate) {
            onUpdate({ ...formData, [name]: value });
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePostalCode = (code) => {
        return /^\d{5}$/.test(code);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = "";

        if (!value.trim()) {
            error = "Este campo es requerido";
        } else if (name === "email" && !validateEmail(value)) {
            error = "Email inválido";
        } else if (name === "postalCode" && !validatePostalCode(value)) {
            error = "Código postal debe tener 5 dígitos";
        }

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre Completo */}
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                </label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Juan Pérez"
                />
                {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
            </div>

            {/* Correo Electrónico */}
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="juan.perez@email.com"
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                </label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Av. Siempre Viva 742"
                />
                {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
            </div>

            {/* Ciudad */}
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                </label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Springfield"
                />
                {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
            </div>

            {/* Código Postal */}
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal *
                </label>
                <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength="5"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="12345"
                />
                {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                )}
            </div>
        </form>
    );
}
