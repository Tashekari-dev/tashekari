import bag12 from "../assets/products/bag12.jpeg";
import keychain1 from "../assets/products/keychain1.jpeg";
import pic2 from "../assets/products/pic2.jpeg";

const categories = [
  {
    name: "Macrame Bags",
    image: bag12,
  },
  {
    name: "Keychains",
    image: keychain1,
  },
  {
    name: "Accessories",
    image: pic2,
  },
];

export default function Categories() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-[#6B4F3A]">
          Shop Collections
        </h2>

        <p className="text-center mt-5 text-gray-500">
          Explore our handcrafted collections
        </p>

        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {categories.map((item, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-[35px] cursor-pointer shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[420px] w-full object-cover group-hover:scale-110 duration-700"
                />
              </div>

              <div className="bg-[#F8F5F1] p-8">
                <h2 className="text-2xl font-bold text-[#6B4F3A]">
                  {item.name}
                </h2>

                <button className="mt-5 text-[#A67C52] font-semibold">
                  Shop Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}