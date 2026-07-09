import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
export default function Navbar() {

  const { cartItems } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F8F5F1]/90 backdrop-blur-md border-b border-[#E7D8CA]">
      <nav className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        
        <h1 className="text-3xl font-bold tracking-wide text-[#6B4F3A]">
          Tashekari
        </h1>

       <ul className="hidden md:flex items-center gap-10 text-sm uppercase tracking-[0.2em] text-[#6B4F3A]">

  <li>
    <Link className="hover:text-[#A67C52] duration-300" to="/">
      HOME
    </Link>
  </li>

  <li>
    <Link className="hover:text-[#A67C52] duration-300" to="/shop">
      SHOP
    </Link>
  </li>

  <li>
    <Link className="hover:text-[#A67C52] duration-300" to="/">
      ABOUT
    </Link>
  </li>

  <li>
    <Link className="hover:text-[#A67C52] duration-300" to="/">
      CONTACT
    </Link>
  </li>

</ul>
        <div className="flex items-center gap-4 text-[#6B4F3A]">
          <button className="hidden md:block text-sm uppercase tracking-[0.2em]">
            Search
          </button>

       <Link to="/cart">
  <button className="relative bg-[#6B4F3A] text-white px-6 py-2 rounded-full hover:bg-[#4E3829] duration-300">

    Cart

    {cartItems.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
        {cartItems.length}
      </span>
    )}

  </button>
</Link>
        </div>

      </nav>
    </header>
  );
}