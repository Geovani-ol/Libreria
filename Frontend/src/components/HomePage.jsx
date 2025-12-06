import Header from "./Header";
import Catalogo from "./Catalogo";
import CartIcon from "./CartIcon";
import { CartProvider } from "../contexts/CartContext";

export default function HomePage() {
    return (
        <CartProvider>
            <Header>
                <CartIcon />
            </Header>
            <Catalogo />
        </CartProvider>
    );
}
