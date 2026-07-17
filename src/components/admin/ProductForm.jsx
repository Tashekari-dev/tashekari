import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  stock: "",
  featured: false,
  bestseller: false,
  image: "",
};

export default function ProductForm({
  initialData,
  loading,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price:
          initialData.raw_price ??
          initialData.price ??
          "",
        category: initialData.category || "",
        description: initialData.description || "",
        stock: initialData.stock ?? "",
        featured: Boolean(initialData.featured),
        bestseller: Boolean(initialData.bestseller),
        image: initialData.image || "",
      });

      setImagePreview(initialData.image || "");
      setImageFile(null);
    } else {
      setFormData(emptyForm);
      setImagePreview("");
      setImageFile(null);
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Image size 5 MB se kam honi chahiye.");
      event.target.value = "";
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const handleRemoveSelectedImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(formData.image || "");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const category = formData.category.trim();
    const description =
      formData.description.trim();

    const price = Number(formData.price);
    const stock = Number(formData.stock || 0);

    if (!name) {
      alert("Please enter product name.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (!category) {
      alert("Please enter product category.");
      return;
    }

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      alert(
        "Stock zero ya usse zyada hona chahiye."
      );
      return;
    }

    if (!imageFile && !formData.image) {
      alert("Please select a product image.");
      return;
    }

    onSubmit({
      productData: {
        name,
        price,
        category,
        description,
        stock,
        featured: Boolean(formData.featured),
        bestseller: Boolean(
          formData.bestseller
        ),
        image: formData.image,
      },
      imageFile,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-[#6B4F3A]">
          Product Image
        </label>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          disabled={loading}
          className="w-full rounded-xl border border-[#E7D8CA] p-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#F8F5F1] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#6B4F3A] hover:file:bg-[#E7D8CA] disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <p className="mt-2 text-xs text-gray-500">
          JPG, PNG ya WEBP. Maximum size 5 MB.
        </p>

        {imagePreview && (
          <div className="mt-4">
            <div className="overflow-hidden rounded-2xl border border-[#E7D8CA] bg-[#F8F5F1]">
              <img
                src={imagePreview}
                alt="Product preview"
                className="h-56 w-full object-cover"
              />
            </div>

            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveSelectedImage}
                disabled={loading}
                className="mt-3 text-sm font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove selected image
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-[#6B4F3A]"
          >
            Product Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Example: Navy Macrame Bag"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full rounded-xl border border-[#E7D8CA] p-3 outline-none transition focus:border-[#6B4F3A] focus:ring-2 focus:ring-[#A67C52]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-[#6B4F3A]"
          >
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            placeholder="Example: Bags"
            value={formData.category}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full rounded-xl border border-[#E7D8CA] p-3 outline-none transition focus:border-[#6B4F3A] focus:ring-2 focus:ring-[#A67C52]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-[#6B4F3A]"
          >
            Price
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="1"
            step="1"
            placeholder="Example: 799"
            value={formData.price}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full rounded-xl border border-[#E7D8CA] p-3 outline-none transition focus:border-[#6B4F3A] focus:ring-2 focus:ring-[#A67C52]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="stock"
            className="mb-2 block text-sm font-medium text-[#6B4F3A]"
          >
            Stock
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="Example: 10"
            value={formData.stock}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full rounded-xl border border-[#E7D8CA] p-3 outline-none transition focus:border-[#6B4F3A] focus:ring-2 focus:ring-[#A67C52]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-[#6B4F3A]"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows="4"
          placeholder="Product description"
          value={formData.description}
          onChange={handleInputChange}
          disabled={loading}
          className="w-full resize-none rounded-xl border border-[#E7D8CA] p-3 outline-none transition focus:border-[#6B4F3A] focus:ring-2 focus:ring-[#A67C52]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      <div className="grid gap-4 rounded-2xl bg-[#F8F5F1] p-5 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={handleInputChange}
            disabled={loading}
            className="h-5 w-5 accent-[#6B4F3A]"
          />

          <span className="text-[#6B4F3A]">
            Featured Product
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            name="bestseller"
            type="checkbox"
            checked={formData.bestseller}
            onChange={handleInputChange}
            disabled={loading}
            className="h-5 w-5 accent-[#6B4F3A]"
          />

          <span className="text-[#6B4F3A]">
            Bestseller
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="w-full rounded-xl border border-[#E7D8CA] py-3 font-medium text-[#6B4F3A] transition hover:bg-[#F8F5F1] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#6B4F3A] py-3 font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Product"
              : "Save Product"}
        </button>
      </div>
    </form>
  );
}