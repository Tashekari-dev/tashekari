import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    todayOrders: 0,
todayRevenue: 0,
thisMonthRevenue: 0,
averageOrderValue: 0,
    pending: 0,
    packed: 0,
    shipped: 0,
    delivered: 0,
    products: 0,
    lowStock: 0,
    customOrders: 0,
    pendingCustomOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [sevenDaySales, setSevenDaySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] =
  useState([]);
  const [recentReviews, setRecentReviews] =
  useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        setError("");

       const [
  { data: ordersData, error: ordersError },
  { data: productsData, error: productsError },
  { data: recentOrdersData, error: recentOrdersError },
  { data: customOrdersData, error: customOrdersError },
   { data: reviewsData, error: reviewsError },
] = await Promise.all([
        supabase
  .from("orders")
  .select(
    "amount, payment_status, status, created_at, items"
  ),

         supabase
  .from("products")
  .select(
    "id, name, image, price, stock"
  ),

          supabase
            .from("orders")
            .select(
              "id, customer_name, amount, payment_method, payment_status, status, created_at"
            )
            .order("created_at", { ascending: false })
            .limit(5),

          supabase
            .from("custom_orders")
            .select("id, status"),
            supabase
  .from("product_reviews")
  .select(
    `
      id,
      product_id,
      customer_name,
      review_text,
      rating,
      approved,
      created_at
    `
  )
  .order("created_at", {
    ascending: false,
  })
  .limit(5),
        ]);

        if (ordersError) {
          throw ordersError;
        }

        if (productsError) {
          throw productsError;
        }

        if (recentOrdersError) {
          throw recentOrdersError;
        }

        if (customOrdersError) {
          throw customOrdersError;
        }
        if (reviewsError) {
  throw reviewsError;
}

        const orders = ordersData || [];
        const products = productsData || [];
        const customOrders = customOrdersData || [];

      const totalRevenue = orders.reduce(
  (total, order) => {
    if (order.payment_status === "paid") {
      return total + Number(order.amount || 0);
    }

    return total;
  },
  0
);

const today = new Date();

const todayString = today.toDateString();

const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const paidOrders = orders.filter(
  (order) => order.payment_status === "paid"
);

const todayOrders = orders.filter((order) => {
  if (!order.created_at) {
    return false;
  }

  return (
    new Date(order.created_at).toDateString() ===
    todayString
  );
});

const todayRevenue = paidOrders.reduce(
  (total, order) => {
    if (!order.created_at) {
      return total;
    }

    const orderDate = new Date(order.created_at);

    if (
      orderDate.toDateString() === todayString
    ) {
      return total + Number(order.amount || 0);
    }

    return total;
  },
  0
);

const thisMonthRevenue = paidOrders.reduce(
  (total, order) => {
    if (!order.created_at) {
      return total;
    }

    const orderDate = new Date(order.created_at);

    if (
      orderDate.getMonth() === currentMonth &&
      orderDate.getFullYear() === currentYear
    ) {
      return total + Number(order.amount || 0);
    }

    return total;
  },
  0
);

const averageOrderValue =
  paidOrders.length > 0
    ? Math.round(
        totalRevenue / paidOrders.length
      )
    : 0;
    const lastSevenDays = Array.from(
  { length: 7 },
  (_, index) => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(
      date.getDate() - (6 - index)
    );

    return date;
  }
);

const sevenDaySalesData =
  lastSevenDays.map((date) => {
    const nextDate = new Date(date);

    nextDate.setDate(
      nextDate.getDate() + 1
    );

    const dailyOrders = paidOrders.filter(
      (order) => {
        if (!order.created_at) {
          return false;
        }

        const orderDate = new Date(
          order.created_at
        );

        return (
          orderDate >= date &&
          orderDate < nextDate
        );
      }
    );

    const revenue = dailyOrders.reduce(
      (total, order) =>
        total + Number(order.amount || 0),
      0
    );

    return {
      date: date.toISOString(),
      label: date.toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
        }
      ),
      fullDate: date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      revenue,
      orders: dailyOrders.length,
    };
  });
  const productSalesMap = new Map();

