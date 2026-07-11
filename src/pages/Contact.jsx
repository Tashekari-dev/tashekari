import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />

      <section className="pt-36 pb-24 bg-[#F8F5F1] min-h-screen">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.3em] text-[#A67C52]">
              Get In Touch
            </p>

            <h1 className="text-6xl font-bold text-[#6B4F3A] mt-4">
              Contact Tashekari
            </h1>

            <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you. Whether it's a custom order,
              collaboration or any question, feel free to contact us.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            <div className="bg-white rounded-[35px] p-10 shadow-lg">

              <h2 className="text-3xl font-bold text-[#6B4F3A] mb-8">
                Send a Message
              </h2>

              <div className="space-y-5">

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border rounded-full px-6 py-4"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border rounded-full px-6 py-4"
                />

                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full border rounded-full px-6 py-4"
                />

                <textarea
                  rows="6"
                  placeholder="Your Message"
                  className="w-full border rounded-3xl px-6 py-4"
                ></textarea>

                <button className="w-full bg-[#6B4F3A] text-white py-4 rounded-full hover:bg-[#4E3829] duration-300">
                  Send Message
                </button>

              </div>
            </div>

            <div className="bg-white rounded-[35px] p-10 shadow-lg">

              <h2 className="text-3xl font-bold text-[#6B4F3A] mb-8">
                Contact Information
              </h2>

              <div className="space-y-8 text-gray-700">

                <div>
                  <h3 className="font-bold text-[#6B4F3A] mb-2">Email</h3>
                  <p>hello@tashekari.com</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#6B4F3A] mb-2">Phone</h3>
                  <p>+91 XXXXXXXXXX</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#6B4F3A] mb-2">Instagram</h3>
                  <p>@tashekari</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#6B4F3A] mb-2">Working Hours</h3>
                  <p>Monday - Saturday</p>
                  <p>10:00 AM - 7:00 PM</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}