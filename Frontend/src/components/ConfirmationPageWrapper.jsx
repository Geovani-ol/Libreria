import Header from "./Header";
import CartIcon from "./CartIcon";
import { CartProvider } from "../contexts/CartContext";
import OrderConfirmation from "./OrderConfirmation";

export default function ConfirmationPageWrapper() {
    return (
        <CartProvider>
            <Header>
                <CartIcon />
            </Header>
            <OrderConfirmation />
        </CartProvider>
    );
}
