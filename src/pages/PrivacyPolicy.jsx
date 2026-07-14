import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-36">
        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="text-center">
              <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
                Your Privacy Matters
              </p>

              <h1 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-7xl">
                Privacy Policy
              </h1>

              <p className="mx-auto mt-6 max-w-2xl font-body leading-8 text-[#75695F]">
                This policy explains how Tashekari collects, uses and protects
                your information when you use our website.
              </p>
            </div>

            <div className="mt-14 space-y-8 rounded-[38px] bg-white p-7 shadow-xl sm:p-10">
              <section>
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Information We Collect
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  We may collect information such as your name, email address,
                  phone number, shipping address, order details and any
                  information you submit through our forms.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  How We Use Your Information
                </h2>

                <ul className="mt-4 space-y-3 font-body leading-8 text-[#75695F]">
                  <li>• To process and fulfil your orders.</li>
                  <li>• To respond to enquiries and custom order requests.</li>
                  <li>• To provide shipping and order updates.</li>
                  <li>• To improve our products and website experience.</li>
                  <li>• To send promotional updates with your consent.</li>
                </ul>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Payment Information
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Tashekari does not directly store your card, UPI or banking
                  details. Payments may be processed through trusted third-party
                  payment providers when online payment is enabled.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Cookies and Local Storage
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Our website may use browser storage to remember items such as
                  your cart, wishlist and recently viewed products. This helps
                  us provide a smoother shopping experience.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Sharing of Information
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  We do not sell or rent your personal information. Information
                  may be shared only with trusted service providers such as
                  delivery partners, payment providers or technology platforms
                  when required to complete your order or provide our services.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Data Security
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  We take reasonable steps to protect your personal information.
                  However, no method of online transmission or electronic
                  storage can be guaranteed to be completely secure.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Third-Party Services
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Our website may use third-party services such as EmailJS,
                  analytics tools, social media platforms and payment providers.
                  These services may process information according to their own
                  privacy policies.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Your Rights
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  You may contact us to request correction or deletion of the
                  personal information you have submitted, subject to applicable
                  legal and business requirements.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Policy Updates
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  We may update this Privacy Policy from time to time. Any
                  changes will be published on this page.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Contact Us
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  For privacy-related questions, contact us at{" "}
                  <a
                    href="mailto:tashekari07@gmail.com"
                    className="font-medium text-secondary transition hover:text-primary"
                  >
                    tashekari07@gmail.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}