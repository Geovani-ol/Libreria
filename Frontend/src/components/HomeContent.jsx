import Header from "../components/Header";
import Catalogo from "../components/Catalogo";
import CartIcon from "../components/CartIcon";
import { CartProvider } from "../contexts/CartContext";

export default function HomeContent() {
    return (
        <CartProvider>
            <Header cartIconSlot={<CartIcon />} />
            <Catalogo />
        </CartProvider>
    );
}
