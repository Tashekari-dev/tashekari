export default function WhyChooseUs() {
  const features = [
    {
      title: "100% Handmade",
      desc: "Every product is handcrafted with love and attention to detail.",
    },
    {
      title: "Sustainable",
      desc: "Eco-friendly materials that care for your home and nature.",
    },
    {
      title: "Premium Quality",
      desc: "High-quality cotton cords for long-lasting beauty.",
    },
    {
      title: "Made With Love",
      desc: "Every knot tells a story of creativity and craftsmanship.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-4xl font-bold text-center text-[#6B4F3A]">
          Why Choose Tashekari?
        </h2>

        <p className="text-center text-gray-500 mt-4">
          Handmade products crafted with passion and purpose.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

          {features.map((item, index) => (

            <div
              key={index}
              className="bg-[#F8F5F1] rounded-3xl p-8 text-center shadow hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-semibold text-[#6B4F3A]">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}