const validSalesOrders = orders.filter(
  (order) =>
    String(order.status || "Pending").toLowerCase() !==
    "cancelled"
);

validSalesOrders.forEach((order) => {
  const orderItems = Array.isArray(order.items)
    ? order.items
    : [];

  orderItems.forEach((item) => {
    const productId = String(
      item.id || item.product_id || item.name || ""
    );

    if (!productId) {
      return;
    }

    const quantity = Math.max(
      Number(item.quantity || 1),
      1
    );

    const itemPrice = Number(
      String(item.price || 0).replace(
        /[₹,\s]/g,
        ""
      )
    );

    const existingProduct =
      productSalesMap.get(productId) || {
        id: productId,
        name:
          item.name ||
          "Tashekari Product",
        image: item.image || "",
        quantitySold: 0,
        orderCount: 0,
        revenue: 0,
      };

    existingProduct.quantitySold += quantity;
    existingProduct.orderCount += 1;
    existingProduct.revenue +=
      itemPrice * quantity;

    productSalesMap.set(
      productId,
      existingProduct
    );
  });
});

const topProductsData = Array.from(
  productSalesMap.values()
)
  .sort((firstProduct, secondProduct) => {
    if (
      secondProduct.quantitySold !==
      firstProduct.quantitySold
    ) {
      return (
        secondProduct.quantitySold -
        firstProduct.quantitySold
      );
    }

    return (
      secondProduct.revenue -
      firstProduct.revenue
    );
  })
  .slice(0, 5);
  const lowStockProductsData = products
  .filter(
    (product) =>
      Number(product.stock || 0) <= 5
  )
  .sort(
    (firstProduct, secondProduct) =>
      Number(firstProduct.stock || 0) -
      Number(secondProduct.stock || 0)
  )
  .slice(0, 6);
  const productsMap = new Map(
  products.map((product) => [
    String(product.id),
    product,
  ])
);

const recentReviewsData = (
  reviewsData || []
).map((review) => {
  const reviewProduct =
    productsMap.get(
      String(review.product_id)
    );

  return {
    ...review,

    product_name:
      reviewProduct?.name ||
      "Tashekari Product",

    product_image:
      reviewProduct?.image || "",
  };
});
        setRecentOrders(recentOrdersData || []);
        setSevenDaySales(sevenDaySalesData);
        setTopProducts(topProductsData);
        setRecentReviews(recentReviewsData);
        setLowStockProducts(
  lowStockProductsData
);

        setStats({
          orders: orders.length,

          revenue: totalRevenue,
          todayOrders: todayOrders.length,

todayRevenue,

thisMonthRevenue,

averageOrderValue,

          pending: orders.filter(
            (order) => (order.status || "Pending") === "Pending"
          ).length,

          packed: orders.filter(
            (order) => order.status === "Packed"
          ).length,

          shipped: orders.filter(
            (order) => order.status === "Shipped"
          ).length,

          delivered: orders.filter(
            (order) => order.status === "Delivered"
          ).length,

          products: products.length,

          lowStock: products.filter(
            (product) => Number(product.stock || 0) <= 5
          ).length,

          customOrders: customOrders.length,

          pendingCustomOrders: customOrders.filter(
            (order) => (order.status || "Pending") === "Pending"
          ).length,
        });
      } catch (fetchError) {
        console.error("Dashboard stats error:", fetchError);

        setError(
          fetchError?.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: stats.orders,
    },
    {
      label: "Revenue",
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
    },
    {
  label: "Today's Orders",
  value: stats.todayOrders,
},

{
  label: "Today's Revenue",
  value: `₹${stats.todayRevenue.toLocaleString("en-IN")}`,
},

{
  label: "This Month Revenue",
  value: `₹${stats.thisMonthRevenue.toLocaleString("en-IN")}`,
},

{
  label: "Average Order",
  value: `₹${stats.averageOrderValue.toLocaleString("en-IN")}`,
},
    {
      label: "Pending Orders",
      value: stats.pending,
    },
    {
      label: "Packed Orders",
      value: stats.packed,
    },
    {
      label: "Shipped Orders",
      value: stats.shipped,
    },
    {
      label: "Delivered Orders",
      value: stats.delivered,
    },
    {
      label: "Products",
      value: stats.products,
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
    },
    {
      label: "Custom Orders",
      value: stats.customOrders,
    },
    {
      label: "Pending Custom",
      value: stats.pendingCustomOrders,
    },
  ];
  const maximumDailyRevenue = Math.max(
  ...sevenDaySales.map(
    (day) => Number(day.revenue || 0)
  ),
  1
);

