import { useState } from "react";
import emailjs from "@emailjs/browser";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function sendEmail(e) {
    e.preventDefault();

    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setSuccess(
          "Thank you! Your message has been sent successfully. Our team will get back to you shortly."
        );

        setForm({
          from_name: "",
          from_email: "",
          subject: "",
          message: "",
        });

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Something went wrong. Please try again.");
      });
  }

  return (
    <>
      <Navbar />

      <section className="pt-40 pb-24 bg-[#F8F5F1] min-h-screen">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.35em] text-[#A67C52] text-sm">
              Get In Touch
            </p>

            <h1 className="text-6xl font-bold text-[#6B4F3A] mt-5">
              Contact Tashekari
            </h1>

            <p className="mt-6 text-gray-600 max-w-2xl mx-auto leading-8">
              We'd love to hear from you. Whether you're looking for a custom
              order, collaboration, or simply have a question, we're here to
              help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            <form
              onSubmit={sendEmail}
              className="bg-white rounded-[35px] p-10 shadow-xl"
            >

              <h2 className="text-3xl font-bold text-[#6B4F3A] mb-8">
                Send Us a Message
              </h2>

              <div className="space-y-5">

                <div>
                  <label className="block mb-2 font-medium text-[#6B4F3A]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="from_name"
                    value={form.from_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="w-full border rounded-full px-6 py-4 outline-none focus:border-[#6B4F3A]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-[#6B4F3A]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="from_email"
                    value={form.from_email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full border rounded-full px-6 py-4 outline-none focus:border-[#6B4F3A]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-[#6B4F3A]">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Custom Order, Collaboration..."
                    required
                    className="w-full border rounded-full px-6 py-4 outline-none focus:border-[#6B4F3A]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-[#6B4F3A]">
                    Message
                  </label>

                  <textarea
                    rows="6"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    required
                    className="w-full border rounded-3xl px-6 py-4 outline-none focus:border-[#6B4F3A]"
                  />
                </div>

                {success && (
                  <div className="bg-green-100 text-green-700 rounded-2xl p-4">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#6B4F3A] text-white py-4 rounded-full hover:bg-[#4E3829] duration-300"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>

              </div>

            </form>

            <div className="bg-[#6B4F3A] text-white rounded-[35px] p-10">

              <h2 className="text-3xl font-bold mb-10">
                Get in Touch
              </h2>

              <div className="space-y-10">

                <div>
                  <h3 className="uppercase tracking-[0.3em] text-sm text-white/60 mb-2">
                    Email Address
                  </h3>

                  <p className="text-2xl">
                    support@tashekari.com
                  </p>
                </div>

                <hr className="border-white/15"/>

                <div>
                  <h3 className="uppercase tracking-[0.3em] text-sm text-white/60 mb-2">
                    Instagram
                  </h3>

                  <p className="text-2xl">
                    @tashekari
                  </p>
                </div>

                <hr className="border-white/15"/>

                <div>
                  <h3 className="uppercase tracking-[0.3em] text-sm text-white/60 mb-2">
                    Location
                  </h3>

                  <p className="text-2xl">
                    India
                  </p>
                </div>

                <hr className="border-white/15"/>

                <div>
                  <h3 className="uppercase tracking-[0.3em] text-sm text-white/60 mb-2">
                    Working Hours
                  </h3>

                  <p className="text-2xl">
                    Monday – Saturday
                  </p>

                  <p className="mt-2 text-xl text-white/80">
                    10:00 AM – 7:00 PM
                  </p>
                </div>

                <div className="bg-white/10 rounded-3xl p-7 mt-8">
                  <h3 className="text-4xl font-serif mb-3">
                    Custom Orders Welcome
                  </h3>

                  <p className="text-white/80 leading-8">
                    Looking for something unique? Share your ideas,
                    preferred colours, size, or occasion, and we'll
                    create a handcrafted piece specially for you.
                  </p>
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