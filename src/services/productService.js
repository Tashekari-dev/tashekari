import { supabase } from "../lib/supabase";

function formatProduct(item) {
  return {
    ...item,
    raw_price: Number(item.price || 0),
    price: `₹${Number(item.price || 0).toLocaleString("en-IN")}`,
  };
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
    .single();

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

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const cleanName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${cleanName}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(uniqueName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(uniqueName);

  if (!data?.publicUrl) {
    throw new Error("Image ka public URL generate nahi hua.");
  }

  return data.publicUrl;
}

export async function createProduct(productData, imageFile) {
  let imageUrl = productData.image || "";

  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile);
  }

  const productPayload = {
    ...productData,
    image: imageUrl,
    price: Number(productData.price),
    stock: Number(productData.stock || 0),
    featured: Boolean(productData.featured),
    bestseller: Boolean(productData.bestseller),
  };

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
  imageFile
) {
  let imageUrl = productData.image || "";

  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile);
  }

  const productPayload = {
    ...productData,
    image: imageUrl,
    price: Number(productData.price),
    stock: Number(productData.stock || 0),
    featured: Boolean(productData.featured),
    bestseller: Boolean(productData.bestseller),
  };

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
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw error;
  }

  return true;
}