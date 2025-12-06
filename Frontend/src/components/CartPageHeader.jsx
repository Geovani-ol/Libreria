import Header from "./Header";
import CartIcon from "./CartIcon";

export default function CartPageHeader() {
    return <Header cartIconSlot={<CartIcon />} />;
}
