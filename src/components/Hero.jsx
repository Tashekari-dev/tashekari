import heroImage from "../assets/images/hero.jpg";

export default function Hero() {
  return (
    <section className="bg-[#F8F5F1] min-h-screen pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 items-center gap-12">
        <div>
          <p className="uppercase tracking-[0.35em] text-[#A67C52] text-sm">
            Handmade • Sustainable • Luxury
          </p>

          <h1 className="mt-6 text-5xl lg:text-7xl font-bold text-[#6B4F3A] leading-tight">
            Handmade <br />
            Macrame <br />
            Collection
          </h1>

          <p className="mt-8 text-lg leading-9 text-gray-600 max-w-xl">
            Discover handcrafted décor made with love. Elegant, timeless and
            sustainable creations designed to transform your home.
          </p>

          <div className="flex gap-5 mt-10">
            <button className="bg-[#6B4F3A] text-white px-9 py-4 rounded-full hover:bg-[#4D382B] duration-300">
              Shop Collection
            </button>

            <button className="border border-[#6B4F3A] px-9 py-4 rounded-full text-[#6B4F3A] hover:bg-[#6B4F3A] hover:text-white duration-300">
              Explore
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">
            <div>
              <h2 className="text-3xl font-bold text-[#6B4F3A]">500+</h2>
              <p className="text-gray-500 mt-2">Happy Customers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#6B4F3A]">150+</h2>
              <p className="text-gray-500 mt-2">Handmade Designs</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#6B4F3A]">100%</h2>
              <p className="text-gray-500 mt-2">Sustainable</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute w-72 h-72 bg-[#E9D7C5] rounded-full blur-3xl top-16 -left-10 opacity-60"></div>

          <img
            src={heroImage}
            alt="Tashekari"
            className="relative rounded-[40px] shadow-2xl h-[520px] w-full object-cover"
          />

          <div className="absolute bottom-8 -left-8 bg-white rounded-3xl p-6 shadow-2xl">
            <h2 className="text-4xl font-bold text-[#6B4F3A]">5+</h2>
            <p className="text-[#A67C52] mt-2">Years of Craftsmanship</p>
          </div>
        </div>
      </div>
    </section>
  );
}