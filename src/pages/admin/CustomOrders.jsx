import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function CustomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("custom_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error("Custom orders fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      return (
        order.name?.toLowerCase().includes(keyword) ||
        order.email?.toLowerCase().includes(keyword) ||
        order.phone?.toLowerCase().includes(keyword) ||
        order.product_type?.toLowerCase().includes(keyword) ||
        order.budget?.toLowerCase().includes(keyword) ||
        order.status?.toLowerCase().includes(keyword)
      );
    });
  }, [orders, search]);

  function getWhatsAppNumber(phone = "") {
  const digits = String(phone).replace(/\D/g, "");

  if (digits.length === 10) {
    return `91${digits}`;
  }

  return digits;
}

function openWhatsApp(order) {
  const phone = getWhatsAppNumber(order.phone);

 if (!phone) {
  toast.dismiss();
  toast.error("Customer phone number is unavailable.");
  return;
}

  const message = encodeURIComponent(
    `Hello ${order.name || "Customer"},\n\nThank you for your custom order request for ${
      order.product_type || "a Tashekari product"
    }.\n\nWe would like to discuss your requirements, pricing and timeline.\n\nRegards,\nTashekari`
  );

  window.open(
    `https://wa.me/${phone}?text=${message}`,
    "_blank",
    "noopener,noreferrer"
  );
}

