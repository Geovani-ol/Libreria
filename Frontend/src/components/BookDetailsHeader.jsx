import Header from "./Header";
import CartIcon from "./CartIcon";

export default function BookDetailsHeader() {
    return <Header cartIconSlot={<CartIcon />} />;
}
