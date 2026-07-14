import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function ShippingPolicy() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-36">
        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="text-center">
              <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
                Customer Care
              </p>

              <h1 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-7xl">
                Shipping Policy
              </h1>

              <p className="mx-auto mt-6 max-w-2xl font-body leading-8 text-[#75695F]">
                Everything you need to know about order processing, dispatch and
                delivery at Tashekari.
              </p>
            </div>

            <div className="mt-14 space-y-8 rounded-[38px] bg-white p-7 shadow-xl sm:p-10">
              <section>
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Order Processing
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  All Tashekari products are carefully prepared and packed before
                  dispatch. Ready products are generally processed within 1–3
                  working days.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Custom Orders
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Custom and made-to-order products may require additional
                  preparation time. The expected timeline will be shared with
                  you before production begins.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Shipping Across India
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  We currently deliver across India through trusted courier
                  partners. Delivery availability may depend on the serviceability
                  of your postal code.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Estimated Delivery Time
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Most orders are delivered within 4–8 working days after
                  dispatch. Delivery timelines may vary due to location, weather,
                  holidays or courier delays.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Shipping Charges
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Shipping charges, if applicable, will be shown at checkout.
                  Promotional free-shipping offers may be available on selected
                  order values from time to time.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Order Tracking
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Once your order is dispatched, tracking details will be shared
                  through the available contact information provided during
                  checkout.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Delays or Delivery Issues
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  In case of unusual delay, incorrect tracking information or a
                  delivery-related concern, please contact the Tashekari team with
                  your order details.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Contact Us
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  For shipping-related questions, contact us at{" "}
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