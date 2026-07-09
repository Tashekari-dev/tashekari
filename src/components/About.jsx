export default function About() {
  return (
    <section className="py-24 bg-[#F8F5F1]">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="uppercase tracking-widest text-[#A67C52] font-semibold">
            About Us
          </span>

          <h2 className="text-5xl font-bold text-[#6B4F3A] mt-5">
            Handmade with Passion
          </h2>

          <p className="mt-8 text-gray-600 leading-8">
            Tashekari began with a simple dream during Covid—to create
            beautiful handmade macrame products that bring warmth,
            elegance and purpose into every home.
          </p>

          <p className="mt-5 text-gray-600 leading-8">
            Every knot is handmade with love and every purchase supports
            creativity, craftsmanship and employment opportunities.
          </p>

          <button className="mt-10 bg-[#6B4F3A] text-white px-8 py-4 rounded-full">
            Learn More
          </button>
        </div>

        <div>
          <div className="h-[500px] rounded-[40px] bg-[#E9DDD1] flex items-center justify-center">
            <h2 className="text-2xl text-[#6B4F3A]">
              About Image
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}