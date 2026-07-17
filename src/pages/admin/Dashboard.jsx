import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardCards from "../../components/admin/DashboardCards";
import ProductModal from "../../components/admin/ProductModal";
import ProductTable from "../../components/admin/ProductTable";
import SearchBar from "../../components/admin/SearchBar";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import { signOut } from "../../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async ({
  productData,
  imageFile,
}) => {
  try {
    setSaving(true);

    if (editingProduct) {
      await updateProduct(
        editingProduct.id,
        productData,
        imageFile
      );

      alert("Product updated successfully!");
    } else {
      await createProduct(
        productData,
        imageFile
      );

      alert("Product added successfully!");
    }

    await loadProducts();

    setModalOpen(false);
    setEditingProduct(null);
  } catch (error) {
    console.error("Product save error:", error);

    alert(
      error?.message ||
        "Product save nahi ho paaya."
    );
  } finally {
    setSaving(false);
  }
};

  const handleDeleteProduct = async (product) => {
    const ok = window.confirm(
      `Delete "${product.name}" ?`
    );

    if (!ok) return;

    try {
      setDeletingId(product.id);

      await deleteProduct(product.id);

      setProducts((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
    } catch (error) {
      console.error(error);

      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();

    navigate("/admin/login");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };
    return (
    <main className="min-h-screen bg-[#F8F5F1]">
      {/* Header */}
      <header className="border-b border-[#E7D8CA] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A67C52]">
              Tashekari Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold text-[#6B4F3A]">
              Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddProduct}
              className="rounded-full bg-[#6B4F3A] px-6 py-3 text-white transition hover:bg-[#4E3829]"
            >
              + Add Product
            </button>

            <button
              onClick={handleLogout}
              className="rounded-full border border-[#6B4F3A] px-6 py-3 text-[#6B4F3A] transition hover:bg-[#F8F5F1]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Dashboard Cards */}
        <DashboardCards
          products={products}
        />

        {/* Search */}
        <SearchBar
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onClear={clearFilters}
        />

        {/* Products */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-3xl font-semibold text-[#6B4F3A]">
                Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage all Tashekari products.
              </p>
            </div>

            <div className="rounded-full bg-[#F8F5F1] px-4 py-2 text-sm text-[#6B4F3A]">
              {filteredProducts.length} Products
            </div>

          </div>

          {loading ? (

            <div className="py-20 text-center text-gray-500">
              Loading products...
            </div>

          ) : (

            <ProductTable
              products={filteredProducts}
              deletingId={deletingId}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />

          )}

        </div>

      </section>

      {/* Modal */}

      <ProductModal
        isOpen={modalOpen}
        title={
          editingProduct
            ? "Edit Product"
            : "Add Product"
        }
        initialData={editingProduct}
        loading={saving}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct}
      />
    </main>
  );
}