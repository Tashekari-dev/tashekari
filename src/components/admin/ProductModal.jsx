import ProductForm from "./ProductForm";

export default function ProductModal({
  isOpen,
  title,
  initialData,
  loading,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[#E7D8CA] bg-white px-6 py-4">
          <h2 className="text-2xl font-semibold text-[#6B4F3A]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <ProductForm
            initialData={initialData}
            loading={loading}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}