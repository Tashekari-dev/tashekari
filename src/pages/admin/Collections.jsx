import { useEffect, useRef, useState } from "react";
import {
  FaEdit,
  FaImage,
  FaLayerGroup,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

const COLLECTIONS_BUCKET = "collections";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  name: "",
  slug: "",
  description: "",
  cover_image: "",
  banner_image: "",
  featured: false,
  status: "Published",
  sort_order: 0,
  seo_title: "",
  seo_description: "",
};

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");
}

function getStoragePathFromUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  const marker = `/storage/v1/object/public/${COLLECTIONS_BUCKET}/`;
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(
    imageUrl.substring(markerIndex + marker.length)
  );
}

async function removeStorageImage(imageUrl) {
  const storagePath = getStoragePathFromUrl(imageUrl);

  if (!storagePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(COLLECTIONS_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error("Collection image delete error:", error);
  }
}

export default function Collections() {
  const coverInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [collections, setCollections] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingCollection, setEditingCollection] = useState(null);

  const [coverFile, setCoverFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [coverPreview, setCoverPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [removeBannerImage, setRemoveBannerImage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }

      if (bannerPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [coverPreview, bannerPreview]);

  async function fetchCollections() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setCollections(data || []);
    } catch (error) {
      console.error("Fetch collections error:", error);

      toast.dismiss();
      toast.error("Collections load nahi ho payi.");
    } finally {
      setLoading(false);
    }
  }

  function resetImageStates() {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    if (bannerPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }

    setCoverFile(null);
    setBannerFile(null);
    setCoverPreview("");
    setBannerPreview("");
    setRemoveCoverImage(false);
    setRemoveBannerImage(false);

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }

    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleNameChange(event) {
    const name = event.target.value;

    setFormData((currentData) => ({
      ...currentData,
      name,
      slug: editingCollection
        ? currentData.slug
        : createSlug(name),
    }));
  }

  function validateImage(file) {
    if (!file) {
      return false;
    }

    if (!file.type.startsWith("image/")) {
      toast.dismiss();
      toast.error("Sirf image file select karo.");
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.dismiss();
      toast.error("Image size maximum 5 MB honi chahiye.");
      return false;
    }

    return true;
  }

  function handleCoverFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!validateImage(selectedFile)) {
      event.target.value = "";
      return;
    }

    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(selectedFile);
    setCoverPreview(URL.createObjectURL(selectedFile));
    setRemoveCoverImage(false);
  }

  function handleBannerFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!validateImage(selectedFile)) {
      event.target.value = "";
      return;
    }

    if (bannerPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerFile(selectedFile);
    setBannerPreview(URL.createObjectURL(selectedFile));
    setRemoveBannerImage(false);
  }

  function handleRemoveCoverImage() {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(null);
    setCoverPreview("");
    setRemoveCoverImage(true);

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  }

  function handleRemoveBannerImage() {
    if (bannerPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerFile(null);
    setBannerPreview("");
    setRemoveBannerImage(true);

    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  }

  function openCreateForm() {
    resetImageStates();
    setEditingCollection(null);
    setFormData(initialForm);
    setShowForm(true);
  }

  function openEditForm(collection) {
    resetImageStates();

    setEditingCollection(collection);

    setFormData({
      name: collection.name || "",
      slug: collection.slug || "",
      description: collection.description || "",
      cover_image: collection.cover_image || "",
      banner_image: collection.banner_image || "",
      featured: Boolean(collection.featured),
      status: collection.status || "Published",
      sort_order: collection.sort_order ?? 0,
      seo_title: collection.seo_title || "",
      seo_description: collection.seo_description || "",
    });

    setCoverPreview(collection.cover_image || "");
    setBannerPreview(collection.banner_image || "");
    setShowForm(true);
  }

  function closeForm() {
    if (submitting) {
      return;
    }

    resetImageStates();
    setShowForm(false);
    setEditingCollection(null);
    setFormData(initialForm);
  }

  function closeFormAfterSave() {
    resetImageStates();
    setShowForm(false);
    setEditingCollection(null);
    setFormData(initialForm);
  }

  async function uploadCollectionImage(file, imageType, slug) {
    const cleanFileName = sanitizeFileName(file.name);
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${cleanFileName}`;
    const storagePath = `${slug}/${imageType}/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from(COLLECTIONS_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(COLLECTIONS_BUCKET)
      .getPublicUrl(storagePath);

    if (!data?.publicUrl) {
      await supabase.storage
        .from(COLLECTIONS_BUCKET)
        .remove([storagePath]);

      throw new Error("Image public URL generate nahi ho paya.");
    }

    return {
      publicUrl: data.publicUrl,
      storagePath,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedName = formData.name.trim();
    const cleanedSlug = createSlug(
      formData.slug || formData.name
    );

    if (!cleanedName) {
      toast.dismiss();
      toast.error("Collection name enter karo.");
      return;
    }

    if (!cleanedSlug) {
      toast.dismiss();
      toast.error("Valid collection slug enter karo.");
      return;
    }

    const newlyUploadedPaths = [];

    try {
      setSubmitting(true);

      let finalCoverImage = removeCoverImage
        ? null
        : formData.cover_image || null;

      let finalBannerImage = removeBannerImage
        ? null
        : formData.banner_image || null;

      if (coverFile) {
        const uploadedCover = await uploadCollectionImage(
          coverFile,
          "cover",
          cleanedSlug
        );

        finalCoverImage = uploadedCover.publicUrl;
        newlyUploadedPaths.push(uploadedCover.storagePath);
      }

      if (bannerFile) {
        const uploadedBanner = await uploadCollectionImage(
          bannerFile,
          "banner",
          cleanedSlug
        );

        finalBannerImage = uploadedBanner.publicUrl;
        newlyUploadedPaths.push(uploadedBanner.storagePath);
      }

      const payload = {
        name: cleanedName,
        slug: cleanedSlug,
        description: formData.description.trim() || null,
        cover_image: finalCoverImage,
        banner_image: finalBannerImage,
        featured: formData.featured,
        status: formData.status,
        active: formData.status === "Published",
        sort_order: Number(formData.sort_order) || 0,
        seo_title: formData.seo_title.trim() || null,
        seo_description:
          formData.seo_description.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editingCollection) {
        const { error } = await supabase
          .from("collections")
          .update(payload)
          .eq("id", editingCollection.id);

        if (error) {
          throw error;
        }

        const oldCoverImage =
          editingCollection.cover_image || null;
        const oldBannerImage =
          editingCollection.banner_image || null;

        if (
          oldCoverImage &&
          oldCoverImage !== finalCoverImage
        ) {
          await removeStorageImage(oldCoverImage);
        }

        if (
          oldBannerImage &&
          oldBannerImage !== finalBannerImage
        ) {
          await removeStorageImage(oldBannerImage);
        }

        toast.dismiss();
        toast.success("Collection updated successfully.");
      } else {
        const { error } = await supabase
          .from("collections")
          .insert([payload]);

        if (error) {
          throw error;
        }

        toast.dismiss();
        toast.success("Collection created successfully.");
      }

      closeFormAfterSave();
      await fetchCollections();
    } catch (error) {
      console.error("Save collection error:", error);

      if (newlyUploadedPaths.length > 0) {
        const { error: cleanupError } = await supabase.storage
          .from(COLLECTIONS_BUCKET)
          .remove(newlyUploadedPaths);

        if (cleanupError) {
          console.error(
            "Failed uploaded images cleanup error:",
            cleanupError
          );
        }
      }

      toast.dismiss();

      if (error?.code === "23505") {
        toast.error(
          "Is slug ke saath collection pehle se maujood hai."
        );
      } else {
        toast.error(
          error.message || "Collection save nahi ho payi."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(collection) {
    const shouldDelete = window.confirm(
      `"${collection.name}" collection delete karna hai?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collection.id);

      if (error) {
        throw error;
      }

      await Promise.all([
        removeStorageImage(collection.cover_image),
        removeStorageImage(collection.banner_image),
      ]);

      toast.dismiss();
      toast.success("Collection deleted successfully.");

      await fetchCollections();
    } catch (error) {
      console.error("Delete collection error:", error);

      toast.dismiss();
      toast.error(
        error.message || "Collection delete nahi ho payi."
      );
    }
  }

  return (
    <AdminLayout>
      <section>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-[#A67C52]">
              Tashekari Admin
            </p>

            <h1 className="mt-2 font-heading text-4xl font-semibold text-[#6B4F3A]">
              Collections
            </h1>

            <p className="mt-2 max-w-2xl font-body text-sm text-[#75695F]">
              Curated product collections create, edit aur manage
              karo.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6B4F3A] px-6 py-3 font-body text-sm font-medium text-white transition hover:bg-[#4E3829]"
          >
            <FaPlus />
            Add Collection
          </button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-[30px] border border-[#E7D8CA] bg-white">
              <p className="font-body text-sm text-[#75695F]">
                Loading collections...
              </p>
            </div>
          ) : collections.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[30px] border border-dashed border-[#D8C3B2] bg-white px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F5F1] text-2xl text-[#A67C52]">
                <FaLayerGroup />
              </div>

              <h2 className="mt-5 font-heading text-3xl font-semibold text-[#6B4F3A]">
                No collections yet
              </h2>

              <p className="mt-2 max-w-md font-body text-sm text-[#75695F]">
                The Espresso Collection ya Bags Collection jaisi
                apni pehli collection banao.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6B4F3A] px-6 py-3 font-body text-sm font-medium text-white transition hover:bg-[#4E3829]"
              >
                <FaPlus />
                Create First Collection
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {collections.map((collection) => (
                <article
                  key={collection.id}
                  className="overflow-hidden rounded-[28px] border border-[#E7D8CA] bg-white shadow-sm"
                >
                  <div className="relative h-52 bg-[#F1E8E0]">
                    {collection.cover_image ? (
                      <img
                        src={collection.cover_image}
                        alt={collection.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-[#A67C52]">
                        <FaImage />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 font-body text-xs font-medium ${
                          collection.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {collection.status || "Published"}
                      </span>

                      {collection.featured && (
                        <span className="rounded-full bg-[#6B4F3A] px-3 py-1 font-body text-xs font-medium text-white">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-[#A67C52]">
                      /{collection.slug}
                    </p>

                    <h2 className="mt-2 font-heading text-3xl font-semibold text-[#6B4F3A]">
                      {collection.name}
                    </h2>

                    <p className="mt-3 line-clamp-3 min-h-[63px] font-body text-sm leading-6 text-[#75695F]">
                      {collection.description ||
                        "No collection description added yet."}
                    </p>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(collection)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#6B4F3A] px-4 py-2.5 font-body text-sm font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white"
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(collection)
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-red-200 text-red-500 transition hover:bg-red-50"
                        aria-label={`Delete ${collection.name}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 px-4 py-8">
          <div className="mx-auto w-full max-w-4xl rounded-[30px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7D8CA] px-6 py-5 sm:px-8">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.25em] text-[#A67C52]">
                  Collection Details
                </p>

                <h2 className="mt-1 font-heading text-3xl font-semibold text-[#6B4F3A]">
                  {editingCollection
                    ? "Edit Collection"
                    : "Create Collection"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F5F1] text-[#6B4F3A] transition hover:bg-[#E7D8CA] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close collection form"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="font-body text-sm font-medium text-[#6B4F3A]"
                  >
                    Collection Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="The Espresso Collection"
                    required
                    className="mt-2 w-full rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1] px-4 py-3 font-body text-sm text-[#6B4F3A] outline-none transition focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="font-body text-sm font-medium text-[#6B4F3A]"
                  >
                    Slug *
                  </label>

                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="the-espresso-collection"
                    required
                    className="mt-2 w-full rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1] px-4 py-3 font-body text-sm text-[#6B4F3A] outline-none transition focus:border-[#A67C52]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="font-body text-sm font-medium text-[#6B4F3A]"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Collection ki story aur details..."
                    className="mt-2 w-full resize-none rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1] px-4 py-3 font-body text-sm text-[#6B4F3A] outline-none transition focus:border-[#A67C52]"
                  />
                </div>

                <ImageUploadField
                  title="Cover Image"
                  description="Collection card ke liye square ya portrait image."
                  preview={coverPreview}
                  inputRef={coverInputRef}
                  onChange={handleCoverFileChange}
                  onRemove={handleRemoveCoverImage}
                  recommendedSize="Recommended: 1200 × 1200 px"
                />

                <ImageUploadField
                  title="Banner Image"
                  description="Collection detail page ke top banner ke liye."
                  preview={bannerPreview}
                  inputRef={bannerInputRef}
                  onChange={handleBannerFileChange}
                  onRemove={handleRemoveBannerImage}
                  recommendedSize="Recommended: 1920 × 700 px"
                  banner
                />

                <div>
                  <label
                    htmlFor="status"
                    className="font-body text-sm font-medium text-[#6B4F3A]"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1] px-4 py-3 font-body text-sm text-[#6B4F3A] outline-none transition focus:border-[#A67C52]"
                  >
                    <option value="Published">
                      Published
                    </option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sort_order"
                    className="font-body text-sm font-medium text-[#6B4F3A]"
                  >
                    Sort Order
                  </label>

                  <input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1] px-4 py-3 font-body text-sm text-[#6B4F3A] outline-none transition focus:border-[#A67C52]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1] px-4 py-4">
                    <input
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 accent-[#6B4F3A]"
                    />

                    <span className="font-body text-sm font-medium text-[#6B4F3A]">
                      Show as featured collection
                    </span>
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="seo_title"
                    className="font-body text-sm font-medium text-[#6B4F3A]"
                  >
                    SEO Title
                  </label>

                  <input
                    id="seo_title"
                    name="seo_title"
                    type="text"
                    value={formData.seo_title}
                    onChange={handleInputChange}
                    placeholder="The Espresso Collection | Tashekari"
                    className="mt-2 w-full rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1] px-4 py-3 font-body text-sm text-[#6B4F3A] outline-none transition focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="seo_description"
                    className="font-body text-sm font-medium text-[#6B4F3A]"
                  >
                    SEO Description
                  </label>

                  <input
                    id="seo_description"
                    name="seo_description"
                    type="text"
                    value={formData.seo_description}
                    onChange={handleInputChange}
                    placeholder="Handmade coffee-inspired collection..."
                    className="mt-2 w-full rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1] px-4 py-3 font-body text-sm text-[#6B4F3A] outline-none transition focus:border-[#A67C52]"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-full border border-[#6B4F3A] px-6 py-3 font-body text-sm font-medium text-[#6B4F3A] transition hover:bg-[#F8F5F1] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#6B4F3A] px-7 py-3 font-body text-sm font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Uploading & Saving..."
                    : editingCollection
                      ? "Update Collection"
                      : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function ImageUploadField({
  title,
  description,
  preview,
  inputRef,
  onChange,
  onRemove,
  recommendedSize,
  banner = false,
}) {
  return (
    <div>
      <p className="font-body text-sm font-medium text-[#6B4F3A]">
        {title}
      </p>

      <p className="mt-1 font-body text-xs text-[#8A7B70]">
        {description}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      {preview ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-[#D8C3B2] bg-[#F8F5F1]">
          <div
            className={
              banner ? "h-44 w-full" : "h-56 w-full"
            }
          >
            <img
              src={preview}
              alt={`${title} preview`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 p-4 sm:flex-row">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#6B4F3A] px-4 py-2.5 font-body text-xs font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white"
            >
              <FaUpload />
              Replace Image
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2.5 font-body text-xs font-medium text-red-500 transition hover:bg-red-50"
            >
              <FaTrash />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#CDAF97] bg-[#F8F5F1] px-5 text-center transition hover:border-[#A67C52] hover:bg-[#F3EBE4]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg text-[#A67C52] shadow-sm">
            <FaUpload />
          </span>

          <span className="mt-4 font-body text-sm font-medium text-[#6B4F3A]">
            Upload {title}
          </span>

          <span className="mt-1 font-body text-xs text-[#8A7B70]">
            JPG, PNG, WEBP — Maximum 5 MB
          </span>

          <span className="mt-1 font-body text-xs text-[#A67C52]">
            {recommendedSize}
          </span>
        </button>
      )}
    </div>
  );
}