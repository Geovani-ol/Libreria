import Header from "../components/Header";
import Catalogo from "../components/Catalogo";
import { CartProvider } from "../contexts/CartContext";

export default function HomeContent() {
    return (
        <CartProvider>
            <Header />
            <Catalogo />
        </CartProvider>
    );
}
