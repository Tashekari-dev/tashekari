import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [productName, setProductName] = useState("");
const [category, setCategory] = useState("");
const [price, setPrice] = useState("");
const [stock, setStock] = useState("");
const [description, setDescription] = useState("");
const [featured, setFeatured] = useState(false);
const [bestseller, setBestseller] = useState(false);
const [imageFile, setImageFile] = useState(null);
const [saving, setSaving] = useState(false);

const [editingId, setEditingId] = useState(null);
const [editingImage, setEditingImage] = useState("");

const [deleteProduct, setDeleteProduct] = useState(null);
const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  }
async function handleAddProduct(event) {
  event.preventDefault();

  if (
    !productName.trim() ||
    !category ||
    !price ||
    !stock ||
    !description.trim() ||
    !imageFile
  ) {
    alert("Please fill all required fields and select an image.");
    return;
  }

  try {
    setSaving(true);

    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase
      .from("products")
      .insert([
        {
          name: productName.trim(),
          category,
          price: Number(price),
          stock: Number(stock),
          description: description.trim(),
          image: imageUrl,
          featured,
          bestseller,
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    alert("Product added successfully.");

    setProductName("");
    setCategory("");
    setPrice("");
    setStock("");
    setDescription("");
    setFeatured(false);
    setBestseller(false);
    setImageFile(null);
    setShowModal(false);

    await fetchProducts();
  } catch (error) {
    console.error("Error adding product:", error);
    alert(error.message || "Unable to add product.");
  } finally {
    setSaving(false);
  }
}
function handleEdit(product) {
  setEditingId(product.id);

  setProductName(product.name || "");
  setCategory(product.category || "");
  setPrice(product.price || "");
  setStock(product.stock || "");
  setDescription(product.description || "");
  setFeatured(product.featured || false);
  setBestseller(product.bestseller || false);

  setEditingImage(product.image || "");
  setImageFile(null);

  setShowModal(true);
}
async function handleUpdateProduct(event) {
  event.preventDefault();

  if (
    !productName.trim() ||
    !category ||
    !price ||
    !stock ||
    !description.trim()
  ) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    setSaving(true);

    let imageUrl = editingImage;

    // Agar nayi image select ki hai tabhi upload hogi
    if (imageFile) {
      const extension = imageFile.name.split(".").pop();

      const fileName =
        Date.now() + "." + extension;

      const filePath = "products/" + fileName;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: productName,
        category,
        price: Number(price),
        stock: Number(stock),
        description,
        featured,
        bestseller,
        image: imageUrl,
      })
      .eq("id", editingId);

    if (error) throw error;

    alert("Product updated successfully.");

    setShowModal(false);
    setEditingId(null);

    await fetchProducts();

  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setSaving(false);
  }
}
async function handleDeleteProduct() {
  if (!deleteProduct) return;

  try {
    setDeleting(true);

    if (deleteProduct.image?.includes("/product-images/")) {
      const imagePath = decodeURIComponent(
        deleteProduct.image.split("/product-images/")[1].split("?")[0]
      );

      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove([imagePath]);

        if (storageError) {
          throw new Error(
            `Image delete failed: ${storageError.message}`
          );
        }
      }
    }

    const { error: databaseError } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteProduct.id);

    if (databaseError) {
      throw databaseError;
    }

    alert("Product and image deleted successfully.");

    setDeleteProduct(null);

    await fetchProducts();
  } catch (error) {
    console.error("Error deleting product:", error);

    alert(
      error.message ||
        "Unable to delete product and image."
    );
  } finally {
    setDeleting(false);
  }
}
  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#6B4F3A]">
              Products
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all products.
            </p>
          </div>
<button
  onClick={() => {

    setEditingId(null);

    setProductName("");
    setCategory("");
    setPrice("");
    setStock("");
    setDescription("");

    setFeatured(false);
    setBestseller(false);

    setImageFile(null);
    setEditingImage("");

    setShowModal(true);

  }}
  className="px-5 py-3 rounded-xl bg-[#6B4F3A] text-white hover:opacity-90"
>
  + Add Product