const sevenDayRevenue =
  sevenDaySales.reduce(
    (total, day) =>
      total + Number(day.revenue || 0),
    0
  );

const sevenDayOrders =
  sevenDaySales.reduce(
    (total, day) =>
      total + Number(day.orders || 0),
    0
  );
  const pendingReviewsCount =
  recentReviews.filter(
    (review) => !review.approved
  ).length;

const notificationItems = [
  {
    id: "pending-orders",
    title: "Pending Orders",
    message:
      stats.pending > 0
        ? `${stats.pending} customer ${
            stats.pending === 1
              ? "order needs"
              : "orders need"
          } attention.`
        : "No pending customer orders.",
    count: stats.pending,
    link: "/admin/orders",
    buttonLabel: "View Orders",
    badgeClasses:
      stats.pending > 0
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700",
  },

  {
    id: "custom-orders",
    title: "Pending Custom Orders",
    message:
      stats.pendingCustomOrders > 0
        ? `${stats.pendingCustomOrders} custom ${
            stats.pendingCustomOrders === 1
              ? "request is"
              : "requests are"
          } waiting for review.`
        : "No pending custom-order requests.",
    count: stats.pendingCustomOrders,
    link: "/admin/custom-orders",
    buttonLabel: "View Requests",
    badgeClasses:
      stats.pendingCustomOrders > 0
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700",
  },

  {
    id: "low-stock",
    title: "Inventory Alerts",
    message:
      lowStockProducts.length > 0
        ? `${lowStockProducts.length} ${
            lowStockProducts.length === 1
              ? "product has"
              : "products have"
          } five or fewer units remaining.`
        : "All product stock levels are healthy.",
    count: lowStockProducts.length,
    link: "/admin/products",
    buttonLabel: "View Products",
    badgeClasses:
      lowStockProducts.length > 0
        ? "bg-orange-100 text-orange-700"
        : "bg-green-100 text-green-700",
  },

  {
    id: "pending-reviews",
    title: "Pending Reviews",
    message:
      pendingReviewsCount > 0
        ? `${pendingReviewsCount} customer ${
            pendingReviewsCount === 1
              ? "review needs"
              : "reviews need"
          } approval.`
        : "No customer reviews are waiting.",
    count: pendingReviewsCount,
    link: "/admin/reviews",
    buttonLabel: "Manage Reviews",
    badgeClasses:
      pendingReviewsCount > 0
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700",
  },
];

const totalNotifications =
  notificationItems.reduce(
    (total, notification) =>
      total +
      Number(notification.count || 0),
    0
  );
