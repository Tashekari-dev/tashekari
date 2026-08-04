import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
const [paymentFilter, setPaymentFilter] = useState("All");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [ordersPerPage, setOrdersPerPage] = useState(10);
function resetFilters() {
  setSearchTerm("");
  setStatusFilter("All");
  setPaymentFilter("All");
  setFromDate("");
  setToDate("");
}
function filterToday() {
  const today = new Date()
    .toLocaleDateString("en-CA");

  setFromDate(today);
  setToDate(today);
}

function filterLast7Days() {
  const today = new Date();

  const last7DaysStart = new Date(today);

  last7DaysStart.setDate(
    today.getDate() - 6
  );

  setFromDate(
    last7DaysStart.toLocaleDateString("en-CA")
  );

  setToDate(
    today.toLocaleDateString("en-CA")
  );
}

function filterThisMonth() {
  const today = new Date();

  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  setFromDate(
    firstDayOfMonth.toLocaleDateString("en-CA")
  );

  setToDate(
    today.toLocaleDateString("en-CA")
  );
}

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
  const normalizedSearchTerm = searchTerm
  .trim()
  .toLowerCase();

const filteredOrders = orders.filter((order) => {
  const matchesSearch =
    !normalizedSearchTerm ||
    [
      order.id,
      order.customer_name,
      order.email,
      order.phone,
      order.razorpay_order_id,
      order.razorpay_payment_id,
      order.tracking_number,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(normalizedSearchTerm)
    );

  const matchesStatus =
    statusFilter === "All" ||
    (order.status || "Pending") === statusFilter;

  const matchesPayment =
  paymentFilter === "All" ||
  (order.payment_status || "pending") === paymentFilter;

const orderDate = order.created_at
  ? new Date(order.created_at)
  : null;

const matchesFromDate =
  !fromDate ||
  (orderDate &&
    orderDate >= new Date(fromDate));

const matchesToDate =
  !toDate ||
  (orderDate &&
    orderDate <=
      new Date(`${toDate}T23:59:59`));

return (
  matchesSearch &&
  matchesStatus &&
  matchesPayment &&
  matchesFromDate &&
  matchesToDate
);
});
useEffect(() => {
  setCurrentPage(1);
}, [
  searchTerm,
  statusFilter,
  paymentFilter,
  fromDate,
  toDate,
  ordersPerPage,
]);
const totalPages = Math.max(
  Math.ceil(filteredOrders.length / ordersPerPage),
  1
);

const safeCurrentPage = Math.min(
  currentPage,
  totalPages
);

const startOrderIndex =
  (safeCurrentPage - 1) * ordersPerPage;

const endOrderIndex =
  startOrderIndex + ordersPerPage;

