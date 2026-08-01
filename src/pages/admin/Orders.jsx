import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [courierName, setCourierName] = useState("");
const [trackingNumber, setTrackingNumber] = useState("");
const [savingTracking, setSavingTracking] = useState(false);

 async function updateOrderStatus(status) {
  if (!selectedOrder) return;

  const previousStatus =
    selectedOrder.status || "Pending";

  if (status === previousStatus) {
    return;
  }

  if (
    status === "Shipped" &&
    (!selectedOrder.courier_name?.trim() ||
      !selectedOrder.tracking_number?.trim())
  ) {
    toast.dismiss();
    toast.error(
      "Shipped karne se pehle courier partner aur tracking number save karo."
    );
    return;
  }

  try {
    setUpdatingStatus(true);
    toast.dismiss();

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status,
      })
      .eq("id", selectedOrder.id);

    if (updateError) {
      throw updateError;
    }

    const updatedOrder = {
      ...selectedOrder,
      status,
    };

    setSelectedOrder(updatedOrder);

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === selectedOrder.id
          ? updatedOrder
          : order
      )
    );

    if (
      ["Packed", "Shipped", "Delivered", "Cancelled"].includes(
        status
      )
    ) {
      const { data: emailData, error: emailError } =
        await supabase.functions.invoke(
          "send-order-status-email",
          {
            body: {
              orderId: selectedOrder.id,
              status,
            },
          }
        );

      if (emailError) {
        console.error(
          "Order status email invoke error:",
          emailError
        );

        toast.error(
          `Status ${status} ho gaya, lekin customer email nahi ja saka.`
        );
        return;
      }

      if (!emailData?.success) {
        console.error(
          "Order status email response:",
          emailData
        );

        toast.error(
          emailData?.message ||
            `Status ${status} ho gaya, lekin customer email nahi ja saka.`
        );
        return;
      }

      toast.success(
        `Order ${status} ho gaya aur customer email send ho gaya.`
      );
      return;
    }

    toast.success("Order status updated.");
  } catch (statusError) {
    console.error(
      "Order status update error:",
      statusError
    );

    toast.dismiss();
    toast.error(
      statusError?.message ||
        "Order status update nahi ho saka."
    );
  } finally {
    setUpdatingStatus(false);
  }
}
async function saveTrackingDetails() {
  if (!selectedOrder) return;

  if (!courierName.trim() || !trackingNumber.trim()) {
    toast.dismiss();
toast.error("Please enter courier name and tracking number.");
    return;
  }

  try {
    setSavingTracking(true);

    const { error } = await supabase
      .from("orders")
      .update({
        courier_name: courierName.trim(),
        tracking_number: trackingNumber.trim(),
      })
      .eq("id", selectedOrder.id);

    if (error) throw error;

    const updatedOrder = {
      ...selectedOrder,
      courier_name: courierName.trim(),
      tracking_number: trackingNumber.trim(),
    };

    setSelectedOrder(updatedOrder);

    setOrders((previous) =>
      previous.map((order) =>
        order.id === selectedOrder.id ? updatedOrder : order
      )
    );

    toast.dismiss();
toast.success("Tracking details saved.");
  } catch (error) {
    console.error("Tracking update error:", error);
    toast.dismiss();
toast.error(error.message || "Unable to save tracking details.");
  } finally {
    setSavingTracking(false);
  }
}

const orderSteps = [
  "Pending",
  "Packed",
  "Shipped",
  "Delivered",
];

