import { supabase } from "../lib/supabase";

export async function getCustomerProfile(userId) {
  const { data, error } = await supabase
    .from("customer_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveCustomerProfile(userId, profile) {
  const payload = {
    id: userId,
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    pincode: profile.pincode || "",
  };

  const { data, error } = await supabase
    .from("customer_profiles")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}