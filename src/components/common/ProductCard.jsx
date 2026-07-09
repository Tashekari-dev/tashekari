import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ id, image, name, price }) {
  const { addToCart } = useCart();

  const product = { id, image, name, price };

  return (
    <div className="group bg-white rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl duration-500">
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-[380px] w-full object-cover group-hover:scale-110 duration-700"
          />

          <button className="absolute top-5 right-5 bg-white w-12 h-12 rounded-full shadow-lg opacity-0 group-hover:opacity-100 duration-300">
            ♡
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-semibold text-[#6B4F3A]">
            {name}
          </h3>

          <p className="mt-2 text-[#A67C52] text-lg">{price}</p>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <button
          onClick={() => {
  addToCart(product);
  alert(`${name} added to cart`);
}}
          className="w-full bg-[#6B4F3A] text-white py-3 rounded-full hover:bg-[#4E3829] duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}