import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function ReturnPolicy() {
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
                Return & Exchange Policy
              </h1>

              <p className="mx-auto mt-6 max-w-2xl font-body leading-8 text-[#75695F]">
                Please read the following information before requesting a return
                or exchange.
              </p>
            </div>

            <div className="mt-14 space-y-8 rounded-[38px] bg-white p-7 shadow-xl sm:p-10">
              <section>
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Handmade Products
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Every Tashekari piece is handmade. Small variations in colour,
                  texture, size or finishing are natural characteristics of
                  handmade craftsmanship and are not considered defects.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Return Eligibility
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  A return request may be considered only if the product is
                  received damaged, defective or different from the confirmed
                  order.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Return Request Timeline
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Please contact us within 48 hours of delivery with your order
                  details, clear photographs and an unboxing video where
                  possible.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Custom Orders
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Customised, personalised and made-to-order products are not
                  eligible for return or exchange unless they arrive damaged or
                  differ significantly from the approved requirements.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Non-Returnable Conditions
                </h2>

                <ul className="mt-4 space-y-3 font-body leading-8 text-[#75695F]">
                  <li>• Products damaged after delivery due to improper use.</li>
                  <li>• Products returned without original packaging.</li>
                  <li>• Products showing signs of use, washing or alteration.</li>
                  <li>• Change-of-mind requests for custom orders.</li>
                </ul>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Exchange or Replacement
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  If your request is approved, we may offer a replacement,
                  exchange or suitable resolution depending on product
                  availability and the nature of the issue.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Refunds
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Approved refunds will be processed through the original payment
                  method or another mutually agreed method. Processing time may
                  vary depending on the payment provider.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Contact Us
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  For return or exchange requests, contact us at{" "}
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