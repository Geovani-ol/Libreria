import Header from "./Header";
import Catalogo from "./Catalogo";
import { CartProvider } from "../contexts/CartContext";

export default function HomePage() {
    return (
        <CartProvider>
            <Header />
            <Catalogo />
        </CartProvider>
    );
}