function isCompleted(currentStatus, step) {
  return (
    orderSteps.indexOf(currentStatus || "Pending") >=
    orderSteps.indexOf(step)
  );
}
function generateInvoice(order) {
  if (!order) return;

  const doc = new jsPDF();

  const invoiceNumber = String(order.id || "").slice(0, 8).toUpperCase();
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  doc.setFontSize(22);
  doc.setTextColor(107, 79, 58);
  doc.text("TASHEKARI", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Handmade • Sustainable • Made with Love", 14, 27);

  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("INVOICE", 155, 20);

  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoiceNumber || "—"}`, 145, 28);
  doc.text(`Date: ${orderDate}`, 145, 34);

  doc.setDrawColor(220);
  doc.line(14, 40, 196, 40);

  doc.setFontSize(12);
  doc.setTextColor(107, 79, 58);
  doc.text("Customer Details", 14, 50);

  doc.setFontSize(10);
  doc.setTextColor(0);

  doc.text(`Name: ${order.customer_name || "—"}`, 14, 58);
  doc.text(`Phone: ${order.phone || "—"}`, 14, 64);
  doc.text(`Email: ${order.email || "—"}`, 14, 70);

  const address = [
    order.address,
    order.city,
    order.state,
    order.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const wrappedAddress = doc.splitTextToSize(
    `Shipping Address: ${address || "—"}`,
    90
  );

  doc.text(wrappedAddress, 14, 76);

  doc.setFontSize(12);
  doc.setTextColor(107, 79, 58);
  doc.text("Order Details", 115, 50);

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Order ID: ${order.id || "—"}`, 115, 58);
  doc.text(`Payment: ${order.payment_method || "—"}`, 115, 64);
  doc.text(`Payment Status: ${order.payment_status || "pending"}`, 115, 70);
  doc.text(`Order Status: ${order.status || "Pending"}`, 115, 76);

  const tableRows = Array.isArray(order.items)
    ? order.items.map((item) => {
        const quantity = Number(item.quantity || 1);

        const price = Number(
          String(
            item.price ??
              item.product?.price ??
              item.product_price ??
              0
          ).replace(/[^\d.]/g, "")
        );

        return [
          item.name || "Product",
          quantity,
          `Rs. ${price.toLocaleString("en-IN")}`,
          `Rs. ${(price * quantity).toLocaleString("en-IN")}`,
        ];
      })
    : [];

  autoTable(doc, {
    startY: 95,
    head: [["Product", "Qty", "Price", "Subtotal"]],
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [107, 79, 58],
      textColor: 255,
    },
  });

  const finalY = doc.lastAutoTable?.finalY || 110;

  doc.setFontSize(12);
  doc.setTextColor(107, 79, 58);
  doc.text(
    `Total: Rs. ${Number(order.amount || 0).toLocaleString("en-IN")}`,
    140,
    finalY + 12
  );

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(
    `Courier Partner: ${order.courier_name || "—"}`,
    14,
    finalY + 24
  );

  doc.text(
    `Tracking Number: ${order.tracking_number || "—"}`,
    14,
    finalY + 30
  );

  doc.setDrawColor(220);
  doc.line(14, finalY + 38, 196, finalY + 38);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    "Thank you for supporting handmade products!",
    14,
    finalY + 48
  );

  doc.save(`Tashekari-Invoice-${invoiceNumber || "Order"}.pdf`);
}
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
                   <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Order Status</th>
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
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      order.status === "Delivered"
        ? "bg-green-100 text-green-700"
        : order.status === "Shipped"
        ? "bg-blue-100 text-blue-700"
        : order.status === "Packed"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {order.status || "Pending"}
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
                         onClick={() => {
  setSelectedOrder(order);
  setCourierName(order.courier_name || "");
  setTrackingNumber(order.tracking_number || "");
}}
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
            <div className="md:col-span-2 border-t border-[#E7D8CA] pt-5">
              <div className="md:col-span-2 border-t border-[#E7D8CA] pt-5">
  <h3 className="mb-5 text-lg font-semibold text-[#6B4F3A]">
    Order Timeline
  </h3>

  <div className="grid grid-cols-4 gap-2">
    {orderSteps.map((step, index) => {
      const completed = isCompleted(
        selectedOrder.status || "Pending",
        step
      );

      return (
        <div
          key={step}
          className="relative flex flex-col items-center text-center"
        >
          {index < orderSteps.length - 1 && (
            <div
              className={`absolute left-1/2 top-4 h-1 w-full ${
                isCompleted(
                  selectedOrder.status || "Pending",
                  orderSteps[index + 1]
                )
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
          )}

          <div
            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              completed
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {completed ? "✓" : index + 1}
          </div>

          <p
            className={`mt-3 text-xs font-medium sm:text-sm ${
              completed
                ? "text-green-700"
                : "text-gray-400"
            }`}
          >
            {step}
          </p>
        </div>
      );
    })}
  </div>
</div>
  <h3 className="mb-4 text-lg font-semibold text-[#6B4F3A]">
    Shipping & Tracking
  </h3>

  <div className="grid gap-4 md:grid-cols-2">
    <div>
      <label className="text-sm text-gray-500">
        Courier Partner
      </label>

      <input
        type="text"
        value={courierName}
        onChange={(event) => setCourierName(event.target.value)}
        placeholder="Example: Delhivery"
        className="mt-2 w-full rounded-xl border border-[#E7D8CA] px-4 py-3 outline-none focus:border-[#6B4F3A]"
      />
    </div>

    <div>
      <label className="text-sm text-gray-500">
        Tracking Number
      </label>

      <input
        type="text"
        value={trackingNumber}
        onChange={(event) => setTrackingNumber(event.target.value)}
        placeholder="Enter tracking number"
        className="mt-2 w-full rounded-xl border border-[#E7D8CA] px-4 py-3 outline-none focus:border-[#6B4F3A]"
      />
    </div>
  </div>

  <div className="mt-4 flex justify-end">
    <button
      type="button"
      onClick={saveTrackingDetails}
      disabled={savingTracking}
      className="rounded-xl bg-[#6B4F3A] px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {savingTracking ? "Saving..." : "Save Tracking"}
    </button>
  </div>
</div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
             <button
  type="button"
  onClick={() => generateInvoice(selectedOrder)}
  className="rounded-xl border border-[#6B4F3A] px-5 py-2 text-[#6B4F3A] transition hover:bg-[#F8F5F1]"
>
  Download Invoice
</button>

              <select
  value={selectedOrder.status || "Pending"}
  onChange={(event) =>
    updateOrderStatus(event.target.value)
  }
  disabled={updatingStatus}
  className="rounded-xl border border-[#6B4F3A] bg-white px-4 py-2 text-[#6B4F3A] outline-none"
>
  <option value="Pending">Pending</option>
  <option value="Packed">Packed</option>
  <option value="Shipped">Shipped</option>
  <option value="Delivered">Delivered</option>
  <option value="Cancelled">Cancelled</option>
</select>

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