async function exportOrdersCSV() {
  if (!recentOrders.length) {
    alert("No orders available to export.");
    return;
  }

  try {
    console.log("NEW EXCEL EXPORT WORKING");
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Tashekari";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(
      "Orders Report",
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
        header: "Customer",
        key: "customer",
        width: 26,
      },
      {
        header: "Amount (₹)",
        key: "amount",
        width: 16,
      },
      {
        header: "Payment Method",
        key: "paymentMethod",
        width: 20,
      },
      {
        header: "Payment Status",
        key: "paymentStatus",
        width: 20,
      },
      {
        header: "Order Status",
        key: "orderStatus",
        width: 18,
      },
      {
        header: "Order Date",
        key: "orderDate",
        width: 18,
      },
    ];

    recentOrders.forEach((order) => {
      worksheet.addRow({
        customer:
          order.customer_name || "Unknown",

        amount:
          Number(order.amount || 0),

        paymentMethod:
          order.payment_method || "—",

        paymentStatus:
          order.payment_status || "pending",

        orderStatus:
          order.status || "Pending",

        orderDate:
          order.created_at
            ? new Date(order.created_at)
            : null,
      });
    });

    const headerRow = worksheet.getRow(1);

    headerRow.height = 24;

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
        vertical: "middle",
        horizontal: "center",
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
      to: "F1",
    };

    worksheet.getColumn("amount").numFmt =
      '₹#,##0.00';

    worksheet.getColumn("orderDate").numFmt =
      "dd-mm-yyyy";

    worksheet.eachRow(
      {
        includeEmpty: false,
      },
      (row, rowNumber) => {
        if (rowNumber === 1) {
          return;
        }

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
      `tashekari-orders-report-${reportDate}.xlsx`
    );
  } catch (exportError) {
    console.error(
      "Excel export error:",
      exportError
    );

    alert(
      "Unable to export the Excel report."
    );
  }
}

  return (
    <AdminLayout>
     <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
  <div>
    <h1 className="font-heading text-4xl font-semibold text-[#6B4F3A]">
      Admin Dashboard
    </h1>

    <p className="mt-3 font-body text-gray-600">
      Welcome to Tashekari Admin Panel
    </p>
  </div>

  <button
    type="button"
    onClick={exportOrdersCSV}
    className="rounded-full bg-[#6B4F3A] px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-[#A67C52]"
  >
    Export Orders Excel
  </button>
</div>

      {loading && (
        <p className="mt-8 font-body text-gray-500">
          Loading dashboard...
        </p>
      )}

      {error && (
        <div className="mt-8 rounded-2xl bg-red-50 px-5 py-4 font-body text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <p className="font-body text-sm text-gray-500">
                  {card.label}
                </p>

                <h2 className="mt-3 font-heading text-4xl font-semibold text-[#6B4F3A]">
                  {card.value}
                </h2>
              </div>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm">
  <div className="flex flex-col gap-4 border-b border-[#E7D8CA] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="font-body text-xs uppercase tracking-[0.25em] text-[#A67C52]">
        Admin Alerts
      </p>

      <h2 className="mt-2 font-heading text-3xl font-semibold text-[#6B4F3A]">
        Notification Center
      </h2>

      <p className="mt-1 font-body text-sm text-gray-500">
        Important store updates that may need your
        attention.
      </p>
    </div>

    <div
      className={`w-fit rounded-2xl px-5 py-3 ${
        totalNotifications > 0
          ? "bg-red-50"
          : "bg-green-50"
      }`}
    >
      <p className="font-body text-xs text-gray-500">
        Active Alerts
      </p>

      <p
        className={`mt-1 font-heading text-2xl font-semibold ${
          totalNotifications > 0
            ? "text-red-600"
            : "text-green-700"
        }`}
      >
        {totalNotifications}
      </p>
    </div>
  </div>

  <div className="grid gap-px bg-[#E7D8CA] md:grid-cols-2 xl:grid-cols-4">
    {notificationItems.map(
      (notification) => (
        <div
          key={notification.id}
          className="flex min-h-[230px] flex-col bg-white p-6 transition hover:bg-[#F8F5F1]"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-heading text-2xl font-semibold text-[#6B4F3A]">
              {notification.title}
            </h3>

            <span
              className={`flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full px-3 font-body text-sm font-semibold ${notification.badgeClasses}`}
            >
              {notification.count}
            </span>
          </div>

          <p className="mt-4 flex-1 font-body text-sm leading-6 text-gray-500">
            {notification.message}
          </p>

          <a
            href={notification.link}
            className="mt-6 w-fit font-body text-sm font-semibold text-[#6B4F3A] underline decoration-[#A67C52] underline-offset-4 transition hover:text-[#A67C52]"
          >
            {notification.buttonLabel} →
          </a>
        </div>
      )
    )}
  </div>
</div>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <p className="font-body text-xs uppercase tracking-[0.25em] text-[#A67C52]">
        Sales Analytics
      </p>

      <h2 className="mt-3 font-heading text-3xl font-semibold text-[#6B4F3A]">
        Last 7 Days Revenue
      </h2>

      <p className="mt-2 font-body text-sm text-gray-500">
        Revenue from successfully paid orders.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-[#F8F5F1] px-5 py-4">
        <p className="font-body text-xs text-gray-500">
          Revenue
        </p>

        <p className="mt-2 font-heading text-2xl font-semibold text-[#6B4F3A]">
          ₹
          {sevenDayRevenue.toLocaleString(
            "en-IN"
          )}
        </p>
      </div>

      <div className="rounded-2xl bg-[#F8F5F1] px-5 py-4">
        <p className="font-body text-xs text-gray-500">
          Orders
        </p>

        <p className="mt-2 font-heading text-2xl font-semibold text-[#6B4F3A]">
          {sevenDayOrders}
        </p>
      </div>
    </div>
  </div>

  <div className="mt-10 overflow-x-auto pb-2">
    <div className="flex min-w-[650px] items-end gap-4 border-b border-[#E7D8CA] px-2 pt-6">
      {sevenDaySales.map((day) => {
        const barHeight =
          day.revenue > 0
            ? Math.max(
                (day.revenue /
                  maximumDailyRevenue) *
                  220,
                20
              )
            : 6;

        return (
          <div
            key={day.date}
            className="group flex min-w-0 flex-1 flex-col items-center"
          >
            <div className="mb-3 min-h-[42px] text-center">
              <p className="font-body text-xs font-semibold text-[#6B4F3A]">
                ₹
                {Number(
                  day.revenue || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              <p className="mt-1 font-body text-[11px] text-gray-400">
                {day.orders}{" "}
                {day.orders === 1
                  ? "order"
                  : "orders"}
              </p>
            </div>

            <div className="flex h-[220px] w-full items-end justify-center">
              <div
                title={`${day.fullDate}: ₹${Number(
                  day.revenue || 0
                ).toLocaleString(
                  "en-IN"
                )}`}
                className={`w-full max-w-[64px] rounded-t-2xl transition-all duration-500 group-hover:opacity-80 ${
                  day.revenue > 0
                    ? "bg-[#A67C52]"
                    : "bg-[#E7D8CA]"
                }`}
                style={{
                  height: `${barHeight}px`,
                }}
              />
            </div>

            <div className="py-4 text-center">
              <p className="font-body text-sm font-semibold text-[#6B4F3A]">
                {day.label}
              </p>

              <p className="mt-1 font-body text-xs text-gray-400">
                {day.fullDate}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>
<div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm">
  <div className="flex flex-col gap-4 border-b border-[#E7D8CA] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="font-body text-xs uppercase tracking-[0.25em] text-[#A67C52]">
        Product Analytics
      </p>

      <h2 className="mt-2 font-heading text-3xl font-semibold text-[#6B4F3A]">
        Top Selling Products
      </h2>

      <p className="mt-1 font-body text-sm text-gray-500">
        Best-performing products from non-cancelled
        customer orders.
      </p>
    </div>

    <div className="w-fit rounded-2xl bg-[#F8F5F1] px-5 py-3">
      <p className="font-body text-xs text-gray-500">
        Products Ranked
      </p>

      <p className="mt-1 font-heading text-2xl font-semibold text-[#6B4F3A]">
        {topProducts.length}
      </p>
    </div>
  </div>

  {topProducts.length === 0 ? (
    <div className="px-6 py-12 text-center">
      <h3 className="font-heading text-2xl font-semibold text-[#6B4F3A]">
        No Product Sales Yet
      </h3>

      <p className="mt-2 font-body text-sm text-gray-500">
        Product rankings will appear after customers
        place orders.
      </p>
    </div>
  ) : (
    <div className="divide-y divide-[#E7D8CA]">
      {topProducts.map((product, index) => (
        <div
          key={product.id}
          className="flex flex-col gap-5 px-6 py-5 transition hover:bg-[#F8F5F1]/70 sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B4F3A] font-heading text-lg font-semibold text-white">
              {index + 1}
            </div>

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F8F5F1] font-body text-xs text-gray-400">
                No Image
              </div>
            )}

            <div className="min-w-0">
              <h3 className="truncate font-heading text-2xl font-semibold text-[#6B4F3A]">
                {product.name}
              </h3>

              <p className="mt-1 font-body text-sm text-gray-500">
                {product.orderCount}{" "}
                {product.orderCount === 1
                  ? "order entry"
                  : "order entries"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
            <div className="rounded-2xl bg-[#F8F5F1] px-4 py-3">
              <p className="font-body text-xs text-gray-500">
                Units Sold
              </p>

              <p className="mt-1 font-heading text-2xl font-semibold text-[#6B4F3A]">
                {product.quantitySold}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F5F1] px-4 py-3">
              <p className="font-body text-xs text-gray-500">
                Order Value
              </p>

              <p className="mt-1 font-heading text-2xl font-semibold text-[#6B4F3A]">
                ₹
                {Number(
                  product.revenue || 0
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
<div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm">
  <div className="flex flex-col gap-4 border-b border-[#E7D8CA] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="font-body text-xs uppercase tracking-[0.25em] text-[#A67C52]">
        Inventory Alert
      </p>

      <h2 className="mt-2 font-heading text-3xl font-semibold text-[#6B4F3A]">
        Low Stock Products
      </h2>

      <p className="mt-1 font-body text-sm text-gray-500">
        Products with five or fewer units remaining.
      </p>
    </div>

    <a
      href="/admin/products"
      className="w-fit rounded-full border border-[#6B4F3A] px-5 py-2.5 font-body text-sm font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white"
    >
      View Products →
    </a>
  </div>

  {lowStockProducts.length === 0 ? (
    <div className="px-6 py-12 text-center">
      <div className="text-4xl">✓</div>

      <h3 className="mt-4 font-heading text-2xl font-semibold text-[#6B4F3A]">
        Stock Levels Are Healthy
      </h3>

      <p className="mt-2 font-body text-sm text-gray-500">
        No products currently have five or fewer
        units.
      </p>
    </div>
  ) : (
    <div className="divide-y divide-[#E7D8CA]">
      {lowStockProducts.map((product) => {
        const currentStock = Number(
          product.stock || 0
        );

        const isOutOfStock =
          currentStock === 0;

        const isCritical =
          currentStock > 0 &&
          currentStock <= 2;

        return (
          <div
            key={product.id}
            className="flex flex-col gap-5 px-6 py-5 transition hover:bg-[#F8F5F1]/70 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              {product.image ? (
                <img
                  src={product.image}
                  alt={
                    product.name ||
                    "Tashekari Product"
                  }
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F8F5F1] font-body text-xs text-gray-400">
                  No Image
                </div>
              )}

              <div className="min-w-0">
                <h3 className="truncate font-heading text-2xl font-semibold text-[#6B4F3A]">
                  {product.name ||
                    "Tashekari Product"}
                </h3>

                <p className="mt-1 font-body text-sm text-gray-500">
                  ₹
                  {Number(
                    product.price || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-[#F8F5F1] px-5 py-3">
                <p className="font-body text-xs text-gray-500">
                  Current Stock
                </p>

                <p className="mt-1 font-heading text-2xl font-semibold text-[#6B4F3A]">
                  {currentStock}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 font-body text-xs font-semibold ${
                  isOutOfStock
                    ? "bg-red-100 text-red-700"
                    : isCritical
                      ? "bg-orange-100 text-orange-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : isCritical
                    ? "Critical Stock"
                    : "Low Stock"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

<div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm">
  <div className="flex flex-col gap-4 border-b border-[#E7D8CA] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="font-body text-xs uppercase tracking-[0.25em] text-[#A67C52]">
        Customer Feedback
      </p>

      <h2 className="mt-2 font-heading text-3xl font-semibold text-[#6B4F3A]">
        Recent Reviews
      </h2>

      <p className="mt-1 font-body text-sm text-gray-500">
        Latest customer reviews submitted for your
        products.
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-2xl bg-[#F8F5F1] px-5 py-3">
        <p className="font-body text-xs text-gray-500">
          Pending
        </p>

        <p className="mt-1 font-heading text-2xl font-semibold text-[#6B4F3A]">
          {
            recentReviews.filter(
              (review) => !review.approved
            ).length
          }
        </p>
      </div>

      <a
        href="/admin/reviews"
        className="rounded-full border border-[#6B4F3A] px-5 py-2.5 font-body text-sm font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white"
      >
        Manage Reviews →
      </a>
    </div>
  </div>

  {recentReviews.length === 0 ? (
    <div className="px-6 py-12 text-center">
      <div className="text-4xl">☆</div>

      <h3 className="mt-4 font-heading text-2xl font-semibold text-[#6B4F3A]">
        No Reviews Yet
      </h3>

      <p className="mt-2 font-body text-sm text-gray-500">
        Customer reviews will appear here after they
        are submitted.
      </p>
    </div>
  ) : (
    <div className="divide-y divide-[#E7D8CA]">
      {recentReviews.map((review) => (
        <div
          key={review.id}
          className="flex flex-col gap-5 px-6 py-5 transition hover:bg-[#F8F5F1]/70 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex min-w-0 flex-1 gap-4">
            {review.product_image ? (
              <img
                src={review.product_image}
                alt={review.product_name}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F8F5F1] font-body text-xs text-gray-400">
                No Image
              </div>
            )}

            <div className="min-w-0">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-[#A67C52]">
                {review.product_name}
              </p>

              <div
                className="mt-2 flex text-lg"
                aria-label={`${Number(
                  review.rating || 0
                )} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <=
                      Number(review.rating || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="mt-3 font-body leading-7 text-gray-600">
                “{review.review_text}”
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-xs text-gray-500">
                <span>
                  Customer:{" "}
                  <strong className="font-medium text-[#6B4F3A]">
                    {review.customer_name ||
                      "Tashekari Customer"}
                  </strong>
                </span>

                <span>
                  {review.created_at
                    ? new Date(
                        review.created_at
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`w-fit shrink-0 rounded-full px-4 py-2 font-body text-xs font-semibold ${
              review.approved
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {review.approved
              ? "Approved"
              : "Pending"}
          </span>
        </div>
      ))}
    </div>
  )}
</div>
          <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="border-b border-[#E7D8CA] px-6 py-5">
              <h2 className="font-heading text-2xl font-semibold text-[#6B4F3A]">
                Recent Orders
              </h2>

              <p className="mt-1 font-body text-sm text-gray-500">
                Latest 5 customer orders.
              </p>
            </div>

            {recentOrders.length === 0 ? (
              <div className="px-6 py-10 text-center font-body text-gray-500">
                No recent orders found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-[#F8F5F1]">
                    <tr className="font-body text-sm text-[#6B4F3A]">
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Order Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-[#E7D8CA] font-body text-sm text-gray-700"
                      >
                        <td className="px-6 py-5 font-semibold text-[#6B4F3A]">
                          {order.customer_name || "Unknown"}
                        </td>

                        <td className="px-6 py-5 font-semibold text-[#6B4F3A]">
                          ₹
                          {Number(order.amount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-6 py-5 capitalize">
                          {order.payment_method || "—"}

                          <span
                            className={`ml-2 rounded-full px-2 py-1 text-xs ${
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
                                    : order.status === "Cancelled"
                                      ? "bg-gray-200 text-gray-700"
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}