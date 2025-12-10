import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import CartIcon from "./CartIcon";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Check authentication status on mount and when localStorage changes
    useEffect(() => {
        const checkAuthStatus = () => {
            const userId = localStorage.getItem("user_id");
            const adminStatus = localStorage.getItem("is_admin") === "true";
            setIsLoggedIn(!!userId);
            setIsAdmin(adminStatus);
        };

        checkAuthStatus();

        // Listen for storage changes (for multi-tab sync)
        window.addEventListener("storage", checkAuthStatus);

        return () => {
            window.removeEventListener("storage", checkAuthStatus);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        // Remove all auth-related data from localStorage
        localStorage.removeItem("user_id");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");

        // Redirect to home page
        window.location.href = "/";
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="flex justify-between items-center px-5 md:px-25 py-4 bg-primary border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <Logo />

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        {/* Cart Icon - Only visible when logged in AND not an admin */}
                        {localStorage.getItem("is_admin") !== "true" && <CartIcon />}

                        {/* User Menu - Only visible when logged in */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="p-2 bg-accent text-white hover:bg-blue-950 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                                aria-label="Menú de usuario"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    {/* Admin Dashboard Link - Only for admins */}
                                    {localStorage.getItem("is_admin") === "true" && (
                                        <>
                                            <a
                                                href="/dashboard"
                                                className="flex items-center gap-3 px-4 py-3 text-accent hover:bg-blue-50 transition-colors font-medium"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    />
                                                </svg>
                                                <span>Panel de Administrador</span>
                                            </a>
                                            <hr className="my-2 border-gray-200" />
                                        </>
                                    )}

                                    {/* Panel de Usuario - Solo para usuarios normales */}
                                    {!isAdmin && (
                                        <a
                                            href="/user"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-600"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                            </svg>
                                            <span>Panel de Usuario</span>
                                        </a>
                                    )}

                                    {/* Pedidos - Solo para usuarios normales */}
                                    {!isAdmin && (
                                        <a
                                            href="/orders"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <svg
                                                className="w-5 h-5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                            <span>Pedidos</span>
                                        </a>
                                    )}

                                    <hr className="my-2 border-gray-200" />

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Login Button - Only visible when NOT logged in */
                    <a
                        href="/login"
                        className="px-5 py-2 bg-accent text-white hover:bg-blue-950 transition-colors rounded-md font-medium"
                    >
                        Iniciar Sesión
                    </a>
                )}
            </div>
        </header>
    );
}