</button>
        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <div className="px-6 py-5 border-b">
            Total Products : {products.length}
          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-[#F8F5F1]">

                <tr>

                  <th className="text-left p-5">
                    Image
                  </th>

                  <th className="text-left p-5">
                    Product
                  </th>

                  <th className="text-left p-5">
                    Category
                  </th>

                  <th className="text-left p-5">
                    Price
                  </th>

                  <th className="text-left p-5">
                    Stock
                  </th>

                  <th className="text-left p-5">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t"
                  >

                    <td className="p-5">

                      <img
                        src={item.image}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover"
                      />

                    </td>

                    <td className="p-5 font-medium">
                      {item.name}
                    </td>

                    <td className="p-5">
                      {item.category}
                    </td>

                    <td className="p-5">
                      ₹{item.price}
                    </td>

                    <td className="p-5">
                      {item.stock}
                    </td>

                    <td className="p-5">

                     <button
  onClick={() => handleEdit(item)}
  className="px-4 py-2 rounded-lg border mr-2"
>
  Edit
</button>

                     <button
  onClick={() => setDeleteProduct(item)}
  className="px-4 py-2 rounded-lg bg-red-500 text-white"
>
  Delete
</button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl w-full max-w-2xl p-8 max-h-[85vh] overflow-y-auto">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold text-[#6B4F3A]">
  {editingId ? "Edit Product" : "Add Product"}
</h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-3xl"
        >
          ×
        </button>

      </div>
<form
  onSubmit={editingId ? handleUpdateProduct : handleAddProduct}
  className="space-y-5"
>

  <div>
    <label className="block mb-2 font-medium text-[#6B4F3A]">
      Product Image
    </label>

  <input
  type="file"
  accept="image/*"
  onChange={(event) => setImageFile(event.target.files[0])}
  className="w-full border rounded-xl px-4 py-3"
/>
  </div>

  <div>
    <label className="block mb-2 font-medium text-[#6B4F3A]">
      Product Name
    </label>

    <input
  type="text"
  value={productName}
  onChange={(event) => setProductName(event.target.value)}
  placeholder="Enter product name"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#6B4F3A]"
/>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div>
      <label className="block mb-2 font-medium text-[#6B4F3A]">
        Category
      </label>

     <select
  value={category}
  onChange={(event) => setCategory(event.target.value)}
  className="w-full border rounded-xl px-4 py-3"
>
        <option value="">Select category</option>
        <option value="Bags">Bags</option>
        <option value="Keychains">Keychains</option>
        <option value="Accessories">Accessories</option>
        <option value="Bookmarks">Bookmarks</option>
        <option value="Home Decor">Home Decor</option>
      </select>
    </div>

    <div>
      <label className="block mb-2 font-medium text-[#6B4F3A]">
        Price
      </label>

      <input
  type="number"
  min="0"
  value={price}
  onChange={(event) => setPrice(event.target.value)}
  placeholder="Enter price"
  className="w-full border rounded-xl px-4 py-3"
/>
    </div>

  </div>

  <div>
    <label className="block mb-2 font-medium text-[#6B4F3A]">
      Stock
    </label>

    <input
  type="number"
  min="0"
  value={stock}
  onChange={(event) => setStock(event.target.value)}
  placeholder="Enter stock quantity"
  className="w-full border rounded-xl px-4 py-3"
/>
  </div>

  <div>
    <label className="block mb-2 font-medium text-[#6B4F3A]">
      Description
    </label>

    <textarea
  rows="4"
  value={description}
  onChange={(event) => setDescription(event.target.value)}
  placeholder="Enter product description"
  className="w-full border rounded-xl px-4 py-3 resize-none"
/>
  </div>

  <div className="flex flex-wrap gap-6">

    <label className="flex items-center gap-2">
     <input
  type="checkbox"
  checked={featured}
  onChange={(event) => setFeatured(event.target.checked)}
/>
      Featured Product
    </label>

    <label className="flex items-center gap-2">
     <input
  type="checkbox"
  checked={bestseller}
  onChange={(event) => setBestseller(event.target.checked)}
/>
      Bestseller
    </label>

  </div>

  <div className="flex justify-end gap-3 pt-4">

    <button
      type="button"
      onClick={() => setShowModal(false)}
      className="px-5 py-3 rounded-xl border border-[#6B4F3A] text-[#6B4F3A]"
    >
      Cancel
    </button>

   <button
  type="submit"
  disabled={saving}
  className="px-5 py-3 rounded-xl bg-[#6B4F3A] text-white disabled:opacity-60 disabled:cursor-not-allowed"
>
{saving
  ? "Saving..."
  : editingId
  ? "Update Product"
  : "Save Product"}
</button>

  </div>

</form>

    </div>

  </div>
)}
{deleteProduct && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

      <h2 className="text-3xl font-bold text-[#6B4F3A]">
        Delete Product
      </h2>

      <p className="mt-4 text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-[#6B4F3A]">
          {deleteProduct.name}
        </span>
        ?
      </p>

      <p className="mt-2 text-sm text-red-500">
        This action cannot be undone.
      </p>

      <div className="mt-8 flex justify-end gap-3">

        <button
          type="button"
          onClick={() => setDeleteProduct(null)}
          disabled={deleting}
          className="rounded-xl border border-[#6B4F3A] px-5 py-3 text-[#6B4F3A] disabled:opacity-60"
        >
          Cancel
        </button>

        <button
  type="button"
  onClick={handleDeleteProduct}
  disabled={deleting}
  className="rounded-xl bg-red-500 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
>
  {deleting ? "Deleting..." : "Delete Product"}
</button>

      </div>
    </div>
  </div>
)}
    </AdminLayout>
  );
}