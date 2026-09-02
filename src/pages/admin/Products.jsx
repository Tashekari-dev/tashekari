import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";
import {
  createProduct,
  deleteProduct as deleteProductService,
  updateProduct,
} from "../../services/productService.js";

const EMPTY_FORM = {
  productName: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  material: "",
  dimensions: "",
  weight: "",
  sku: "",
  tags: "",
  featured: false,
  bestseller: false,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState([]);
  const [collectionSearch, setCollectionSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [sku, setSku] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);

  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingImage, setEditingImage] = useState("");

  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const filteredCollections = useMemo(() => {
    const query = collectionSearch.trim().toLowerCase();

    if (!query) return collections;

    return collections.filter((collection) =>
      collection.name.toLowerCase().includes(query)
    );
  }, [collections, collectionSearch]);

  function resetForm() {
    setProductName(EMPTY_FORM.productName);
    setCategory(EMPTY_FORM.category);
    setPrice(EMPTY_FORM.price);
    setStock(EMPTY_FORM.stock);
    setDescription(EMPTY_FORM.description);
    setMaterial(EMPTY_FORM.material);
    setDimensions(EMPTY_FORM.dimensions);
    setWeight(EMPTY_FORM.weight);
    setSku(EMPTY_FORM.sku);
    setTags(EMPTY_FORM.tags);
    setFeatured(EMPTY_FORM.featured);
    setBestseller(EMPTY_FORM.bestseller);

    setImageFile(null);
    setGalleryFiles([]);
    setExistingGalleryImages([]);

    setEditingId(null);
    setEditingImage("");
    setSelectedCollectionIds([]);
    setCollectionSearch("");
  }

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    resetForm();
  }

  async function fetchProducts() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.dismiss();
      toast.error(error.message || "Products load nahi ho paye.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCollections() {
    try {
      setCollectionsLoading(true);

      const { data, error } = await supabase
        .from("collections")
        .select("id, name, status, active, sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCollections(data || []);
    } catch (error) {
      console.error("Fetch collections error:", error);
      toast.dismiss();
      toast.error(error.message || "Collections load nahi ho payi.");
    } finally {
      setCollectionsLoading(false);
    }
  }

  async function loadProductCollections(productId) {
    const { data, error } = await supabase
      .from("collection_products")
      .select("collection_id")
      .eq("product_id", productId);

    if (error) throw error;

    return (data || []).map((item) => item.collection_id);
  }

  async function saveProductCollections(productId) {
    const { error: deleteError } = await supabase
      .from("collection_products")
      .delete()
      .eq("product_id", productId);

    if (deleteError) throw deleteError;

    if (selectedCollectionIds.length === 0) return;

    const rows = selectedCollectionIds.map((collectionId, index) => ({
      product_id: productId,
      collection_id: collectionId,
      sort_order: index,
    }));

    const { error: insertError } = await supabase
      .from("collection_products")
      .insert(rows);

    if (insertError) throw insertError;
  }

  function parseGalleryImages(images) {
    if (Array.isArray(images)) return images.filter(Boolean);

    if (typeof images === "string" && images.trim()) {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  function toggleCollection(collectionId) {
    setSelectedCollectionIds((current) =>
      current.includes(collectionId)
        ? current.filter((id) => id !== collectionId)
        : [...current, collectionId]
    );
  }

  function removeExistingGalleryImage(imageUrl) {
    setExistingGalleryImages((current) =>
      current.filter((image) => image !== imageUrl)
    );
  }

  function removeNewGalleryFile(fileIndex) {
    setGalleryFiles((current) =>
      current.filter((_, index) => index !== fileIndex)
    );
  }

  function validateForm() {
    if (
      !productName.trim() ||
      !category ||
      price === "" ||
      stock === "" ||
      !description.trim()
    ) {
      toast.dismiss();
      toast.error("Please fill all required fields.");
      return false;
    }

    if (!editingId && !imageFile) {
      toast.dismiss();
      toast.error("Please select a main product image.");
      return false;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      toast.dismiss();
      toast.error("Price aur stock negative nahi ho sakte.");
      return false;
    }

    return true;
  }

  function getProductPayload() {
    return {
      name: productName.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      description: description.trim(),
      material: material.trim(),
      dimensions: dimensions.trim(),
      weight: weight.trim(),
      sku: sku.trim(),
      tags,
      featured,
      bestseller,
      image: editingImage,
      images: existingGalleryImages,
    };
  }

  async function handleAddProduct(event) {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const newProduct = await createProduct(
        getProductPayload(),
        imageFile,
        galleryFiles
      );

      await saveProductCollections(newProduct.id);

      toast.dismiss();
      toast.success("Product added successfully.");

      setShowModal(false);
      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.dismiss();
      toast.error(error.message || "Unable to add product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(product) {
    try {
      setEditingId(product.id);

      setProductName(product.name || "");
      setCategory(product.category || "");
      setPrice(product.price ?? "");
      setStock(product.stock ?? "");
      setDescription(product.description || "");
      setMaterial(product.material || "");
      setDimensions(product.dimensions || "");
      setWeight(product.weight || "");
      setSku(product.sku || "");
      setTags(
        Array.isArray(product.tags)
          ? product.tags.join(", ")
          : product.tags || ""
      );
      setFeatured(Boolean(product.featured));
      setBestseller(Boolean(product.bestseller));

      setEditingImage(product.image || "");
      setImageFile(null);
      setGalleryFiles([]);
      setExistingGalleryImages(parseGalleryImages(product.images));
      setCollectionSearch("");

      const ids = await loadProductCollections(product.id);
      setSelectedCollectionIds(ids);

      setShowModal(true);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.dismiss();
      toast.error(error.message || "Product details load nahi ho payi.");
    }
  }

  async function handleUpdateProduct(event) {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      await updateProduct(
        editingId,
        getProductPayload(),
        imageFile,
        galleryFiles
      );

      await saveProductCollections(editingId);

      toast.dismiss();
      toast.success("Product updated successfully.");

      setShowModal(false);
      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.dismiss();
      toast.error(error.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct() {
    if (!deleteProduct) return;

    try {
      setDeleting(true);

      const { error: mappingError } = await supabase
        .from("collection_products")
        .delete()
        .eq("product_id", deleteProduct.id);

      if (mappingError) throw mappingError;

      await deleteProductService(deleteProduct.id);

      toast.dismiss();
      toast.success("Product deleted successfully.");

      setDeleteProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.dismiss();
      toast.error(error.message || "Unable to delete product.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#6B4F3A]">
              Products
            </h1>

            <p className="mt-2 text-gray-500">
              Manage products, gallery images and collections.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-[#6B4F3A] px-5 py-3 text-white transition hover:opacity-90"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow">
          <div className="border-b px-6 py-5">
            Total Products: {products.length}
          </div>

          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead className="bg-[#F8F5F1]">
                  <tr>
                    <th className="p-5 text-left">Image</th>
                    <th className="p-5 text-left">Product</th>
                    <th className="p-5 text-left">Category</th>
                    <th className="p-5 text-left">Price</th>
                    <th className="p-5 text-left">Stock</th>
                    <th className="p-5 text-left">Gallery</th>
                    <th className="p-5 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((item) => {
                    const galleryCount = parseGalleryImages(item.images).length;

                    return (
                      <tr key={item.id} className="border-t">
                        <td className="p-5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                        </td>

                        <td className="p-5">
                          <p className="font-medium text-[#6B4F3A]">
                            {item.name}
                          </p>

                          {item.sku && (
                            <p className="mt-1 text-xs text-gray-500">
                              SKU: {item.sku}
                            </p>
                          )}
                        </td>

                        <td className="p-5">{item.category}</td>
                        <td className="p-5">₹{item.price}</td>

                        <td className="p-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              Number(item.stock) > 5
                                ? "bg-green-100 text-green-700"
                                : Number(item.stock) > 0
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.stock}
                          </span>
                        </td>

                        <td className="p-5">{galleryCount}</td>

                        <td className="p-5">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-lg border px-4 py-2"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteProduct(item)}
                              className="rounded-lg bg-red-500 px-4 py-2 text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#6B4F3A]">
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Main image, gallery and product details manage karo.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-3xl disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                editingId ? handleUpdateProduct : handleAddProduct
              }
              className="space-y-7"
            >
              <section className="rounded-2xl border p-5">
                <h3 className="text-lg font-semibold text-[#6B4F3A]">
                  Product Images
                </h3>

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Main Product Image *
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setImageFile(event.target.files?.[0] || null)
                      }
                      className="w-full rounded-xl border px-4 py-3"
                    />

                    {(imageFile || editingImage) && (
                      <img
                        src={
                          imageFile
                            ? URL.createObjectURL(imageFile)
                            : editingImage
                        }
                        alt="Main product preview"
                        className="mt-4 h-44 w-full rounded-2xl object-cover"
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Gallery Images
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) =>
                        setGalleryFiles(Array.from(event.target.files || []))
                      }
                      className="w-full rounded-xl border px-4 py-3"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Multiple images select kar sakte ho. Har image 5 MB se kam ho.
                    </p>
                  </div>
                </div>

                {(existingGalleryImages.length > 0 ||
                  galleryFiles.length > 0) && (
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {existingGalleryImages.map((imageUrl) => (
                      <div key={imageUrl} className="relative">
                        <img
                          src={imageUrl}
                          alt="Existing gallery"
                          className="h-32 w-full rounded-xl object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeExistingGalleryImage(imageUrl)
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {galleryFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}`}
                        className="relative"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-32 w-full rounded-xl object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeNewGalleryFile(index)}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border p-5">
                <h3 className="text-lg font-semibold text-[#6B4F3A]">
                  Basic Details
                </h3>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Product Name *
                    </label>

                    <input
                      type="text"
                      value={productName}
                      onChange={(event) =>
                        setProductName(event.target.value)
                      }
                      placeholder="Enter product name"
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#6B4F3A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Category *
                    </label>

                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="w-full rounded-xl border px-4 py-3"
                    >
                     <option value="">Select category</option>
<option value="Bags">Bags</option>
<option value="Keychains">Keychains</option>
<option value="Accessories">Accessories</option>
<option value="Bookmarks">Bookmarks</option>
<option value="Wall Hangings">Wall Hangings</option>
<option value="Coasters">Coasters</option>
<option value="Home Decor">Home Decor</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      SKU
                    </label>

                    <input
                      type="text"
                      value={sku}
                      onChange={(event) => setSku(event.target.value)}
                      placeholder="Example: TSK-BAG-001"
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Price *
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="Enter price"
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Stock *
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(event) => setStock(event.target.value)}
                      placeholder="Enter stock quantity"
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Description *
                    </label>

                    <textarea
                      rows="5"
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="Enter product description"
                      className="w-full resize-none rounded-xl border px-4 py-3"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border p-5">
                <h3 className="text-lg font-semibold text-[#6B4F3A]">
                  Specifications
                </h3>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Material
                    </label>

                    <input
                      type="text"
                      value={material}
                      onChange={(event) => setMaterial(event.target.value)}
                      placeholder="Example: Premium cotton cord"
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Dimensions
                    </label>

                    <input
                      type="text"
                      value={dimensions}
                      onChange={(event) =>
                        setDimensions(event.target.value)
                      }
                      placeholder="Example: 12 × 10 inches"
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Weight
                    </label>

                    <input
                      type="text"
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
                      placeholder="Example: 350 g"
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#6B4F3A]">
                      Tags
                    </label>

                    <input
                      type="text"
                      value={tags}
                      onChange={(event) => setTags(event.target.value)}
                      placeholder="bag, macrame, handmade, gifting"
                      className="w-full rounded-xl border px-4 py-3"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Har tag ko comma se separate karo.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border p-5">
                <label className="mb-2 block font-medium text-[#6B4F3A]">
                  Collections
                </label>

                <input
                  type="text"
                  value={collectionSearch}
                  onChange={(event) =>
                    setCollectionSearch(event.target.value)
                  }
                  placeholder="Search collections..."
                  className="mb-4 w-full rounded-xl border px-4 py-3"
                />

                <div className="max-h-60 overflow-y-auto rounded-2xl border">
                  {collectionsLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading collections...
                    </div>
                  ) : filteredCollections.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No collections found.
                    </div>
                  ) : (
                    filteredCollections.map((collection) => (
                      <label
                        key={collection.id}
                        className="flex cursor-pointer items-center justify-between border-b px-4 py-3 hover:bg-[#F8F5F1]"
                      >
                        <div>
                          <p className="font-medium text-[#6B4F3A]">
                            {collection.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {collection.status}
                            {!collection.active ? " • Inactive" : ""}
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={selectedCollectionIds.includes(
                            collection.id
                          )}
                          onChange={() =>
                            toggleCollection(collection.id)
                          }
                        />
                      </label>
                    ))
                  )}
                </div>

                <p className="mt-2 text-sm text-[#A67C52]">
                  Selected: {selectedCollectionIds.length}
                </p>
              </section>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) =>
                      setFeatured(event.target.checked)
                    }
                  />
                  Featured Product
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={(event) =>
                      setBestseller(event.target.checked)
                    }
                  />
                  Bestseller
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#6B4F3A] px-5 py-3 text-[#6B4F3A] disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#6B4F3A] px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
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
              Product, gallery images aur collection mappings delete ho jayengi.
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