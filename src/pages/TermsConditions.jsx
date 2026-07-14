import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function TermsConditions() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-36">
        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="text-center">
              <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
                Important Information
              </p>

              <h1 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-7xl">
                Terms & Conditions
              </h1>

              <p className="mx-auto mt-6 max-w-2xl font-body leading-8 text-[#75695F]">
                Please read these terms carefully before using the Tashekari
                website or placing an order.
              </p>
            </div>

            <div className="mt-14 space-y-8 rounded-[38px] bg-white p-7 shadow-xl sm:p-10">
              <section>
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Use of This Website
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  By accessing or using the Tashekari website, you agree to follow
                  these Terms & Conditions. If you do not agree, please do not use
                  the website.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Product Information
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  We aim to display product descriptions, colours, sizes and
                  prices as accurately as possible. However, slight variations
                  may occur because our products are handmade and screen colours
                  may differ.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Handmade Variations
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Small differences in texture, dimensions, knotting and finish
                  are natural characteristics of handmade products and are not
                  considered defects.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Orders and Acceptance
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Placing an order does not automatically guarantee acceptance.
                  Tashekari may confirm, reject or cancel an order in cases such
                  as product unavailability, incorrect pricing, payment issues or
                  incomplete customer information.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Custom Orders
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Custom orders are created according to the requirements
                  approved by the customer. Production begins only after design,
                  pricing, timeline and payment terms are confirmed.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Pricing and Payments
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Product prices may change without prior notice. Applicable
                  shipping charges, discounts or taxes will be shown during
                  checkout where relevant.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Cancellations
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Cancellation requests may be considered before an order is
                  dispatched or before production begins. Custom orders generally
                  cannot be cancelled once production has started.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Shipping, Returns and Refunds
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Shipping, return, exchange and refund requests are governed by
                  our Shipping Policy and Return & Exchange Policy.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Intellectual Property
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  All website content, branding, logos, designs, photographs,
                  text and graphics belong to Tashekari or their respective
                  owners. They may not be copied, reproduced or used without
                  permission.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  External Links
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  Our website may include links to third-party websites or social
                  media platforms. Tashekari is not responsible for their
                  content, availability or privacy practices.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Limitation of Liability
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  To the extent permitted by applicable law, Tashekari will not
                  be responsible for indirect losses, delays or damages caused by
                  circumstances beyond reasonable control.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Changes to These Terms
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  We may update these Terms & Conditions when required. Updated
                  terms will be published on this page.
                </p>
              </section>

              <section className="border-t border-primary/10 pt-8">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Contact Us
                </h2>

                <p className="mt-4 font-body leading-8 text-[#75695F]">
                  For questions about these terms, contact us at{" "}
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