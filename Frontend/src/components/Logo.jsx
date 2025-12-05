export default function Logo() {
    return (
        <a href="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="Mercado Libro" className="h-10 w-auto" />
            <span className="text-2xl font-medium">
                Mercado Libro
            </span>
        </a>
    );
}