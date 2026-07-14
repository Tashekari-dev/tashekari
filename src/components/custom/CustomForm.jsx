import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

const productTypes = [
  "Macrame Bag",
  "Wall Hanging",
  "Keychain",
  "Bookmark",
  "Home Decor",
  "Gift Hamper",
  "Other",
];

const budgets = [
  "Below ₹500",
  "₹500 – ₹1,000",
  "₹1,000 – ₹2,000",
  "₹2,000 – ₹5,000",
  "Above ₹5,000",
];

export default function CustomForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    productType: "",
    colour: "",
    budget: "",
    occasion: "",
    requirements: "",
  });

  const [fileName, setFileName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setFileName(file ? file.name : "");
  }

  async function handleSubmit(event) {
  event.preventDefault();

  setLoading(true);
  setSuccessMessage("");
  setErrorMessage("");

  const emailData = {
    from_name: formData.name,
    from_email: formData.email,
    subject: `Custom Order Request - ${formData.productType}`,
    message: `
Phone: ${formData.phone}

Product Type: ${formData.productType}

Preferred Colour: ${formData.colour || "Not specified"}

Budget: ${formData.budget}

Occasion: ${formData.occasion || "Not specified"}

Inspiration Image: ${fileName || "Not uploaded"}

Requirements:
${formData.requirements}
    `,
  };

  try {
  await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  emailData,
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
);

    setSuccessMessage(
      "Thank you! Your custom order request has been sent successfully. Our team will contact you shortly."
    );

    setFormData({
      name: "",
      email: "",
      phone: "",
      productType: "",
      colour: "",
      budget: "",
      occasion: "",
      requirements: "",
    });

    setFileName("");
    event.target.reset();
  } catch (error) {
    console.error("Custom order email error:", error);

    setErrorMessage(
      "We could not send your request. Please try again or contact us on WhatsApp."
    );
  } finally {
    setLoading(false);
  }
}

  const fieldClass =
    "w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none transition focus:border-secondary";

  return (
    <section
      id="custom-order-form"
      className="bg-background py-24 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
            Start Your Custom Order
          </p>

          <h2 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
            Tell Us What You Imagine
          </h2>

          <p className="mt-5 font-body leading-8 text-[#75695F]">
            Share your preferred product, colours, budget and inspiration. We
            will review your request and contact you with the next steps.
          </p>
        </motion.div>

        <motion.form

  onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mt-14 max-w-5xl rounded-[40px] bg-white p-7 shadow-xl sm:p-10"
        >
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Product Type
              </label>

              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                required
                className={fieldClass}
              >
                <option value="">Select a product</option>

                {productTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Preferred Colour
              </label>

              <input
                type="text"
                name="colour"
                value={formData.colour}
                onChange={handleChange}
                placeholder="For example: Beige, Rust, Navy"
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Budget
              </label>

              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className={fieldClass}
              >
                <option value="">Select your budget</option>

                {budgets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Occasion
              </label>

              <input
                type="text"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                placeholder="Birthday, wedding, festive gifting or personal use"
                className={fieldClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Inspiration Image
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-primary/20 bg-background px-6 py-10 text-center transition hover:border-secondary">
                <span className="font-heading text-2xl font-semibold text-primary">
                  Upload an inspiration image
                </span>

                <span className="mt-2 font-body text-sm text-[#75695F]">
                  PNG, JPG or JPEG
                </span>

                {fileName && (
                  <span className="mt-4 rounded-full bg-white px-4 py-2 font-body text-xs text-primary shadow-sm">
                    {fileName}
                  </span>
                )}

               <input
  type="file"
  name="inspiration_image"
  accept=".png,.jpg,.jpeg"
  onChange={handleFileChange}
  className="hidden"
/>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-body text-sm font-medium text-primary">
                Your Requirements
              </label>

              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us about the size, colours, style, quantity and any special details..."
                required
                className={`${fieldClass} resize-none rounded-[28px]`}
              />
            </div>
          </div>

          {successMessage && (
            <div className="mt-6 rounded-2xl bg-green-50 px-5 py-4 font-body text-sm text-green-700">
              {successMessage}
            </div>
          )}
{errorMessage && (
  <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 font-body text-sm text-red-600">
    {errorMessage}
  </div>
)}
          <button
  type="submit"
  disabled={loading}
  className="mt-8 w-full rounded-full bg-primary py-5 font-body font-medium text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Sending Request..." : "Submit Custom Order Request"}
</button>

          <p className="mt-4 text-center font-body text-xs leading-6 text-[#8A7B70]">
            Submitting this form does not confirm the order. Our team will
            contact you to discuss pricing, availability and timelines.
          </p>
        </motion.form>
      </div>
    </section>
  );
}