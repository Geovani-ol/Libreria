import Logo from "./Logo";

export default function Header({ children }) {
    return (
        <header className="flex justify-between items-center px-5 md:px-25 py-4 bg-primary border-b border-gray-200">
            <Logo />
            <div className="flex items-center gap-4">
                {/* Slot para el ícono del carrito */}
                {children}

                <a href="/login" className="px-5 py-2 bg-accent text-white hover:bg-blue-950 transition-colors rounded-md">
                    Iniciar Sesión
                </a>
            </div>
        </header>
    );
}