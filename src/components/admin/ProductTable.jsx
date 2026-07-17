export default function ProductTable({
  products = [],
  deletingId,
  onEdit,
  onDelete,
}) {
  if (products.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-[#E7D8CA] p-10 text-center text-gray-500">
        Koi product nahi mila.
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#E7D8CA] text-sm text-gray-500">
            <th className="px-4 py-4 font-medium">Image</th>
            <th className="px-4 py-4 font-medium">Product</th>
            <th className="px-4 py-4 font-medium">Category</th>
            <th className="px-4 py-4 font-medium">Price</th>
            <th className="px-4 py-4 font-medium">Stock</th>
            <th className="px-4 py-4 font-medium">Status</th>
            <th className="px-4 py-4 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-[#E7D8CA]/70 transition hover:bg-[#F8F5F1]/60"
            >
              <td className="px-4 py-4">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#E7D8CA] bg-[#F8F5F1]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </td>

              <td className="px-4 py-4">
                <p className="font-medium text-[#6B4F3A]">
                  {product.name}
                </p>

                <p className="mt-1 max-w-xs line-clamp-2 text-sm text-gray-500">
                  {product.description || "No description"}
                </p>
              </td>

              <td className="px-4 py-4">
                <span className="rounded-full bg-[#F8F5F1] px-3 py-1 text-sm text-[#6B4F3A]">
                  {product.category || "Uncategorized"}
                </span>
              </td>

              <td className="px-4 py-4 font-medium text-[#6B4F3A]">
                {product.price}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    Number(product.stock) <= 5
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {product.stock ?? 0}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {product.featured && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                      Featured
                    </span>
                  )}

                  {product.bestseller && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      Bestseller
                    </span>
                  )}

                  {!product.featured &&
                    !product.bestseller && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                        Normal
                      </span>
                    )}
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-full border border-[#A67C52] px-4 py-2 text-sm text-[#6B4F3A] transition hover:bg-[#F8F5F1]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    disabled={deletingId === product.id}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === product.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}