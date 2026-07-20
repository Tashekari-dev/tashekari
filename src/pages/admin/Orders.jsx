import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const { data, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (ordersError) {
          throw ordersError;
        }

        setOrders(data || []);
      } catch (fetchError) {
        console.error("Orders fetch error:", fetchError);

        setError(
          fetchError?.message || "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-[#6B4F3A]">
        Orders
      </h1>

      <p className="mt-3 text-gray-600">
        Manage all customer orders.
      </p>

      {loading && (
        <p className="mt-8 text-gray-500">
          Loading orders...
        </p>
      )}

      {error && (
        <p className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-[#E7D8CA] px-6 py-5">
            <p className="font-body text-sm text-gray-600">
              Total Orders:{" "}
              <span className="font-semibold text-[#6B4F3A]">
                {orders.length}
              </span>
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No orders found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-[#F8F5F1]">
                  <tr className="text-sm text-[#6B4F3A]">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-[#E7D8CA] text-sm text-gray-700"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#6B4F3A]">
                          {order.customer_name || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {order.email || "No email"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {order.phone || "—"}
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#6B4F3A]">
                        ₹
                        {Number(
                          order.amount || 0
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-5 capitalize">
                        {order.payment_method || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            order.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.payment_status || "pending"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="rounded-full border border-[#6B4F3A] px-4 py-2 text-xs font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white"
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

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#6B4F3A]">
                Order Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-3xl leading-none text-gray-500 transition hover:text-[#6B4F3A]"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">
                  Customer
                </p>
                <p className="mt-1 font-medium text-gray-800">
                  {selectedOrder.customer_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>
                <p className="mt-1 font-medium text-gray-800">
                  {selectedOrder.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>
                <p className="mt-1 break-all font-medium text-gray-800">
                  {selectedOrder.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Amount
                </p>
                <p className="mt-1 font-semibold text-[#6B4F3A]">
                  ₹
                  {Number(
                    selectedOrder.amount || 0
                  ).toLocaleString()}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">
                  Shipping Address
                </p>

                <p className="mt-1 font-medium text-gray-800">
                  {selectedOrder.address || "—"}
                  {selectedOrder.city
                    ? `, ${selectedOrder.city}`
                    : ""}
                  {selectedOrder.state
                    ? `, ${selectedOrder.state}`
                    : ""}
                  {selectedOrder.pincode
                    ? ` - ${selectedOrder.pincode}`
                    : ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment Method
                </p>
                <p className="mt-1 capitalize text-gray-800">
                  {selectedOrder.payment_method || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment Status
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    selectedOrder.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedOrder.payment_status || "pending"}
                </span>
              </div>

              <div className="md:col-span-2 border-t border-[#E7D8CA] pt-5">
                <h3 className="mb-4 text-lg font-semibold text-[#6B4F3A]">
                  Ordered Items
                </h3>

                {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.length > 0 ? (
                  <div className="space-y-3">
                    {selectedOrder.items.map(
                      (item, index) => (
                        <div
                          key={`${item.id || item.name}-${index}`}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-[#E7D8CA] p-4"
                        >
                          <div>
                            <p className="font-medium text-[#6B4F3A]">
                              {item.name || "Product"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>

                          <p className="font-semibold text-[#6B4F3A]">
                         ₹
{(
  Number(
    String(
      item.price ??
      item.product?.price ??
      item.product_price ??
      0
    ).replace(/[^\d.]/g, "")
  ) * Number(item.quantity || 1)
).toLocaleString()}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No items found.
                  </p>
                )}
              </div>

              <div className="md:col-span-2 border-t border-[#E7D8CA] pt-5">
                <div className="flex justify-between py-2 text-gray-700">
                  <span>Total Amount</span>

                  <span className="font-semibold text-[#6B4F3A]">
                    ₹
                    {Number(
                      selectedOrder.amount || 0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-2 text-gray-700">
                  <span>Razorpay Order ID</span>

                  <span className="break-all text-right text-sm">
                    {selectedOrder.razorpay_order_id || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-2 text-gray-700">
                  <span>Razorpay Payment ID</span>

                  <span className="break-all text-right text-sm">
                    {selectedOrder.razorpay_payment_id || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-[#6B4F3A] px-5 py-2 text-[#6B4F3A] transition hover:bg-[#F8F5F1]"
              >
                Print Invoice
              </button>

              <button
                type="button"
                className="rounded-xl bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
              >
                Mark Delivered
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-[#6B4F3A] px-5 py-2 text-white transition hover:bg-[#4E3829]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}