function openEmail(order) {
 if (!order.email) {
  toast.dismiss();
  toast.error("Customer email address is unavailable.");
  return;
}
  const subject = encodeURIComponent(
    `Tashekari Custom Order - ${order.product_type || "Request"}`
  );

  const body = encodeURIComponent(
    `Hello ${order.name || "Customer"},

Thank you for submitting your custom order request to Tashekari.

Product: ${order.product_type || "Not specified"}
Preferred Colour: ${order.colour || "Not specified"}
Budget: ${order.budget || "Not specified"}
Occasion: ${order.occasion || "Not specified"}

We would like to discuss your requirements, pricing and expected timeline.

Regards,
Tashekari`
  );

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(order.email)}` +
    `&su=${subject}` +
    `&body=${body}`;

  window.open(gmailUrl, "_blank", "noopener,noreferrer");
}

async function deleteCustomOrder(order) {
  const confirmed = window.confirm(
    `Delete the custom order request from ${
      order.name || "this customer"
    }? This will also delete its uploaded image.`
  );

  if (!confirmed) {
    return;
  }

  try {
    // Step 1: Delete image from Supabase Storage
    if (order.image_url) {
      const marker = "/object/public/custom-order-images/";
      const encodedPath = order.image_url.split(marker)[1];

      if (!encodedPath) {
        throw new Error(
          "Unable to identify the image path in Supabase Storage."
        );
      }

      const imagePath = decodeURIComponent(
        encodedPath.split("?")[0]
      );

      console.log("Deleting Storage image:", imagePath);

      const { data: removedFiles, error: storageError } =
        await supabase.storage
          .from("custom-order-images")
          .remove([imagePath]);

      if (storageError) {
        throw new Error(
          `Image deletion failed: ${storageError.message}`
        );
      }

      if (!removedFiles || removedFiles.length === 0) {
        throw new Error(
          "Image was not deleted from Storage. Check the Storage DELETE policy."
        );
      }
    }

    // Step 2: Delete custom order from database
    const { data: deletedRows, error: databaseError } =
      await supabase
        .from("custom_orders")
        .delete()
        .eq("id", order.id)
        .select("id");

    if (databaseError) {
      throw databaseError;
    }

    if (!deletedRows || deletedRows.length === 0) {
      throw new Error(
        "Custom order was not deleted from the database."
      );
    }

    // Step 3: Remove the deleted order from the page
    setOrders((currentOrders) =>
      currentOrders.filter((item) => item.id !== order.id)
    );

    setSelectedOrder(null);

    toast.dismiss();
toast.success("Custom order and its image deleted successfully.");
  } catch (deleteError) {
    console.error("Custom order delete error:", deleteError);

   toast.dismiss();
toast.error(
  deleteError?.message ||
  "Unable to delete the custom order."
);
  }
}

 return (
  <AdminLayout>
      <div className="min-h-screen bg-[#F8F5F1] p-4 sm:p-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-semibold text-[#6B4F3A]">
              Custom Orders
            </h1>

            <p className="mt-2 font-body text-[#75695F]">
              Manage all custom order requests.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search by name, phone or product..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[#D9C6B6] bg-white px-4 py-3 font-body text-[#6B4F3A] outline-none transition focus:border-[#A67C52] md:w-80"
          />
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center font-body text-[#75695F] shadow-sm">
            Loading custom orders...
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow">
            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center">
                <h2 className="font-heading text-3xl font-semibold text-[#6B4F3A]">
                  No Custom Orders Found
                </h2>

                <p className="mt-3 font-body text-sm text-[#75695F]">
                  New custom order requests will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b border-[#E7D8CA] bg-[#F8F5F1]">
                    <tr>
                      <th className="whitespace-nowrap px-5 py-4 text-left font-body text-xs font-semibold uppercase tracking-wider text-[#6B4F3A]">
                        Customer
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left font-body text-xs font-semibold uppercase tracking-wider text-[#6B4F3A]">
                        Product
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left font-body text-xs font-semibold uppercase tracking-wider text-[#6B4F3A]">
                        Budget
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left font-body text-xs font-semibold uppercase tracking-wider text-[#6B4F3A]">
                        Occasion
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left font-body text-xs font-semibold uppercase tracking-wider text-[#6B4F3A]">
                        Status
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left font-body text-xs font-semibold uppercase tracking-wider text-[#6B4F3A]">
                        Date
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left font-body text-xs font-semibold uppercase tracking-wider text-[#6B4F3A]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E7D8CA]">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-[#F8F5F1]/70"
                      >
                        <td className="px-5 py-5">
                          <p className="font-body text-sm font-semibold text-[#6B4F3A]">
                            {order.name || "Unknown Customer"}
                          </p>

                          <p className="mt-1 font-body text-xs text-[#75695F]">
                            {order.email || "No email"}
                          </p>

                          <p className="mt-1 font-body text-xs text-[#75695F]">
                            {order.phone || "No phone"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-body text-sm font-medium text-[#6B4F3A]">
                            {order.product_type || "Not specified"}
                          </p>

                          <p className="mt-1 font-body text-xs text-[#75695F]">
                            Colour: {order.colour || "Not specified"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 font-body text-sm text-[#6B4F3A]">
                          {order.budget || "Not specified"}
                        </td>

                        <td className="px-5 py-5 font-body text-sm text-[#6B4F3A]">
                          {order.occasion || "Not specified"}
                        </td>

                        <td className="px-5 py-5">
                         <select
  value={order.status || "Pending"}
  onChange={async (e) => {
    const newStatus = e.target.value;

    const { error } = await supabase
      .from("custom_orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    if (error) {
      toast.dismiss();
toast.error("Status update failed.");
      return;
    }

    fetchOrders();
  }}
  className="rounded-lg border border-[#D9C6B6] bg-white px-3 py-2 text-sm outline-none"
>
  <option>Pending</option>
  <option>Contacted</option>
  <option>In Progress</option>
  <option>Completed</option>
  <option>Cancelled</option>
</select>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 font-body text-sm text-[#75695F]">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}
                        </td>

                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg bg-[#6B4F3A] px-4 py-2 font-body text-sm text-white transition hover:bg-[#543D2C]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.25em] text-[#A67C52]">
                  Custom Request
                </p>

                <h2 className="mt-2 font-heading text-3xl font-semibold text-[#6B4F3A]">
                  Custom Order Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E7D8CA] text-2xl text-[#75695F] transition hover:border-red-300 hover:text-red-500"
                aria-label="Close custom order details"
              >
                ×
              </button>
            </div>

            <div className="grid gap-5 rounded-2xl bg-[#F8F5F1] p-5 md:grid-cols-2">
              <div>
                <p className="font-body text-xs uppercase tracking-wider text-[#A67C52]">
                  Customer
                </p>
                <p className="mt-1 font-body font-medium text-[#6B4F3A]">
                  {selectedOrder.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-wider text-[#A67C52]">
                  Email
                </p>
                <p className="mt-1 break-all font-body text-[#6B4F3A]">
                  {selectedOrder.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-wider text-[#A67C52]">
                  Phone
                </p>
                <p className="mt-1 font-body text-[#6B4F3A]">
                  {selectedOrder.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-wider text-[#A67C52]">
                  Product
                </p>
                <p className="mt-1 font-body text-[#6B4F3A]">
                  {selectedOrder.product_type || "Not specified"}
                </p>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-wider text-[#A67C52]">
                  Colour
                </p>
                <p className="mt-1 font-body text-[#6B4F3A]">
                  {selectedOrder.colour || "Not specified"}
                </p>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-wider text-[#A67C52]">
                  Budget
                </p>
                <p className="mt-1 font-body text-[#6B4F3A]">
                  {selectedOrder.budget || "Not specified"}
                </p>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-wider text-[#A67C52]">
                  Occasion
                </p>
                <p className="mt-1 font-body text-[#6B4F3A]">
                  {selectedOrder.occasion || "Not specified"}
                </p>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-wider text-[#A67C52]">
                  Status
                </p>
                <p className="mt-1 font-body font-medium text-yellow-700">
                  {selectedOrder.status || "Pending"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-body text-sm font-semibold text-[#6B4F3A]">
                Requirements
              </p>

              <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-[#F8F5F1] p-5 font-body text-sm leading-7 text-[#75695F]">
                {selectedOrder.requirements || "No requirements provided."}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
  <button
    type="button"
    onClick={() => openWhatsApp(selectedOrder)}
    className="rounded-xl bg-green-600 px-5 py-3 font-body text-sm font-medium text-white transition hover:bg-green-700"
  >
    WhatsApp Customer
  </button>

  <button
    type="button"
    onClick={() => openEmail(selectedOrder)}
    className="rounded-xl border border-[#6B4F3A] px-5 py-3 font-body text-sm font-medium text-[#6B4F3A] transition hover:bg-[#F8F5F1]"
  >
    Email Customer
  </button>

  <button
    type="button"
    onClick={() => deleteCustomOrder(selectedOrder)}
    className="rounded-xl bg-red-600 px-5 py-3 font-body text-sm font-medium text-white transition hover:bg-red-700"
  >
    Delete Request
  </button>
</div>

            {selectedOrder.image_url && (
              <div className="mt-6">
                <p className="mb-3 font-body text-sm font-semibold text-[#6B4F3A]">
                  Inspiration Image
                </p>

                <a
                  href={selectedOrder.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <img
                    src={selectedOrder.image_url}
                    alt="Custom order inspiration"
                    className="max-h-[450px] w-full rounded-2xl border border-[#E7D8CA] object-contain"
                  />
                </a>
                
                <div className="mt-4 flex gap-3">
  <a
    href={selectedOrder.image_url}
    target="_blank"
    rel="noreferrer"
    className="rounded-xl bg-[#6B4F3A] px-5 py-3 text-sm font-medium text-white hover:bg-[#543d2c]"
  >
    Open Full Image
  </a>

  <button
  type="button"
 onClick={async () => {
  try {
    await navigator.clipboard.writeText(selectedOrder.image_url);

    toast.dismiss();
    toast.success("Image URL copied!");
  } catch (error) {
    console.error("Image URL copy error:", error);

    toast.dismiss();
    toast.error("Unable to copy image URL.");
  }
}}
    className="rounded-xl border border-[#6B4F3A] px-5 py-3 text-sm font-medium text-[#6B4F3A] hover:bg-[#F8F5F1]"
  >
    Copy Image Link
  </button>
</div>

              </div>
            )}
          </div>
        </div>
      )}
     </AdminLayout>
  );
}