const paginatedOrders = filteredOrders.slice(
  startOrderIndex,
  endOrderIndex
);
async function exportFilteredOrdersExcel() {
  if (filteredOrders.length === 0) {
    toast.dismiss();
    toast.error(
      "Export karne ke liye koi matching order nahi hai."
    );
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Tashekari";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(
      "Filtered Orders",
      {
        views: [
          {
            state: "frozen",
            ySplit: 1,
          },
        ],
      }
    );

    worksheet.columns = [
      {
        header: "Order ID",
        key: "orderId",
        width: 38,
      },
      {
        header: "Customer",
        key: "customer",
        width: 24,
      },
      {
        header: "Email",
        key: "email",
        width: 30,
      },
      {
        header: "Phone",
        key: "phone",
        width: 16,
      },
      {
        header: "Amount (₹)",
        key: "amount",
        width: 16,
      },
      {
        header: "Payment Method",
        key: "paymentMethod",
        width: 18,
      },
      {
        header: "Payment Status",
        key: "paymentStatus",
        width: 18,
      },
      {
        header: "Order Status",
        key: "orderStatus",
        width: 18,
      },
      {
        header: "Order Date",
        key: "orderDate",
        width: 16,
      },
      {
        header: "Courier",
        key: "courier",
        width: 20,
      },
      {
        header: "Tracking Number",
        key: "trackingNumber",
        width: 24,
      },
    ];

    filteredOrders.forEach((order) => {
      worksheet.addRow({
        orderId: order.id || "—",
        customer:
          order.customer_name || "Unknown",
        email: order.email || "—",
        phone: order.phone || "—",
        amount: Number(order.amount || 0),
        paymentMethod:
          order.payment_method || "—",
        paymentStatus:
          order.payment_status || "pending",
        orderStatus:
          order.status || "Pending",
        orderDate: order.created_at
          ? new Date(order.created_at)
          : null,
        courier: order.courier_name || "—",
        trackingNumber:
          order.tracking_number || "—",
      });
    });

    const headerRow = worksheet.getRow(1);

    headerRow.height = 26;

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF6B4F3A",
        },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = {
        top: {
          style: "thin",
          color: {
            argb: "FFE7D8CA",
          },
        },
        left: {
          style: "thin",
          color: {
            argb: "FFE7D8CA",
          },
        },
        bottom: {
          style: "thin",
          color: {
            argb: "FFE7D8CA",
          },
        },
        right: {
          style: "thin",
          color: {
            argb: "FFE7D8CA",
          },
        },
      };
    });

    worksheet.autoFilter = {
      from: "A1",
      to: "K1",
    };

    worksheet.getColumn("amount").numFmt =
      '₹#,##0.00';

    worksheet.getColumn("orderDate").numFmt =
      "dd-mm-yyyy";

    worksheet.eachRow(
      { includeEmpty: false },
      (row, rowNumber) => {
        if (rowNumber === 1) return;

        row.height = 22;

        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
          };

          cell.border = {
            bottom: {
              style: "thin",
              color: {
                argb: "FFE7D8CA",
              },
            },
          };
        });
      }
    );

    const reportDate = new Date()
      .toLocaleDateString("en-CA");

    const buffer =
      await workbook.xlsx.writeBuffer();

    const file = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      file,
      `tashekari-filtered-orders-${reportDate}.xlsx`
    );

    toast.dismiss();
    toast.success(
      `${filteredOrders.length} filtered orders exported.`
    );
  } catch (exportError) {
    console.error(
      "Filtered orders export error:",
      exportError
    );

    toast.dismiss();
    toast.error(
      "Filtered orders Excel me export nahi ho sake."
    );
  }
}

  return (
    <AdminLayout>
     <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-4xl font-bold text-[#6B4F3A]">
      Orders
    </h1>

    <p className="mt-3 text-gray-600">
      Manage all customer orders.
    </p>
  </div>

  <button
    type="button"
    onClick={exportFilteredOrdersExcel}
    disabled={
      loading ||
      filteredOrders.length === 0
    }
    className="w-fit rounded-full bg-[#6B4F3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A67C52] disabled:cursor-not-allowed disabled:opacity-50"
  >
    Export Filtered Excel
  </button>
</div>

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
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p className="font-body text-sm text-gray-600">
        Total Orders:{" "}
        <span className="font-semibold text-[#6B4F3A]">
          {orders.length}
        </span>
      </p>

      <p className="mt-1 font-body text-xs text-gray-400">
        Showing {filteredOrders.length} matching{" "}
        {filteredOrders.length === 1 ? "order" : "orders"}.
      </p>
    </div>

    <div className="w-full lg:max-w-md">
      <label
        htmlFor="order-search"
        className="sr-only"
      >
        Search orders
      </label>

      <input
        id="order-search"
        type="search"
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
        placeholder="Search customer, order ID, phone or payment ID..."
        className="w-full rounded-2xl border border-[#E7D8CA] bg-[#F8F5F1] px-5 py-3 font-body text-sm text-[#6B4F3A] outline-none transition placeholder:text-gray-400 focus:border-[#A67C52] focus:bg-white"
      />
      <div className="mt-3 flex gap-3">
  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className="rounded-xl border border-[#E7D8CA] px-3 py-2 text-sm"
  >
    <option>All</option>
    <option>Pending</option>
    <option>Packed</option>
    <option>Shipped</option>
    <option>Delivered</option>
    <option>Cancelled</option>
  </select>

  <select
    value={paymentFilter}
    onChange={(e) =>
      setPaymentFilter(e.target.value)
    }
    className="rounded-xl border border-[#E7D8CA] px-3 py-2 text-sm"
  >
    <option>All</option>
    <option value="paid">Paid</option>
    <option value="pending">Pending</option>
  </select>
</div>
<div className="mt-3 grid grid-cols-2 gap-3">
  <input
    type="date"
    value={fromDate}
    onChange={(event) =>
      setFromDate(event.target.value)
    }
    className="rounded-xl border border-[#E7D8CA] px-3 py-2 text-sm"
  />

  <input
    type="date"
    value={toDate}
    onChange={(event) =>
      setToDate(event.target.value)
    }
    className="rounded-xl border border-[#E7D8CA] px-3 py-2 text-sm"
  />
</div>
<div className="mt-3 flex justify-end">
  <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
  <button
    onClick={filterToday}
    className="rounded-lg border border-[#E7D8CA] px-3 py-2 text-sm hover:bg-[#F8F5F1]"
  >
    Today
  </button>

  <button
    onClick={filterLast7Days}
    className="rounded-lg border border-[#E7D8CA] px-3 py-2 text-sm hover:bg-[#F8F5F1]"
  >
    Last 7 Days
  </button>

  <button
    onClick={filterThisMonth}
    className="rounded-lg border border-[#E7D8CA] px-3 py-2 text-sm hover:bg-[#F8F5F1]"
  >
    This Month
  </button>
</div>
  <button
    type="button"
    onClick={resetFilters}
    className="ml-3 rounded-xl border border-[#6B4F3A] px-4 py-2 text-sm font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white"
  >
    Reset Filters
  </button>
</div>
    </div>
  </div>
</div>

          {filteredOrders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">
               {searchTerm.trim()
  ? "No orders match your search."
  : "No orders found."}
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
                  {paginatedOrders.map((order) => (
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
          <div className="flex flex-col gap-4 border-t border-[#E7D8CA] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-center gap-3">
    <label
      htmlFor="orders-per-page"
      className="text-sm text-gray-500"
    >
      Orders per page
    </label>

    <select
      id="orders-per-page"
      value={ordersPerPage}
      onChange={(event) =>
        setOrdersPerPage(
          Number(event.target.value)
        )
      }
      className="rounded-xl border border-[#E7D8CA] bg-white px-3 py-2 text-sm text-[#6B4F3A] outline-none"
    >
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </select>
  </div>

  <p className="text-sm text-gray-500">
    Showing{" "}
    <span className="font-semibold text-[#6B4F3A]">
      {filteredOrders.length === 0
        ? 0
        : startOrderIndex + 1}
    </span>
    {" "}to{" "}
    <span className="font-semibold text-[#6B4F3A]">
      {Math.min(
        endOrderIndex,
        filteredOrders.length
      )}
    </span>
    {" "}of{" "}
    <span className="font-semibold text-[#6B4F3A]">
      {filteredOrders.length}
    </span>
  </p>

  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() =>
        setCurrentPage((page) =>
          Math.max(page - 1, 1)
        )
      }
      disabled={safeCurrentPage === 1}
      className="rounded-xl border border-[#E7D8CA] px-4 py-2 text-sm font-medium text-[#6B4F3A] transition hover:bg-[#F8F5F1] disabled:cursor-not-allowed disabled:opacity-40"
    >
      Previous
    </button>

    <span className="px-3 text-sm text-gray-500">
      Page{" "}
      <strong className="text-[#6B4F3A]">
        {safeCurrentPage}
      </strong>{" "}
      of{" "}
      <strong className="text-[#6B4F3A]">
        {totalPages}
      </strong>
    </span>

    <button
      type="button"
      onClick={() =>
        setCurrentPage((page) =>
          Math.min(page + 1, totalPages)
        )
      }
      disabled={
        safeCurrentPage === totalPages
      }
      className="rounded-xl border border-[#6B4F3A] px-4 py-2 text-sm font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>
  </div>
</div>
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