import { supabase } from "../lib/supabase";

const PRODUCT_IMAGE_BUCKET = "product-images";

function normalizeImages(images) {
  if (Array.isArray(images)) {
    return images.filter(Boolean);
  }

  if (typeof images === "string" && images.trim()) {
    try {
      const parsedImages = JSON.parse(images);

      return Array.isArray(parsedImages)
        ? parsedImages.filter(Boolean)
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function formatProduct(item) {
  if (!item) return null;

  const galleryImages = normalizeImages(item.images);

  const allImages = [
    item.image,
    ...galleryImages,
  ].filter(
    (image, index, array) =>
      image && array.indexOf(image) === index
  );

  return {
    ...item,
    raw_price: Number(item.price || 0),

    price: `₹${Number(
      item.price || 0
    ).toLocaleString("en-IN")}`,

    stock: Number(item.stock || 0),

    featured: Boolean(item.featured),
    bestseller: Boolean(item.bestseller),

    image: item.image || allImages[0] || "",

    images: galleryImages,
    allImages,

    material: item.material || "",
    dimensions: item.dimensions || "",
    weight: item.weight || "",
    sku: item.sku || "",

    tags: normalizeTags(item.tags),
  };
}

function createSafeFileName(file) {
  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const cleanName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const randomId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${Date.now()}-${randomId}-${
    cleanName || "product"
  }.${extension}`;
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(formatProduct);
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return formatProduct(data);
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(formatProduct);
}

export async function getBestSellerProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("bestseller", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(formatProduct);
}

export async function uploadProductImage(file) {
  if (!file) {
    throw new Error("Image file nahi mili.");
  }

  if (!file.type?.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  const maximumFileSize = 5 * 1024 * 1024;

  if (file.size > maximumFileSize) {
    throw new Error(
      "Image size 5 MB se kam honi chahiye."
    );
  }

  const fileName = createSafeFileName(file);
  const filePath = `products/${fileName}`;

  const { error: uploadError } =
    await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error(
      "Image ka public URL generate nahi hua."
    );
  }

  return data.publicUrl;
}

export async function uploadProductImages(files) {
  const selectedFiles = Array.from(files || []);

  if (selectedFiles.length === 0) {
    return [];
  }

  const uploadedUrls = [];

  try {
    for (const file of selectedFiles) {
      const imageUrl =
        await uploadProductImage(file);

      uploadedUrls.push(imageUrl);
    }

    return uploadedUrls;
  } catch (error) {
    if (uploadedUrls.length > 0) {
      await deleteProductImages(uploadedUrls);
    }

    throw error;
  }
}

export async function deleteProductImage(imageUrl) {
  if (
    !imageUrl ||
    !imageUrl.includes(
      `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`
    )
  ) {
    return false;
  }

  const imagePath = decodeURIComponent(
    imageUrl
      .split(
        `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`
      )[1]
      ?.split("?")[0] || ""
  );

  if (!imagePath) {
    return false;
  }

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([imagePath]);

  if (error) {
    throw error;
  }

  return true;
}

export async function deleteProductImages(imageUrls) {
  const validPaths = (imageUrls || [])
    .map((imageUrl) => {
      if (
        !imageUrl ||
        !imageUrl.includes(
          `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`
        )
      ) {
        return null;
      }

      return decodeURIComponent(
        imageUrl
          .split(
            `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`
          )[1]
          ?.split("?")[0] || ""
      );
    })
    .filter(Boolean);

  if (validPaths.length === 0) {
    return true;
  }

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove(validPaths);

  if (error) {
    throw error;
  }

  return true;
}

function createProductPayload(productData) {
  return {
    name: productData.name?.trim() || "",
    category: productData.category || "",

    price: Number(productData.price || 0),
    stock: Number(productData.stock || 0),

    description:
      productData.description?.trim() || "",

    image: productData.image || "",

    images: normalizeImages(productData.images),

    material:
      productData.material?.trim() || null,

    dimensions:
      productData.dimensions?.trim() || null,

    weight:
      productData.weight?.trim() || null,

    sku: productData.sku?.trim() || null,

    tags: normalizeTags(productData.tags),

    featured: Boolean(productData.featured),
    bestseller: Boolean(productData.bestseller),
  };
}

export async function createProduct(
  productData,
  mainImageFile,
  galleryImageFiles = []
) {
  let mainImageUrl = productData.image || "";
  let galleryImageUrls = normalizeImages(
    productData.images
  );

  if (mainImageFile) {
    mainImageUrl =
      await uploadProductImage(mainImageFile);
  }

  if (galleryImageFiles.length > 0) {
    const uploadedGalleryImages =
      await uploadProductImages(galleryImageFiles);

    galleryImageUrls = [
      ...galleryImageUrls,
      ...uploadedGalleryImages,
    ];
  }

  const productPayload = createProductPayload({
    ...productData,
    image: mainImageUrl,
    images: galleryImageUrls,
  });

  const { data, error } = await supabase
    .from("products")
    .insert([productPayload])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return formatProduct(data);
}

export async function updateProduct(
  productId,
  productData,
  mainImageFile,
  galleryImageFiles = []
) {
  let mainImageUrl = productData.image || "";

  let galleryImageUrls = normalizeImages(
    productData.images
  );

  if (mainImageFile) {
    mainImageUrl =
      await uploadProductImage(mainImageFile);
  }

  if (galleryImageFiles.length > 0) {
    const uploadedGalleryImages =
      await uploadProductImages(galleryImageFiles);

    galleryImageUrls = [
      ...galleryImageUrls,
      ...uploadedGalleryImages,
    ];
  }

  const productPayload = createProductPayload({
    ...productData,
    image: mainImageUrl,
    images: galleryImageUrls,
  });

  const { data, error } = await supabase
    .from("products")
    .update(productPayload)
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return formatProduct(data);
}

export async function deleteProduct(productId) {
  const { data: product, error: fetchError } =
    await supabase
      .from("products")
      .select("image, images")
      .eq("id", productId)
      .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (deleteError) {
    throw deleteError;
  }

  const imageUrls = [
    product?.image,
    ...normalizeImages(product?.images),
  ].filter(Boolean);

  if (imageUrls.length > 0) {
    try {
      await deleteProductImages(imageUrls);
    } catch (storageError) {
      console.error(
        "Product deleted, but image cleanup failed:",
        storageError
      );
    }
  }

  return true;
}